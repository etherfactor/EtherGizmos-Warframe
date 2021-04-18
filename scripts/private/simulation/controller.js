const superconsole = require('../../../../../scripts/logging/superconsole');

var $Classes = require('../../public/class-definitions/classes');
var $ClassesPriv = require('../class-definitions/classes');

var Sql = require('../sql/connection');

var MaxThreads = 8;

var Simulator = new $ClassesPriv.Simulator(MaxThreads);

/**
 * Queues up a simulation; acts as a wrapper over the basic simulation queueing; intended to identify which simulation is which. *
 * 
 * Ultimately, this probably needs doing-away with eventually.
 * @param {import('../../public/class-definitions/classes').EncodedMessageHandler} messageHandler 
 * @param {import('../../public/class-definitions/classes').Weapon} weapon 
 * @param {import('../../public/class-definitions/classes').Enemy} enemy1 
 * @param {import('../../public/class-definitions/classes').Enemy} enemy2 
 * @param {import('../../public/class-definitions/classes').Enemy} enemy3 
 * @param {import('../../public/class-definitions/classes').Enemy} enemy4 
 * @param {string} simulationType 
 * @param {number} accuracy 
 * @param {number} headshot 
 * @param {{}} additionalSettingsVariables 
 */
async function QueueSimulation(messageHandler, weapon, enemy1, enemy2, enemy3, enemy4, simulationType, accuracy, headshot, additionalSettingsVariables) {
    //When the request was created
    var requestTime = new Date();

    //Enemies to simulate
    var enemies = [ enemy1, enemy2, enemy3, enemy4 ];
    //Keep track of progress
    var statuses = [];
    //Whether the simulation is normalized
    var normalized = simulationType == 'Random' ? false : true;

    //If it's ranked, ensure all of the correct enemies, levels, and settings are set
    if (simulationType == 'Ranked') {
        var simulationData = require('../data/simulation');

        enemies[0] = await simulationData.GetEnemyById('corrupted-heavy-gunner');
        enemies[0].SetLevel(100);
        
        enemies[1] = await simulationData.GetEnemyById('bombard');
        enemies[1].SetLevel(100);
        
        enemies[2] = await simulationData.GetEnemyById('corpus-tech');
        enemies[2].SetLevel(100);
        
        enemies[3] = await simulationData.GetEnemyById('ancient-healer');
        enemies[3].SetLevel(100);

        accuracy = 0.9;
        headshot = 0.5;
    }

    //Keep track of additional settings variables
    var additionalSettingsVariablesToStore = '';
    if (additionalSettingsVariables) {
        var additionalSettingsVariablesKeys = Object.keys(additionalSettingsVariables);
        for (var a = 0; a < additionalSettingsVariablesKeys.length; a++)
        {
            var key = additionalSettingsVariablesKeys[a];
            additionalSettingsVariablesToStore += `${(additionalSettingsVariablesToStore != '' ? ';' : '')}${key}:${additionalSettingsVariables[key]}`;
        }
    }
    if (additionalSettingsVariablesToStore == '') {
        additionalSettingsVariablesToStore = null;
    }

    //Keep track of each simulation id
    var simulationRunIds = [];
    var simulationRunIdsComplete = 0;
    var simulationRunIdsLogged = false;

    //Loop through all enemies to start simulations
    for (var e = 0; e < enemies.length; e++)
    {
        //IIFE to ensure the value of e is kept correct
        (function(e) {
            if (enemies[e] == null) {
                simulationRunIds[e] = -1;
                simulationRunIdsComplete += 1;
                return;
            }

            //Progress is 0 at the start
            statuses[e] = 0;

            //Create a new EncodedMessageHandler for events
            var enemyMessageHandler = new $Classes.EncodedMessageHandler();

            /**
             * Handles SimulationProgress received by the thread
             * @param {import('../../public/class-definitions/classes').SimulationProgress} progress 
             */
            function $_receiveSimulationProgress(progress) {
                //Get the progress of this enemy
                statuses[e] = progress.Progress;

                //Sum up progress across all enemies
                var totalProgress = 0;
                for (var es = 0; es < enemies.length; es++)
                {
                    totalProgress += statuses[es];
                }

                //Average the progress
                totalProgress /= enemies.length;

                //Store total progress
                var totalProgressObject = new $Classes.SimulationProgress()
                    .SetProgress(totalProgress);

                //Encode total progress
                var message = new $Classes.EncodedMessage() 
                    .Encode(totalProgressObject)
                    .ToObject();

                //Send it along
                messageHandler.DoHandle(message);
            }

            /**
             * Handles Metrics received by the thread
             * @param {import('../../public/class-definitions/classes').Metrics} metrics 
             */
            function $_receiveSimulationResults(metrics) {
                //Set the id of metrics, intended for clients
                metrics.SetId(e);

                //Encode metrics
                var message = new $Classes.EncodedMessage()
                    .Encode(metrics)
                    .ToObject();

                //Send it along
                messageHandler.DoHandle(message);

                //All the below functions store the results in the database
                function $_doInsertSimulationModGroup(stack) {
                    Sql.query(
                        `CALL CreateSimulationModGroup( ?, ?, ?, ?, ?, ?, ?, ?, @L_Output );`,
                        [
                            weapon.Mods[0] ? weapon.Mods[0].UrlName : null,
                            weapon.Mods[1] ? weapon.Mods[1].UrlName : null,
                            weapon.Mods[2] ? weapon.Mods[2].UrlName : null,
                            weapon.Mods[3] ? weapon.Mods[3].UrlName : null,
                            weapon.Mods[4] ? weapon.Mods[4].UrlName : null,
                            weapon.Mods[5] ? weapon.Mods[5].UrlName : null,
                            weapon.Mods[6] ? weapon.Mods[6].UrlName : null,
                            weapon.Mods[7] ? weapon.Mods[7].UrlName : null,
                        ],
                        function(err, results) {
                            if (err)
                            {
                                if ((err.message.toLowerCase().includes('deadlock') || err.message.toLowerCase().includes('duplicate entry')) && stack <= 5) {
                                    $_doInsertSimulationModGroup(stack + 1);
                                } else {
                                    superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, '$red:$_doInsertSimulationModGroup error stack:', stack, '$red:-', err);
                                }
                                return;
                            }
        
                            var modGroupId = results[0][0].result;
        
                            function $_doInsertSimulationRun(stack) {
                                Sql.query(
                                    `CALL CreateSimulationRun( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @L_Output );`,
                                    [
                                        weapon.UrlName,
                                        weapon.FiringMode.UrlName,
                                        modGroupId,
                                        additionalSettingsVariablesToStore,
                                        enemies[e].UrlName,
                                        enemies[e].Level,
                                        metrics.KillTime,
                                        metrics.CumulativeTotalDamage,
                                        metrics.CumulativeRawDamage,
                                        metrics.MaximumTotalDamage,
                                        metrics.MaximumRawDamage,
                                        metrics.AverageTotalDamage,
                                        metrics.AverageRawDamage,
                                        metrics.AverageTotalDPS,
                                        metrics.AverageRawDPS
                                    ],
                                    function(err, results) {
                                        if (err)
                                        {
                                            if ((err.message.toLowerCase().includes('deadlock') || err.message.toLowerCase().includes('duplicate entry')) && stack <= 5) {
                                                $_doInsertSimulationRun(stack + 1);
                                            } else {
                                                superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, '$red:$_doInsertSimulationRun error stack:', stack, '$red:-', err);
                                            }
                                            return;
                                        }
            
                                        var simulationRunId = results[0][0].result;
            
                                        var procKeys = Object.keys(metrics.Procs);
                                        for (var p = 0; p < procKeys.length; p++)
                                        {
                                            var procType = parseInt(procKeys[p]);
                                            var procMetrics = metrics.Procs[procType];
            
                                            function $_doInsertSimulationRunProc(stack) {
                                                Sql.query(
                                                    `CALL CreateSimulationRunProc( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );`,
                                                    [
                                                        simulationRunId,
                                                        procType,
                                                        procMetrics.ProcCount,
                                                        procMetrics.TickCount,
                                                        procMetrics.CumulativeDamage,
                                                        procMetrics.MaximumProcDamage,
                                                        procMetrics.MaximumTickDamage,
                                                        procMetrics.AverageProcDamage,
                                                        procMetrics.AverageTickDamage,
                                                        procMetrics.DamageProportion
                                                    ],
                                                    function (err, results) {
                                                        if (err)
                                                        {
                                                            if ((err.message.toLowerCase().includes('deadlock') || err.message.toLowerCase().includes('duplicate entry')) && stack <= 5) {
                                                                $_doInsertSimulationRunProc(stack + 1);
                                                            } else {
                                                                superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, '$red:$_doInsertSimulationRunProc error stack:', stack, '$red:-', err);
                                                            }
                                                            return;
                                                        }
                                                    }
                                                );
                                            }
                                            $_doInsertSimulationRunProc(1);
                                        }
            
                                        simulationRunIds[e] = simulationRunId;
                                        simulationRunIdsComplete += 1;
            
                                        if (simulationRunIdsComplete == 4 && !simulationRunIdsLogged) {
                                            simulationRunIdsLogged = true;
            
                                            function $_doInsertSimulationGroup(stack) {
                                                Sql.query(
                                                    `CALL CreateSimulationGroup( ?, ?, ?, ?, ?, ?, ?, @L_Output )`,
                                                    [
                                                        requestTime,
                                                        normalized,
                                                        simulationType == 'Ranked',
                                                        simulationRunIds[0],
                                                        simulationRunIds[1],
                                                        simulationRunIds[2],
                                                        simulationRunIds[3]
                                                    ],
                                                    function (err, results) {
                                                        if (err)
                                                        {
                                                            if ((err.message.toLowerCase().includes('deadlock') || err.message.toLowerCase().includes('duplicate entry')) && stack <= 5) {
                                                                $_doInsertSimulationGroup(stack + 1);
                                                            } else {
                                                                superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, '$red:$_doInsertSimulationGroup error stack:', stack, '$red:-', err);
                                                            }
                                                            return;
                                                        }
                
                                                        var simulationGroupId = results[0][0].result;
                
                                                        superconsole.log(superconsole.MessageLevel.INFORMATION, `$blue:Data written for simulation group: $white,bright{${simulationGroupId}}`);
                                                    }
                                                );
                                            }
                                            $_doInsertSimulationGroup(1);
                                        }
                                    }
                                );
                            }
                            $_doInsertSimulationRun(1);
                        }
                    );
                }
                $_doInsertSimulationModGroup(1);
            }

            /**
             * Handles SimulationErrors received by the thread
             * @param {import('../../public/class-definitions/classes').SimulationError} error 
             */
            function $_receiveSimulationError(error) {
                //Set the id of the error
                error.SetId(e);

                //Encode the error
                var message = new $Classes.EncodedMessage()
                    .Encode(error)
                    .ToObject();

                //Send it along
                messageHandler.DoHandle(message);
            }

            //Set these events in the EncodedMessageHandler
            enemyMessageHandler.CreateHandle($Classes.SimulationProgress.name, $_receiveSimulationProgress);
            enemyMessageHandler.CreateHandle($Classes.Metrics.name, $_receiveSimulationResults);
            enemyMessageHandler.CreateHandle($Classes.SimulationError.name, $_receiveSimulationError);
            
            //Create a simulation, then run it
            var simulation = Simulator.SpawnSimulation(weapon, enemies[e], normalized, enemyMessageHandler);
            Simulator.QueueSimulation(simulation, accuracy, headshot);
        })(e);
    }
}
module.exports.QueueSimulation = QueueSimulation;