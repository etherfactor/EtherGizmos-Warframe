const path = require('path');
const superconsole = require('../../../../../scripts/logging/superconsole');

//Hack to let 'module' exist in front-end
if (typeof module == 'undefined') {
    module = { exports: {} }
}

//Hack to let 'window' exist in back-end
if (typeof window == 'undefined') {
    window = this;
}

(function(window) {
    const $Classes = require('../../public/class-definitions/classes');

    const MaxSimulationDuration = 999999;

    //Simulation queue
    //Create a simulation
    //Queue one up
    //Fetch expected wait time for a simulation
    //Kick off a simulation

    /**
     * Class to manage all simulations
     */
    class Simulator {
        /**
         * @constructor
         * @param {number} maxThreads - Maximum number of concurrent threads to use for simulations 
         */
        constructor(maxThreads) {
            /** @type {number} - Current number of concurrent threads */
            this.CurrentThreads = 0;

            /** @type {number} - Maximum number of concurrent threads to use for simulations */
            this.MaxThreads = maxThreads;

            /** @type {{ Simulation: SimulationMain, Accuracy: number, Headshot: number }[]} - Queue of simulations waiting to end */
            this.SimulationQueue = [];

            /** @type {array} - Currently running simulations */
            this.SimulationRuns = [];
        }

        /**
         * Create a new simulation
         * @param {import('../../public/class-definitions/classes').Weapon} weapon 
         * @param {import('../../public/class-definitions/classes').Enemy} enemy 
         * @param {boolean} normalized 
         * @param {import('../../public/class-definitions/classes').EncodedMessageHandler} messageHandler 
         */
        SpawnSimulation(weapon, enemy, normalized, messageHandler) {
            //Create a simulation
            var simulation = new SimulationMain(weapon, enemy, normalized, messageHandler);
            return simulation;
        }

        /**
         * Queue up a simulation
         * @param {SimulationMain} simulation 
         */
        QueueSimulation(simulation, accuracy, headshot) {
            //Queue up the simulation
            this.SimulationQueue.push({ Simulation: simulation, Accuracy: accuracy, Headshot: headshot });

            //If threads are available, run the simulation
            if (this.CurrentThreads < this.MaxThreads) {
                this.RunNextSimulation();
            }
        }

        /**
         * Run the next simulation in the queue
         */
        RunNextSimulation() {
            const MAIN = this;
            
            //It's asynchronous
            return new Promise(function (resolve, reject) {
                //If for some reason the simulation is run, pushing threads over the max, fail out
                if (MAIN.CurrentThreads >= MAIN.MaxThreads)
                    throw new Error('Unable to run another simulation! Maximum of (' + MAIN.CurrentThreads + '/' + MAIN.MaxThreads + ') threads reached!');

                //If the queue is empty, fail out
                if (MAIN.SimulationQueue.length == 0)
                    return;

                //Get the next SimulationMain to be run
                var simulation = MAIN.SimulationQueue.shift();

                //Up the thread count
                MAIN.CurrentThreads++;
                superconsole.log(superconsole.MessageLevel.INFORMATION, `$blue:Threads: $white,bright{${MAIN.CurrentThreads}}`);

                //Run the simulation
                simulation.Simulation.Run(simulation.Accuracy, simulation.Headshot).then(() => {
                    //When it finishes, lower the thread count, and queue up the next simulation
                    MAIN.CurrentThreads--;
                    superconsole.log(superconsole.MessageLevel.INFORMATION, `$blue:Threads: $white,bright{${MAIN.CurrentThreads}}`);
                    MAIN.RunNextSimulation();
                });
            });
        }
    }
    $Classes.Simulator = Simulator;
    module.exports.Simulator = Simulator;

    //Keep track of weapon and enemy pair
    //Run the simulation
    //Keep track of progress, update controller upon finishing

    /**
     * Class to manage the simulation from the main thread
     */
    class SimulationMain {
        /**
         * 
         * @param {import('../../public/class-definitions/classes').Weapon} weapon 
         * @param {import('../../public/class-definitions/classes').Enemy} enemy 
         * @param {boolean} normalized 
         * @param {import('../../public/class-definitions/classes').EncodedMessageHandler} messageHandler 
         */
        constructor(weapon, enemy, normalized, messageHandler) {
            /** Weapon currently being simulated */
            this.Weapon = weapon;

            /** Enemy currently being simulated against */
            this.Enemy = enemy;

            //Whether the simulation is normalized (RNG is either random or determinite)
            this.Normalized = normalized;

            //EncodedMessageHandler to handle objects received by the thread
            this.MessageHandler = messageHandler;
        }

        /**
         * Runs the simulation
         * @param {number} accuracy 
         * @param {number} headshot 
         */
        Run(accuracy, headshot) {
            const {
                Worker, isMainThread, parentPort, workerData
            } = require('worker_threads');

            const MAIN = this;

            //Set up data to be sent to the thread
            var data = {
                workerData: {
                    Weapon: this.Weapon.ToObject(),
                    Enemy: this.Enemy.ToObject(),
                    Normalized: this.Normalized,
                    Accuracy: accuracy,
                    Headshot: headshot
                }
            }

            /** @type {import('../../public/class-definitions/classes').Metrics} */
            var metrics = undefined;

            //It's asynchronous
            return new Promise(function (resolve, reject) {
                var thisScriptDir = __dirname;
                var workerPath = path.join(__dirname, '../workers/simulation-runner.js');

                //Create a worker thread
                var w = new Worker(workerPath, data);

                //Whenever the main thread receives a message from the worker thread
                w.on('message', (messageObject) => {
                    //Handle the guaranteed object with the EncodedMessageHandler
                    MAIN.MessageHandler.DoHandle(messageObject);
                });

                //Whenever an error is hit
                w.on('error', (error) => {
                    //Display the error
                    console.error(error);

                    //Create error information
                    var errorObj = new $Classes.SimulationError(MAIN.Enemy)
                        .SetError(error);

                    //Encode it
                    var message = new $Classes.EncodedMessage()
                        .Encode(errorObj)
                        .ToObject();

                    //Pass the error along
                    MAIN.MessageHandler.DoHandle(message);
                });

                //When the thread is terminated
                w.on('exit', (code) => {
                    //If it errored, log as such
                    if (code != 0) {
                        console.error(new Error(`Worker stopped with exit code ${code}`))
                    }

                    //Promise finished
                    resolve();
                });
            });
        }
    }
    $Classes.SimulationMain = SimulationMain;
    module.exports.SimulationMain = SimulationMain;

    /**
     * Class to manage the simulation from a worker thread
     */
    class SimulationThread {
        /**
         * @param {import('../../public/class-definitions/classes').Weapon} weapon - Weapon currently being simulated
         * @param {import('../../public/class-definitions/classes').Enemy} enemy - Enemy currently being simulated against
         * @param {number} rng - RngHandler, used for standard or normalized simulations
         */
        constructor(weapon, enemy, rng) {
            /** @type {import('../../public/class-definitions/classes').Weapon} - Weapon currently being simulated */
            this.Weapon = $Classes.Weapon.FromObject(weapon.ToObject());

            /** @type {import('../../public/class-definitions/classes').Enemy} - Enemy currently being simulated against */
            this.Enemy = enemy;

            /** @type {RngHandler} - RngHandler, used for standard or normalized simulations */
            this.RngHandler = rng;

            /** @type {Object.<string, function(object) => void>} */
            this.Events = {};
        }

        /**
         * Set up an event handler
         * @param {string} event 
         * @param {function(object) => void} callback 
         */
        On(event, callback) {
            this.Events[event] = callback;
        }

        /**
         * Run the simulation, in the thread
         * @param {function} callback 
         */
        Run(accuracy, headshot) {
            //Fetch local copies of weapon/enemy data
            var weapon = this.Weapon;
            var enemy = this.Enemy;
            
            //Create a timer to reside over the simulation
            var timer = new Timer();

            //Create objects to handle runtime instances of static weapon/enemies
            var runtimeWeapon = new RuntimeWeapon(weapon, timer, this.Events, accuracy, headshot);
            var runtimeEnemy = new RuntimeEnemy(enemy, timer, this.Events);

            //Keep track of shots fired
            var shotCount = 0;

            //Track when the simulation started
            var initializeTime = new Date();

            //Loop while enemy is alive, or until 999ks passes in the simulation (a lot of time)
            while (runtimeEnemy.IsAlive && timer.ElapsedTime < MaxSimulationDuration) {
                //Get the next notable events from each runtime object
                var timeStepWeapon = runtimeWeapon.NextEventTimeStep;
                var timeStepEnemy = runtimeEnemy.NextEventTimeStep;

                //Jump to the earliest notable event
                var timeStep = Math.min(timeStepWeapon, timeStepEnemy);
                timer.AddTime(timeStep);

                //Handle buffs
                runtimeWeapon.DoBuffs();

                //If the weapon can shoot
                if (runtimeWeapon.CanShoot) {
                    //Shoot the enemy
                    var [shotRng, identifier] = runtimeWeapon.Shoot(runtimeEnemy, this.RngHandler);
                    shotCount++;

                    //Keep track of metrics from the shot
                    var hitCount = 0;
                    var critCount = {};
                    var headCount = 0;
                    var headCritCount = 0;
                    var procs = [];

                    //Loop through each pellet
                    for (var s = 0; s < shotRng.length; s++)
                    {
                        var shot = shotRng[s];
                        if (shot.Hit) hitCount++;
                        if (shot.Critical != undefined) critCount[shot.Critical] = (critCount[shot.Critical] || 0) + 1;
                        if (shot.Headshot) headCount++;
                        if (shot.Critical && shot.Headshot) headCritCount++;
                        if (shot.Procs != undefined && shot.Procs.length > 0) {
                            procs = procs.concat(shot.Procs);
                        }
                        if (shot.Residuals != undefined && shot.Residuals.length > 0) {
                            for (var r = 0; r < shot.Residuals.length; r++)
                            {
                                procs = procs.concat(shot.Residuals[r].Procs);
                            }
                        }
                    }

                    //Pass along the 'shot' event
                    this.Events['shot'](identifier, {
                        Fired: shotRng.length,
                        Hits: hitCount,
                        Criticals: critCount,
                        Headshots: headCount,
                        HeadCrits: headCritCount,
                        Procs: procs,
                        Time: timer.ElapsedTime
                    });
                    
                } else {
                    //It can't shoot, so do actions such as waiting between shots or reloading
                    runtimeWeapon.PrepareForShot(timeStep);
                }

                //Handle residual effects, like explosions or gas clouds
                runtimeWeapon.DoResiduals(this.RngHandler, runtimeEnemy, this.Events['residual']);

                //Handle procs on the enemy
                runtimeEnemy.DoProcs(timeStep);

                //If over 100 real seconds has passed, or the enemy is dead
                if ((new Date().getTime() - initializeTime.getTime()) / 1000 > 100 || runtimeEnemy.CurrentHealth <= 0) {
                    initializeTime = new Date();

                    //Note progress and pass along the 'progress' event
                    var progress = 1 - runtimeEnemy.CurrentHealth / enemy.Health;
                    this.Events['progress'](progress);

                    //Terminate the loop
                    break;
                }
            }

            //Pass along the 'finish' event
            this.Events['finish'](timer.ElapsedTime, runtimeEnemy);

            //Return various information about the simulation
            return { KillTime: timer.ElapsedTime, ShotCount: shotCount };
        }
    }
    $Classes.SimulationThread = SimulationThread;
    module.exports.SimulationThread = SimulationThread;

    /**
     * Handles simulation time
     */
    class Timer {
        constructor() {
            this.$_ElapsedTime = 0;
        }

        get ElapsedTime() {
            return this.$_ElapsedTime;
        }

        /**
         * @param {number} value
         */
        AddTime(value) {
            this.$_ElapsedTime += value;
        }
    }
    $Classes.Timer = Timer;
    module.exports.Timer = Timer;

    /**
     * A runtime instance of a Weapon object
     */
    class RuntimeWeapon {
        /**
         * @constructor
         * @param {import('../../public/class-definitions/classes').Weapon} weapon - Base Weapon being simulated
         */
        constructor(weapon, timer, events, accuracy, headshot) {
            /** @type {import('../../public/class-definitions/classes').Weapon} - Base Weapon being simulated */
            //Note that this is being converted to an object and back to break any potential references to this object in particular
            //Intended to allow modification if necessary, specifically in the form of buffs, but may apply to other cases as well
            this.Weapon = $Classes.Weapon.FromObject(weapon.ToObject());

            /** @type {Timer} */
            this.Timer = timer;
            
            /** @type {number} - Delay in seconds between shots */
            this.ShotDelay = weapon.FireRate > 0 ? (1 / weapon.FireRate) : 0;

            /** @type {number} - Remaining delay in seconds before the next shot */
            this.CurrentShotDelay = this.ShotDelay;

            /** @type {number} - Delay in seconds before shot is fired */
            this.ChargeDelay = weapon.ChargeDelay; //this needs to be set to the weapon's charge delay

            /** @type {number} - Remaining delay in seconds before the next shot is fired */
            this.CurrentChargeDelay = this.ChargeDelay; //this needs to be set to the weapon's charge delay

            /** @type {number} - Number of shots remaining in the magazine */
            this.RemainingMagazine = weapon.MagazineSize;

            /** @type {number} - Amount of time in seconds before the weapon is reloaded */
            this.RemainingReloadDuration = 0;

            /** @type {Object.<string, function(object) => void} Events from SimulationThread */
            this.Events = events;

            /** @type {number} Chance to hit the enemy */
            this.Accuracy = accuracy;

            /** @type {number} Chance to land a headshot on the enemy */
            this.Headshot = headshot;

            /** @type {WeaponFiringModeResidualInstance[]} Residual effects applied */
            this.ResidualInstances = [];

            /** @type {number} The id of the shot being fired */
            this.$_ShotId = 0;
        }

        /**
         * Shoot an enemy with the current weapon
         * @param {RuntimeEnemy} enemy - Enemy to shoot with the current weapon 
         */
        Shoot(enemy, rngHandler) {
            const MAIN = this;
            var weapon = this.Weapon;

            //Get an identifier for the shot
            var identifier = (this.$_ShotId)++;

            //Handle rng that will be used for the shot
            var rng = this.DoShotRng(rngHandler);

            //Tracks whether any shots hit or not; some buffs are removed if no pellets hit the enemy
            var anyHit = false;

            //Loop through each pellet's rng
            for (var p = 0; p < rng.length; p++)
            {
                //Get the rng
                var pelletRng = rng[p];
                anyHit = anyHit || pelletRng.Hit;

                //If the pellet hits
                if (pelletRng.Hit) {
                    //Get damage multipliers
                    var pelletCriticalMultiplier = (pelletRng.Critical * this.Weapon.CriticalMultiplier - (pelletRng.Critical - 1));
                    var pelletHeadshotMultiplier = (pelletRng.Headshot ? this.Weapon.HeadshotMultiplier * 2 : this.Weapon.BodyshotMultiplier);
                    var pelletHeadCritMultiplier = (pelletRng.Critical && pelletRng.Headshot ? 2 : 1);
                    var pelletFactionMultiplier = (this.Weapon.MaxFactionDamageMultiplier);

                    //If the Latron mod effect is in effect
                    if (this.Weapon.AugmentLatronNextShotBonus > 0) {
                        //Add its relevant buff
                        var latronNextShotBonusBuff = new $Classes.Buff(MAIN.Timer, 2)
                            .SetName($Classes.BuffNames.LATRON_NEXT_SHOT_BONUS)
                            .SetCanRefresh(true)
                            .SetMaxStacks(20)
                            .SetRefreshToMaxDurationWhenExpires(false)
                            .AddModEffect($Classes.ModEffect.LATRON_NEXT_SHOT_BONUS_BUFF, this.Weapon.AugmentLatronNextShotBonus);

                        this.Weapon.AddBuff(latronNextShotBonusBuff);
                    }

                    //If the Soma Prime mod effect is in effect
                    if (this.Weapon.AugmentSomaPrimeHitCriticalChance > 0) {
                        //Add its relevant buff
                        var somaPrimeHitCriticalChanceBuff = new $Classes.Buff()
                            .SetName($Classes.BuffNames.SOMA_PRIME_HIT_CRITICAL)
                            .SetCanRefresh(true)
                            .SetMaxBonus(5)
                            .SetRefreshToMaxDurationWhenExpires(false)
                            .AddModEffect($Classes.ModEffect.CRITICAL_CHANCE, this.Weapon.AugmentSomaPrimeHitCriticalChance);

                        this.Weapon.AddBuff(somaPrimeHitCriticalChanceBuff);
                    }

                    //Get various other damage multipliers
                    var otherDamageMultipliers = $_GetOtherMultipliersFromWeapon(this.Weapon);

                    //Deal damage to the enemy
                    enemy.DealDamage(
                        weapon.Damage,
                        {
                            Critical: pelletCriticalMultiplier,
                            Headshot: pelletHeadshotMultiplier,
                            HeadCrit: pelletHeadCritMultiplier,
                            Faction: pelletFactionMultiplier,
                            Other: otherDamageMultipliers
                        },
                        { Identifier: identifier, Source: 'shot' }
                    );

                    //Loop through proc types
                    for (var s = 0; s < pelletRng.Procs.length; s++)
                    {
                        //Create a proc for the proc type, and apply it to the enemy
                        var proc = new Proc(
                            parseInt(pelletRng.Procs[s]),
                            this.Weapon,
                            {
                                Critical: pelletCriticalMultiplier,
                                Headshot: {
                                    Active: pelletRng.Headshot, Multiplier: 2
                                },
                                Faction: pelletFactionMultiplier,
                                Other: otherDamageMultipliers
                            },
                            this.Timer,
                            identifier
                        );
                        enemy.ApplyProc(proc);
                    }

                    //Loop through residuals as well
                    for (var r = 0; r < weapon.Residuals.length; r++)
                    {
                        var residual = weapon.Residuals[r];

                        //For each pellet of the residual (typically 1, but some cluster explosions are more than 1)
                        for (var rp = 0; rp < residual.Pellets; rp++)
                        {
                            //Create a residual instance
                            var instance = residual.Instantiate(WeaponFiringModeResidualInstance, identifier, this.Timer, pelletCriticalMultiplier);

                            //Residual ticks immediately, so it gets put at the start of the residuals array
                            this.ResidualInstances.unshift(instance);
                        }
                    }
                }
            }

            //If the Convectric augment is in effect and the enemy wasn't hit, don't consume ammo
            var canConsumeAmmo = true;
            if (this.Weapon.AugmentConvectrixEfficiency > 0 && !anyHit) {
                canConsumeAmmo = false;
            }

            //If ammo can be consumed, consume it
            if (rng.ConsumeAmmo && canConsumeAmmo) {
                this.RemainingMagazine -= weapon.AmmoConsumption;
            }

            //If there is ammo remaining, reset the shot and charge delays, otherwise reload
            if (this.RemainingMagazine > 0) {
                this.CurrentShotDelay = this.ShotDelay;
                this.CurrentChargeDelay = this.ChargeDelay;
            } else {
                this.RemainingReloadDuration = weapon.ReloadDuration;
                this.CurrentChargeDelay = this.ChargeDelay;
            }

            //If nothing hit, remove relevant buffs that require consecutive hits
            if (!anyHit) {
                this.Weapon.RemoveBuff($Classes.BuffNames.LATRON_NEXT_SHOT_BONUS);
            }

            //Return shot information
            return [rng, identifier];
        }

        /**
         * Jump ahead a certain amount of time, handling shot delays, charge times, or reloads
         * @param {number} timeStep 
         */
        PrepareForShot(timeStep) {
            //If reloading
            if (this.RemainingReloadDuration > 0) {
                //Break apart the time step to ensure it doesn't overflow the time remaining to reload
                var timeStepActual = Math.min(timeStep, this.RemainingReloadDuration);
                this.RemainingReloadDuration -= timeStepActual;

                //If reload time is finished, refill magazine
                if (this.RemainingReloadDuration <= 0) {
                    this.RemainingMagazine = this.Weapon.MagazineSize;
                    //Pass along the 'reload' event
                    this.Events['reload']();
                }

                //Remove the consumed time step
                timeStep -= timeStepActual;
                if (timeStep <= 0)
                    return;
            }

            //If waiting for the next shot
            if (this.CurrentShotDelay > 0) {
                //Break apart the time step to ensure it doesn't overflow the time waiting to shoot
                var timeStepActual = Math.min(timeStep, this.CurrentShotDelay);
                this.CurrentShotDelay -= timeStepActual;

                //Remove the consumed time step
                timeStep -= timeStepActual;
                if (timeStep <= 0)
                    return;
            }

            //If waiting for the weapon to charge
            if (this.CurrentChargeDelay > 0) {
                //Break apart the time step to ensure it doesn't overflow the time remaining to charge
                var timeStepActual = Math.min(timeStep, this.CurrentChargeDelay);
                this.CurrentChargeDelay -= timeStepActual;

                //Remove the consumed time step
                timeStep -= timeStepActual;
                if (timeStep <= 0)
                    return;
            }
        }

        /**
         * 
         * @param {RngHandler} rngHandler 
         * @returns {[{ Hit: boolean, Critical: number, Status: boolean, Headshot: boolean, Procs: number[]}]}
         */
        DoShotRng(rngHandler) {
            /** @type {object} */
            var rngResult = [];

            //Whether ammo is consumed
            rngResult.ConsumeAmmo = false;

            //Get the chance of an extra pellet
            var pelletChance = this.Weapon.Pellets - Math.floor(this.Weapon.Pellets);
            //Get the chance of not consuming ammo
            var consumptionChanceNumber = this.Weapon.AmmoEfficiency;
            //Get critical chance
            var critChance = this.Weapon.CriticalChance - Math.floor(this.Weapon.CriticalChance);
            //Get status chance
            var statusChance = this.Weapon.StatusChance; // - Math.floor(this.StatusChance);

            //Do chance for pellets
            var pelletChance = rngHandler
                .Chance(pelletChance, 'Pellet');

            //Do chance for not consuming ammo
            var consumptionChance = rngHandler
                .Chance(consumptionChanceNumber, 'DontConsumeAmmo');

            //Determine number of pellets to simulate
            var pellets = Math.floor(this.Weapon.Pellets) + (pelletChance.Result.Pellet ? 1 : 0);
            for (var p = 0; p < pellets; p++)
            {
                //Do chance to hit
                var accuracyChance = rngHandler
                    .Chance(this.Accuracy, 'Accuracy');

                //If it didn't hit
                if (!accuracyChance.Result.Accuracy)
                {
                    //Store the dud result
                    rngResult.push({
                        Hit: false,
                        Critical: undefined,
                        Status: undefined,
                        Headshot: undefined,
                        Procs: undefined,

                        Residuals: undefined
                    });
                    continue;
                }

                //If it did hit, get critical and headshot chances
                var remainChance = rngHandler
                    .Chance(critChance, 'Critical')
                    .Chance(this.Headshot, 'Headshot');

                //As well as Vigilante set effect bonuses
                var vigilanteChanceChance = this.Weapon.$_GetModdedProperty($Classes.ModEffect.VIGILANTE_SET_EFFECT);
                var vigilanteChance = remainChance
                    .Chance(vigilanteChanceChance, 'VigilanteSetEffect');

                //As well as Hunter Munitions mod effect bonuses
                var hunterChanceChance = this.Weapon.$_GetModdedProperty($Classes.ModEffect.HUNTER_MUNITIONS_EFFECT);
                var hunterChance = vigilanteChance
                    .Chance(hunterChanceChance, 'HunterMunitions');

                //As well as Internal Bleeding mod bonuses
                var internalBleedingChanceChance = this.Weapon.$_GetModdedProperty($Classes.ModEffect.INTERNAL_BLEEDING_EFFECT);
                if (this.Weapon.$_GetModdedProperty($Classes.ModEffect.FIRE_RATE) < 2.5) {
                    internalBleedingChanceChance *= 2;
                }

                //Do procs for this pellet
                var procs = $_DoProcs(this.Weapon.Damage, statusChance, rngHandler, remainChance, '');

                //Determine base critical level
                var criticalLevel = Math.floor(this.Weapon.CriticalChance);

                //If Hunter Munitions proc'd and the shot was a crit, apply a slash proc
                if (hunterChance.Result.HunterMunitions && (remainChance.Result.Critical || criticalLevel > 0)) {
                    procs.push($Classes.DamageType.SLASH);
                }

                //If the shot succeeded in the crit check, up the critical level once more
                if (remainChance.Result.Critical) {
                    criticalLevel++;
                }

                //If the Vigilante check succeeded, up the critical level once more
                if (criticalLevel > 0 && vigilanteChance.Result.VigilanteSetEffect) {
                    criticalLevel++;
                }

                //Loop through the procs and roll Internal Bleeding for every impact proc
                for (var pe = 0; pe < procs.length; pe++) {
                    if (procs[pe] == $Classes.DamageType.IMPACT) {
                        var internalBleedingChance = vigilanteChance
                            .Chance(internalBleedingChanceChance, 'InternalBleeding');

                        if (internalBleedingChance.Result.InternalBleeding) {
                            procs.push($Classes.DamageType.SLASH);
                        }
                    }
                }

                //Store the shot result
                rngResult.push({
                    Hit: true,
                    Critical: criticalLevel,
                    Status: remainChance.Result.Status,
                    Headshot: remainChance.Result.Headshot,
                    Procs: procs
                });
            }

            //Set whether or not ammo is consumed
            rngResult.ConsumeAmmo = !consumptionChance.Result.DontConsumeAmmo;

            return rngResult;
        }

        /**
         * Handles weapon residual effects
         * @param {RngHandler} rngHandler 
         * @param {RuntimeEnemy} enemy 
         */
        DoResiduals(rngHandler, enemy, residualEvent) {
            //If there are no residuals, there's not much to do
            if (this.ResidualInstances.length == 0)
                return;

            /** @type {WeaponFiringModeResidualInstance} */
            var instance;

            //Loop through residuals, until the first residual in the list isn't ready to tick
            //Since we insert new residuals to the start of the list, and they tick immediately, new ones won't cause problems
            //Likewise, all residuals tick once per second, so since we add residuals that just ticked to the end of the array, those will avoid issues as well
            while (this.ResidualInstances.length > 0 && this.ResidualInstances[0].NextElapsedTick <= this.Timer.ElapsedTime)
            {
                //Get the next residual
                instance = this.ResidualInstances.shift();

                //Get the damage it deals
                var damage = instance.Residual.Damage;

                //See DoShotRng for the logic in this section

                var critChance = this.Weapon.CriticalChance - Math.floor(this.Weapon.CriticalChance);
                var statusChance = this.Weapon.StatusChance; // - Math.floor(this.StatusChance);

                var remainChance = rngHandler
                    .Chance(critChance, `Residual${instance.$_Id}Critical`)
                    .Chance(this.Headshot, `Residual${instance.$_Id}Headshot`);

                var vigilanteChanceChance = this.Weapon.$_GetModdedProperty($Classes.ModEffect.VIGILANTE_SET_EFFECT);
                var vigilanteChance = remainChance
                    .Chance(vigilanteChanceChance, `Residual${instance.$_Id}VigilanteSetEffect`);

                var hunterChanceChance = this.Weapon.$_GetModdedProperty($Classes.ModEffect.HUNTER_MUNITIONS_EFFECT);
                var hunterChance = vigilanteChance
                    .Chance(hunterChanceChance, `Residual${instance.$_Id}HunterMunitions`);

                var criticalLevel = Math.floor(this.Weapon.CriticalChance);

                if (remainChance.Result[`Residual${instance.$_Id}Critical`]) {
                    criticalLevel++;
                }

                if (criticalLevel > 0 && vigilanteChance.Result[`Residual${instance.$_Id}VigilanteSetEffect`]) {
                    criticalLevel++;
                }

                var residualCriticalMultiplier =
                    instance.Residual.InheritCriticalChance
                        ? instance.OverrideCriticalResult
                        : (instance.Residual.CriticalMultiplier - 1) * criticalLevel + 1;
                var residualHeadshotMultiplier = 1; //Do bodyshots affect residual damage?
                var residualHeadCritMultiplier = 1;
                var residualFactionMultiplier = this.Weapon.MaxFactionDamageMultiplier;

                //Deal residual damage
                enemy.DealDamage(
                    damage,
                    {
                        Critical: residualCriticalMultiplier,
                        Headshot: residualHeadshotMultiplier,
                        HeadCrit: residualHeadCritMultiplier,
                        Faction: residualFactionMultiplier
                    },
                    { Identifier: instance.Identifier, Source: 'shot' }
                );

                //Do residual procs
                var procs = $_DoProcs(instance.Residual.Damage, statusChance, rngHandler, remainChance, `Residual${instance.$_Id}`);

                if (hunterChance.Result[`Residual${instance.$_Id}HunterMunitions`] && (remainChance.Result[`Residual${instance.$_Id}Critical`] || criticalLevel > 0)) {
                    procs.push($Classes.DamageType.SLASH);
                }

                var otherDamageMultipliers = $_GetOtherMultipliersFromWeapon(this.Weapon);

                //Loop through and initialize procs, adding them to the enemy
                for (var p = 0; p < procs.length; p++)
                {
                    var procType = procs[p];
                    var proc = new Proc(
                        parseInt(procType),
                        instance,
                        {
                            Critical: residualCriticalMultiplier,
                            Headshot: {
                                Active: false, Multiplier: residualHeadshotMultiplier
                            },
                            Faction: residualFactionMultiplier,
                            Other: otherDamageMultipliers
                        },
                        this.Timer,
                        instance.Identifier
                    );
                    enemy.ApplyProc(proc);
                }

                //The residual will tick in 1 second
                instance.NextElapsedTick += 1;

                //If it still exists, add it to the end of the array (it is the furthest from ticking next)
                if (instance.RemainingDuration > 0) {
                    this.ResidualInstances.push(instance);
                }

                //Pass along the 'residual' event, only tracks procs (damage is handled in a different event)
                residualEvent(instance.Identifier, {
                    Procs: procs
                });
            }
        }

        /**
         * Handle a weapon's buffs
         */
        DoBuffs() {
            //Get all buff keys
            var keys = Object.keys(this.Weapon.Buffs);
            for (var b = 0; b < keys.length; b++) {
                var key = keys[b];
                //Get the buff
                var buff = this.Weapon.Buffs[key];

                //If the buff doesn't exist, there's nothing to do
                if (buff == undefined)
                    continue;

                //Check if the buff's lifetime
                var remainingDuration = buff.RemainingDuration;

                //If it's dead
                if (remainingDuration <= 0) {
                    //If it refreshes, remove a stack and refresh, otherwise remove it
                    if (buff.RefreshToMaxDurationWhenExpires) {
                        buff.RemoveStack()
                            .RefreshDuration();
                    } else {
                        this.Weapon.RemoveBuff(buff);
                        b--;
                    }
                }
            }
        }

        get CanShoot() {
            //If the weapon is reloading, no
            if (this.RemainingReloadDuration > 0) {
                return false;
            }

            //If the weapon is waiting to shoot, no
            if (this.CurrentShotDelay > 0) {
                return false;
            }

            //If the weapon is charging, no
            if (this.CurrentChargeDelay > 0) {
                return false;
            }

            //Otherwise yes
            return true;
        }

        get NextEventTimeStep() {
            //Get the longest delay
            //TODO: Is this the right way of calculating this? Suspect.
            return Math.max(
                this.RemainingReloadDuration,
                this.CurrentShotDelay,
                this.CurrentChargeDelay
            )
        }
    }
    $Classes.RuntimeWeapon = RuntimeWeapon;
    module.exports.RuntimeWeapon = RuntimeWeapon;

    /**
     * Runtime instance of an enemy
     */
    class RuntimeEnemy {
        /**
         * @constructor
         * @param {import('../../public/class-definitions/classes').Enemy} enemy - Base enemy being simulated against
         */
        constructor(enemy, timer, events) {
            /** @type {import('../../public/class-definitions/classes').Enemy} - Base enemy being simulated against */
            this.Enemy = enemy;

            /** @type {Timer} */
            this.Timer = timer;

            /** @type {number} - Remaining health of the enemy */
            this.CurrentHealth = enemy.Health;

            /** @type {number} - Remaining shield of the enemy */
            this.CurrentShield = enemy.Shield;

            /** @type {number} - Remaining armor of the enemy */
            /*this.CurrentArmor = enemy.Armor;*/

            /** @type {Proc[]} - Active procs on the enemy */
            this.Procs = [];

            /** @type {{ [key: number]: number }} */
            this.ProcTypes = {};

            /** @type {Object.<string, function(object) => void>} */
            this.Events = events;
        }

        /**
         * Deal damage to the enemy
         * @param {{[key: number]: number}} damage - Either a weapon damage array or an object containing damage data
         * @param {{ Critical: number, Headshot: number, HeadCrit: number, Faction: number, Other?: [] }} multiplier - Multiply the damage by this amount; intended for crit/faction damage
         */
        DealDamage(damage, multiplier, data) {
            //Did shield gating trigger
            var shieldGatingTriggered = false;

            //Damage dealt
            var dealtDamageAmount = 0;

            //Loop through damage
            var keys = Object.keys(damage);
            for (var k = 0; k < keys.length; k++)
            {
                //Get the damage dealt by this type
                var damageType = keys[k];
                var damageAmount = damage[damageType];

                //Get damage multipliers
                var otherDamageMultiplier = multiplier.Critical * multiplier.Headshot * multiplier.HeadCrit * multiplier.Faction;
                if (multiplier.Other) {
                    for (var o = 0; o < multiplier.Other.length; o++)
                    {
                        otherDamageMultiplier *= multiplier.Other[o];
                    }
                }

                //If shields exist
                if (this.CurrentShield > 0 && damageAmount > 0) {
                    //Get shield resistances
                    var shieldEffect = this.Enemy.ShieldType[damageType];
                    var shieldDamageMultiplier = 1 + shieldEffect;

                    //Calculate effective damage
                    damageAmount *= shieldDamageMultiplier * otherDamageMultiplier * this.MagneticMultiplier;

                    //Ensure the shield isn't overkilled, then damage the shield
                    var damageAmountNormalized = Math.min(this.CurrentShield, damageAmount);
                    this.CurrentShield -= damageAmountNormalized;

                    //Remove damage dealt to the shield from the total
                    //TODO: Divide by shieldDamageMultiplier, so the correct amount of damage dealt is removed
                    damageAmount -= damageAmountNormalized;
                    dealtDamageAmount += damageAmountNormalized;

                    //If shield hit 0, shield gating triggers
                    if (this.CurrentShield <= 0) {
                        shieldGatingTriggered = true;
                    }
                }

                //TODO: Shields don't cause health damage to be skipped
                if (this.CurrentHealth > 0 && damageAmount > 0) {
                    //Get health resistances
                    var healthEffect = this.Enemy.HealthType[damageType];
                    var healthDamageMultiplier = 1 + healthEffect;
                    
                    //Get armor resistances and multipliers
                    var armorEffect = this.Enemy.ArmorType != undefined ? this.Enemy.ArmorType[damageType] : 0;
                    var armorAmountMultiplier = 1 - armorEffect;
                    var armorDamageMultiplier = 1 + armorEffect;

                    var enemyArmor = this.Enemy.Armor * armorAmountMultiplier;
                    if (damageType == $Classes.DamageType.TRUE) {
                        enemyArmor = 0;
                    }
                    var enemyArmorMultiplier = 1 - (enemyArmor / (enemyArmor + 300));

                    //Calculate effective damage
                    damageAmount *= healthDamageMultiplier * armorDamageMultiplier * enemyArmorMultiplier * otherDamageMultiplier * this.ViralMultiplier;

                    //If shield gating triggered, non-headshot damage only deals 5% damage
                    if (shieldGatingTriggered && multiplier.Headshot <= 1) {
                        damageAmount *= 0.05;
                    }

                    //Ensure the health isn't overkilled, then damage the health
                    var damageAmountNormalized = Math.min(this.CurrentHealth, damageAmount);
                    this.CurrentHealth -= damageAmountNormalized;
                    dealtDamageAmount += damageAmountNormalized;
                }
            }

            //Pass along the 'damage' event
            this.Events['damage'](data.Identifier, { Source: data.Source, ProcType: data.ProcType, Damage: dealtDamageAmount, Time: this.Timer.ElapsedTime });
        }

        /**
         * 
         * @param {Proc} proc 
         */
        ApplyProc(proc) {
            this.Procs.unshift(proc);
            this.AddProcType(proc);
        }

        /**
         * 
         * @param {Proc} proc 
         */
        AddProcType(proc) {
            this.ProcTypes[proc.ProcType] = (this.ProcTypes[proc.ProcType] || 0) + 1;
        }

        /**
         * 
         * @param {Proc} proc 
         */
        RemoveProcType(proc) {
            this.ProcTypes[proc.ProcType] = (this.ProcTypes[proc.ProcType] || 0) - 1;
        }

        /**
         * Handle procs on an enemy over a specified amount of time
         * @param {number} timeStep 
         */
        DoProcs(timeStep) {
            if (this.Procs.length == 0)
                return;

            /** @type {Proc} */
            var proc;

            //Loop through procs that are ready to tick; procs are always in order of soonest to latest to tick
            while (this.Procs.length > 0 && this.Procs[0].NextElapsedTick <= this.Timer.ElapsedTime)
            {
                proc = this.Procs.shift();

                //If the proc deals damage
                if (proc.Damage > 0)
                {
                    //Get the damage and deal it
                    var damage = {};
                    damage[proc.DamageType] = proc.Damage;
                    this.DealDamage(
                        damage,
                        {
                            Critical: 1,
                            Headshot: 1,
                            HeadCrit: 1,
                            Faction: 1
                        },
                        { Identifier: proc.Identifier, Source: 'proc', ProcType: proc.ProcType }
                    );
                }

                //Proc will now tick in another second
                proc.NextElapsedTick += 1;

                //If it has time remaining, add it back, otherwise remove it
                if (proc.RemainingDuration > 0) {
                    this.Procs.push(proc);
                } else {
                    this.RemoveProcType(proc);
                }
            }
        }

        get IsAlive() {
            return this.CurrentHealth > 0;
        }

        get NextEventTimeStep() {
            if (this.Procs.length > 0) {
                return this.Procs[0].NextElapsedTimeStep;
            } else {
                //Large number that should, in theory, be larger than anything returned by the weapon function
                return MaxSimulationDuration;
            }
        }

        get InitialShield() {
            return !isNaN(this.Enemy.Shield) ? this.Enemy.Shield : 0;
        }

        get InitialHealth() {
            return !isNaN(this.Enemy.Health) ? this.Enemy.Health : 0;
        }

        get InitialArmor() {
            return !isNaN(this.Enemy.Armor) ? this.Enemy.Armor : 0;
        }

        get CurrentArmor() {
            //Corrosive procs remove 20% + 6% armor per corrosive proc, capping at 80% at 10 stacks
            var corrProcs = Math.min(this.ProcTypes[$Classes.DamageType.CORROSIVE] || 0, 10);
            var armorLost = 0;
            if (corrProcs > 0) {
                armorLost = 0.2 + 0.06 * corrProcs;
            }

            return this.Enemy.Armor * (1 - armorLost);
        }

        get ViralMultiplier() {
            //Viral multiplies health damage by 175% + 25% per viral proc, capping at 425% at 10 stacks
            var viralProcs = Math.min(this.ProcTypes[$Classes.DamageType.VIRAL] || 0, 10);
            var extraDamage = 0;
            if (viralProcs > 0) {
                extraDamage = 0.75 + 0.25 * viralProcs;
            }

            return 1 + extraDamage;
        }

        get MagneticMultiplier() {
            //Magnetic multiplies shield damage by 175% + 25% per magnetic proc, capping at 425% at 10 stacks
            var magProcs = Math.min(this.ProcTypes[$Classes.DamageType.MAGNETIC] || 0, 10);
            var extraDamage = 0;
            if (magProcs > 0) {
                extraDamage = 0.75 + 0.25 * magProcs;
            }

            return 1 + extraDamage;
        }
    }
    $Classes.RuntimeEnemy = RuntimeEnemy;
    module.exports.RuntimeEnemy = RuntimeEnemy;

    /**
     * Instance of a status effect on an enemy
     */
    class Proc {
        /**
         * @constructor
         * @param {number} damageType 
         * @param {import('../../public/class-definitions/classes').Weapon | WeaponFiringModeResidualInstance} weaponOrInstance 
         * @param {{ Critical: number, Headshot: { Active: boolean, Multiplier: number }, Faction: number, Other?: number[] }} properties 
         */
        constructor(damageType, weaponOrInstance, properties, timer, identifier) {
            /** @type {number} Damage type identifier being dealt */
            this.DamageType = damageType;

            /** @type {number} Damage type the proc deals */
            this.ProcType = damageType;

            /** @type {number} Damage dealt per tick */
            this.Damage;

            /** @type {number} Number of seconds the proc will last */
            //this.Duration = -1;

            /** @type {number} Time on the timer when the proc is removed */
            this.RemoveTick;

            /** @type {number} Number of seconds before the proc is removed */
            this.$_TotalDuration;

            /** @type {number} Number of seconds before the proc applies damage to an enemy */
            this.NextElapsedTick = timer.ElapsedTime;

            /** @type {Timer} Simulation timer */
            this.Timer = timer;

            /** @type {*} Identifier for the proc */
            this.Identifier = identifier;

            //Argument must be a Weapon or WeaponFiringModeResidualInstance to have all the info needed to create a proc
            var weapon;
            if (typeof(weaponOrInstance) == 'object') {
                if (weaponOrInstance instanceof $Classes.Weapon) {
                    weapon = weaponOrInstance;
                } else if (weaponOrInstance instanceof WeaponFiringModeResidualInstance) {
                    weapon = weaponOrInstance.Residual.Weapon;
                } else {
                    throw new Error('Invalid class for weaponOrResidual!');
                }
            } else {
                throw new Error('Invalid type for weaponOrResidual: ' + typeof(weaponOrInstance));
            }

            //Calculate damage dealt based on damage type
            switch (damageType) {
                case ($Classes.DamageType.IMPACT):
                    this.Damage = 0;
                    this.$_TotalDuration = 1;
                    break;

                case ($Classes.DamageType.PUNCTURE):
                    this.Damage = 0;
                    this.$_TotalDuration = 6;
                    break;

                case ($Classes.DamageType.SLASH):
                    this.DamageType = $Classes.DamageType.TRUE;
                    this.Damage = weaponOrInstance.BaseDamage * 0.35 * Math.pow(properties.Faction, 2);
                    this.$_TotalDuration = 6;
                    break;

                case ($Classes.DamageType.COLD):
                    this.Damage = 0;
                    this.$_TotalDuration = 6;
                    break;

                case ($Classes.DamageType.ELECTRIC):
                    this.Damage = weaponOrInstance.BaseDamage * (0.5 + weapon.$_GetModdedProperty($Classes.ModEffect.ELECTRIC)) * Math.pow(properties.Faction, 2);
                    this.$_TotalDuration = 3;
                    break;

                case ($Classes.DamageType.HEAT):
                    this.Damage = weaponOrInstance.BaseDamage * (0.5 + weapon.$_GetModdedProperty($Classes.ModEffect.HEAT)) * Math.pow(properties.Faction, 2);
                    this.$_TotalDuration = 6;
                    break;

                case ($Classes.DamageType.TOXIN):
                    this.Damage = weaponOrInstance.BaseDamage * (0.5 + weapon.$_GetModdedProperty($Classes.ModEffect.TOXIN)) * Math.pow(properties.Faction, 2);
                    this.$_TotalDuration = 6;
                    break;

                case ($Classes.DamageType.BLAST):
                    this.Damage = 0;
                    this.$_TotalDuration = 6;
                    break;

                case ($Classes.DamageType.CORROSIVE):
                    this.Damage = 0;
                    this.$_TotalDuration = 8;
                    break;

                case ($Classes.DamageType.GAS):
                    this.Damage = weaponOrInstance.BaseDamage * 0.5 * Math.pow(properties.Faction, 2);
                    this.$_TotalDuration = 6;
                    break;

                case ($Classes.DamageType.MAGNETIC):
                    this.Damage = 0;
                    this.$_TotalDuration = 6;
                    break;

                case ($Classes.DamageType.RADIATION):
                    this.Damage = 0;
                    this.$_TotalDuration = 12;
                    break;

                case ($Classes.DamageType.VIRAL):
                    this.Damage = 0;
                    this.$_TotalDuration = 6;
                    break;
            }

            //If a critical occurred, multiply damage
            if (properties.Critical) {
                this.Damage *= properties.Critical;
            }

            //If a headshot occurred, multiply damage
            if (properties.Headshot.Active) {
                this.Damage *= properties.Headshot.Multiplier;
            }

            //If a headcrit occurred, double damage
            if (properties.Headshot && properties.Critical) {
                this.Damage *= 2;
            }

            //Apply other multipliers
            if (properties.Other) {
                for (var m = 0; m < properties.Other.length; m++)
                {
                    this.Damage *= Math.pow(properties.Other[m], 2);
                }
            }

            //Proc gets removed after its duration expires, but track the tick it's removed
            this.RemoveTick = parseFloat(this.Timer.ElapsedTime) + parseFloat(this.$_TotalDuration);
        }

        get NextElapsedTimeStep() {
            return this.NextElapsedTick - this.Timer.ElapsedTime;
        }

        get RemainingDuration() {
            return this.RemoveTick - this.Timer.ElapsedTime;
        }
    }
    $Classes.Proc = Proc;
    module.exports.Proc = Proc;

    /**
     * Instantiated residual of a weapon
     */
    class WeaponFiringModeResidualInstance {
        /**
         * 
         * @param {import('../../public/class-definitions/classes').WeaponFiringModeResidualDetail} residual 
         * @param {number} id 
         * @param {number} identifier 
         * @param {Timer} timer 
         * @param {number} critResult 
         */
        constructor(residual, id, identifier, timer, critResult) {
            this.Residual = residual;

            this.Timer = timer;

            this.NextElapsedTick = timer.ElapsedTime;
            this.RemoveTick = parseFloat(timer.ElapsedTime) + parseFloat(residual.Duration);

            //Whether or not to override critical hits; occurs in some residuals
            this.OverrideCriticalResult = null;
            if (residual.InheritCriticalChance) {
                this.OverrideCriticalResult = critResult;
            }

            //Identifier for the shot
            this.Identifier = identifier;

            //Identifier for the residual instance
            this.$_Id = id;
        }

        /**
         * Deprecated? Pretty sure it works without this now
         * @param {import('../../public/class-definitions/classes').Weapon} weapon 
         */
        static GenerateWeaponResidualInstanceInstantiator(weapon) {
            for (var r = 0; r < weapon.Residuals.length; r++)
            {
                var residual = weapon.Residuals[r];

                /**
                 * 
                 * @param {*} critResult 
                 */
                function $_generateWeaponResidualInstanceInstantiator(identifier, timer, critResult) {
                    var instance = new WeaponFiringModeResidualInstance(residual, r, identifier, timer, critResult);
                    return instance;
                }

                residual.Instantiate = $_generateWeaponResidualInstanceInstantiator;
            }
        }

        get BaseDamage() {
            var MAIN = this;
            return $Classes.$_CalculateOrLoadProperty(this, 'BaseDamage', function() {
                var baseDamage = MAIN.Residual.BaseDamage;
                var totalBaseDamage = 0;
                var keys = Object.keys(baseDamage);
                for (var d = 0; d < keys.length; d++)
                {
                    totalBaseDamage += baseDamage[keys[d]];
                }

                //Add the damage effect to the base residual to get the new base damage
                return totalBaseDamage * (1 + MAIN.Residual.Weapon.$_GetModdedProperty($Classes.ModEffect.DAMAGE));
            });
        }

        get RemainingDuration() {
            return this.RemoveTick - this.Timer.ElapsedTime;
        }
    }
    $Classes.WeaponFiringModeResidualInstance = WeaponFiringModeResidualInstance;
    module.exports.WeaponFiringModeResidualInstance = WeaponFiringModeResidualInstance;

    /**
     * Handles 'rng' - either random or normalized, which realistically isn't rng at that point
     */
    class RngHandler {
        /**
         * 
         * @param {boolean} normalized 
         */
        constructor(normalized) {
            /** @type {boolean} - Whether to use normalized values or full RNG */
            this.Normalized = normalized;

            /** @type {{[key: string]: number}} */
            this.$_CumulativeRng = {};
        }

        /**
         * Simulate an outcome in the context of the simulation
         * @param {*} chance 
         * @param {*} identifier 
         * @param {*} prefix 
         * @param {*} prevOutput 
         * @returns {{Result: {}, Chance: function}}
         */
        Chance(chance, identifier, prefix, prevOutput) {
            const MAIN = this;

            //This will eventually be returned
            var output = {
                Result: prevOutput != undefined ? prevOutput.Result : {},
                Chance: undefined
            };

            //Create an identifier from the specified text and the prefix of previous simulations
            var trueIdentifier = identifier;
            if (prefix != undefined)
                trueIdentifier = identifier + ':' + prefix;

            //Throw an error if chance is outside the appropriate bounds
            if (chance < 0)
                throw new Error('Chance cannot be less than 0%!');
            
            if (chance > 1)
                throw new Error('Chance cannot be greater than 100%! ' + chance + ' ' + identifier + ' ' + prefix + ' ' + prevOutput);

            //If random, otherwise normalized
            if (!this.Normalized) {
                //Simulate a random number
                var rand = Math.random() <= chance;

                //Store the result
                output.Result[identifier] = rand;
                //Set the Chance function in the output
                output.Chance = function(chance, identifier) {
                    var result = MAIN.Chance(chance, identifier, null, output);
                    return result;
                }
                output.Identifier = identifier;
                output.TrueIdentifier = trueIdentifier;
            } else {
                //Start accumulating weights for this chane
                this.$_CumulativeRng[trueIdentifier] = (this.$_CumulativeRng[trueIdentifier] || 0) + chance;

                //If the chance hits 50%, in theory, it should have an expected number of occurrences equal to 50% of all runs, so fire the event
                if (this.$_CumulativeRng[trueIdentifier] >= 0.5) {
                    //Then, remove 100% chance; effectively, the event will occur at 50%, 150%, 250%, etc. effective chances
                    this.$_CumulativeRng[trueIdentifier] -= 1;

                    //In this case, it succeeded
                    output.Result[identifier] = true;
                } else {
                    //Otherwise, it didn't succeed
                    output.Result[identifier] = false;
                }

                //Previous identifier is used based on the name of the event and the result; this is done so independent events don't accidentally trigger together
                //For example, if Accuracy is 80% and Headshot is 80%, if the two are fully independent, every hit will be a headshot
                //What this does is, it breaks up Accuracy into Accuracy-true and Accuracy-false, so Headshot will occur 80% of the time in Accuracy-true and Accuracy-false
                //Basically, this evens out rng so it actually makes sense and doesn't provide oddities that realistically won't happen in-game
                var prevIdentifier = identifier + '-' + output.Result[identifier];
                if (prefix != undefined)
                {
                    prevIdentifier += ':' + prefix;
                }
                
                //Set the chance function in the output
                output.Chance = function(chance, identifier) {
                    var result = MAIN.Chance(chance, identifier, prevIdentifier, output);
                    return result;
                }
                output.Identifier = identifier;
                output.TrueIdentifier = trueIdentifier;
            }

            return output;
        }
    }
    $Classes.RngHandler = RngHandler;
    module.exports.RngHandler = RngHandler;

    /**
     * Determines what procs to add
     * @param {*} damage 
     * @param {number} statusChance 
     * @param {RngHandler} rngHandler 
     * @param {number} remainChance 
     * @param {string} prefix 
     */
    function $_DoProcs(damage, statusChance, rngHandler, remainChance, prefix) {
        //List of procs to return
        var procs = [];

        //Count damage
        var totalDamage = 0;

        //Sum it up
        var keys = Object.keys(damage);
        for (var k = 0; k < keys.length; k++)
        {
            var key = keys[k];
            if (damage[key] > 0) {
                totalDamage += damage[key];
            }
        }

        //If not normalized
        if (!rngHandler.Normalized) {
            //Get weight of damages
            var damageWeights = {};
            for (var k = 0; k < keys.length; k++)
            {
                var key = keys[k];
                if (damage[key] > 0) {
                    damageWeights[key] = damage[key] / totalDamage;
                }
            }

            //Calculate if a proc will occur, based on status chance and damage weight
            var remainingStatus = statusChance;
            while (remainingStatus > 0) {
                var procType = $_statusWeightUnNormalized(Math.min(remainingStatus, 1), damageWeights);

                //If it did occur, add it
                if (procType != null) {
                    procs.push(procType);
                }

                remainingStatus--;
            }

            //Calculate a random proc
            function $_statusWeightUnNormalized(remainingStatus, damageWeights) {
                //Check if a proc will occur
                var variousStatus = remainChance.Chance(remainingStatus, `${prefix}Status`);
                //If it does occur
                if (variousStatus.Result[`${prefix}Status`]) {
                    //Determine which
                    var which = Math.random();
                    var whichSelect = 0;

                    //Based on damage weight
                    var keys = Object.keys(damageWeights);
                    for (var d = 0; d < keys.length; d++)
                    {
                        var key = keys[d];
                        whichSelect += damageWeights[key];
                        if (which <= whichSelect)
                            return key;
                    }
                }

                return null;
            }
        } else {
            //Normalized
            var remainingStatus = statusChance;
            //Loop through status chance
            while (remainingStatus > 0) {
                //Determine the chance of each proc occurring
                for (var d = 0; d < keys.length; d++)
                {
                    //Determine if a proc of this damage type will occur
                    var damageType = keys[d];
                    var procType = $_statusWeightNormalized(damageType, $_damageWeightNormalized(damageType) * Math.min(remainingStatus, 1));

                    //If it did occur, add it
                    if (procType != null) {
                        procs.push(procType);
                        remainChance.Result.Status = true;
                    }
                }

                remainingStatus--;
            }

            /**
             * Calculates damage weight based on damage type
             * @param {number} damageType 
             */
            function $_damageWeightNormalized(damageType) {
                //Weight is proportion of total damage
                var weight = damage[damageType] / totalDamage;
                return weight;
            }

            /**
             * Calculates whether a specific status effect occurs
             * @param {number} damageType 
             * @param {number} weight 
             */
            function $_statusWeightNormalized(damageType, weight) {
                //Run the chance based on the weight of the proc
                var variousStatus = remainChance.Chance(weight, `${prefix}Status${damageType}`);
                //If it did occur, return the type
                if (variousStatus.Result[`${prefix}Status${damageType}`]) {
                    return damageType;
                }

                //Otherwise nothing occurred
                return null;
            }
        }

        return procs;
    }

    /**
     * Gets other multipliers based on mod effects
     * @param {import('../../public/class-definitions/classes').Weapon} weapon 
     */
    function $_GetOtherMultipliersFromWeapon(weapon) {
        var firstShotMultiplier =
            this.RemainingMagazine == weapon.MagazineSize
                ? weapon.FirstShotDamage
                : 1;

        var lastShotMultiplier =
            this.RemainingMagazine == weapon.AmmoConsumption
            && !weapon.FiringMode.IsBeam
            && weapon.BaseMagazineSize >= 6
                ? weapon.LastShotDamage
                : 1;

        var deadAimMultiplier =
            false //update to check if zoomed, probably will be a property on the firing mode
                ? weapon.DeadAim
                : 1;

        var latronNextShotBonusMultiplier =
            weapon.AugmentLatronNextShotBonusBuff;

        var daikyuDistanceDamageBonusMultiplier =
            weapon.AugmentDaikyuDistanceDamageBonus;

        return [
            firstShotMultiplier,
            lastShotMultiplier,
            deadAimMultiplier,
            latronNextShotBonusMultiplier,
            daikyuDistanceDamageBonusMultiplier
        ];
    }
})(window);