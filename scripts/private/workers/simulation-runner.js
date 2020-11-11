const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

const $Classes = require('../../public/class-definitions/classes');
const $ClassesPriv = require('../class-definitions/classes');

//var Metrics = GetMetrics();

if (!isMainThread)
{
    var weapon = $Classes.Weapon.FromObject(workerData.Weapon);
    var enemy = $Classes.Enemy.FromObject(workerData.Enemy);
    
    //$ClassesPriv.WeaponFiringModeResidualInstance.GenerateWeaponResidualInstanceInstantiator(weapon);

    var accuracy = workerData.Accuracy;
    var headshot = workerData.Headshot;

    var rng = new $ClassesPriv.RngHandler(workerData.Normalized);

    var simulation = new $ClassesPriv.SimulationThread(weapon, enemy, rng);

    var metrics = new $Classes.Metrics(weapon, enemy);

    simulation.On(
        'time',
        function(time) {

        }
    );

    simulation.On(
        'shot',
        /**
         * @param {number} identifier 
         * @param {{
                Fired: number,
                Hits: number,
                Criticals: { [key: number]: number },
                Headshots: number,
                HeadCrits: number,
                Procs: number[]
            }} data 
         */
        function(identifier, data) {
            var keys = Object.keys(data.Criticals);
            /*for (var k = 0; k < keys.length; k++)
            {
                var key = keys[k];
                Metrics.Crits[key] = (Metrics.Crits[key] || 0) + 1;
            }
            for (var p = 0; p < data.Procs.length; p++)
            {
                var proc = parseInt(data.Procs[p]);
                Metrics.Procs.Count[proc] = (Metrics.Procs.Count[proc] || 0) + 1;
            }
            Metrics.ShotsFired = (Metrics.ShotsFired || 0) + 1;
            Metrics.PelletsFired = (Metrics.PelletsFired || 0) + data.Fired;
            Metrics.Hits = (Metrics.Hits || 0) + data.Hits;
            Metrics.Headshots = (Metrics.Headshots || 0) + data.Headshots;
            Metrics.HeadCrits = (Metrics.HeadCrits || 0) + data.HeadCrits;*/

            metrics.AddShotsFired(1);
            metrics.AddPelletsFired(data.Fired);
            metrics.AddHits(data.Hits);
            metrics.AddHeadshots(data.Headshots);
            metrics.AddHeadCrits(data.HeadCrits);
            metrics.ParseCriticals(data.Criticals);
            metrics.ParseProcs(data.Procs);
            //metricsClass.ParseProcs(data.Procs);
        }
    );

    simulation.On(
        'residual',
        function(identifier, data) {
            for (var p = 0; p < data.Procs.length; p++)
            {
                metrics.ParseProcs(data.Procs);
                //Metrics.Procs.Count[proc] = (Metrics.Procs.Count[proc] || 0) + 1;
            }
        }
    )

    simulation.On(
        'reload',
        function() {
            metrics.AddReload();
            //Metrics.ReloadCount = (Metrics.ReloadCount || 0) + 1;
        }
    );

    simulation.On(
        'damage',
        function(identifier, data) {
            switch (data.Source) {
                case ('shot'):
                    metrics.AddShotDamageInstance(identifier, data.Damage, data.ProcType, data.Time);
                    //Metrics.Shots.Damage.Raw[identifier] = (Metrics.Shots.Damage.Raw[identifier] || 0) + data.Damage;
                    //Metrics.Shots.Damage.Total[identifier] = (Metrics.Shots.Damage.Total[identifier] || 0) + data.Damage;
                    //Metrics.DamagePerTime.Raw[data.Time] = (Metrics.DamagePerTime.Raw[data.Time] || 0) + data.Damage;
                    //Metrics.DamagePerTime.Total[data.Time] = (Metrics.DamagePerTime.Total[data.Time] || 0) + data.Damage;
                    break;

                case ('proc'):
                    metrics.AddProcDamageInstance(identifier, data.Damage, data.ProcType, data.Time);
                    //Metrics.Shots.Damage.Total[identifier] = (Metrics.Shots.Damage.Total[identifier] || 0) + data.Damage;
                    //Metrics.Procs.Damage.Individual[data.ProcType] = (Metrics.Procs.Damage.Individual[data.ProcType] || {});
                    //Metrics.Procs.Damage.Individual[data.ProcType][identifier] = (Metrics.Procs.Damage.Individual[data.ProcType][identifier] || 0) + data.Damage;
                    //Metrics.DamagePerTime.Total[data.Time] = (Metrics.DamagePerTime.Total[data.Time] || 0) + data.Damage;
                    break;

                default:
                    throw new Error('Missing handling for ' + data.Source + '!');
            }
        }
    );

    simulation.On(
        'progress',
        /**
         * 
         * @param {import('../../public/class-definitions/classes').EncodedMessage} progress 
         */
        function(progress) {
            var progressObj = new $Classes.SimulationProgress()
                .SetProgress(progress);

            var message = new $Classes.EncodedMessage()
                .Encode(progressObj)
                .ToObject();

            parentPort.postMessage(message);
        }
    );

    simulation.On(
        'finish',
        /**
         * @param {number} time
         * @param {import('../class-definitions/classes').RuntimeEnemy} enemy
         */
        function(time, enemy) {
            metrics
                .SetKillTime(time)
                .SetEnemyArmorAtDeath(enemy.CurrentArmor);

            //FinalizeMetrics(Metrics);

            var message = new $Classes.EncodedMessage()
                .Encode(metrics)
                .ToObject();

            parentPort.postMessage(message);
        }
    );

    simulation.On(
        'error',
        /**
         * 
         * @param {import('../../public/class-definitions/classes').EncodedMessage} error 
         */
        function(error) {
            var errorObj = new $Classes.SimulationError()
                .SetError(error);

            var message = new $Classes.EncodedMessage()
                .Encode(errorObj)
                .ToObject();

            parentPort.postMessage(message);
        }
    );

    simulation.Run(accuracy, headshot);
}
else
{
    console.error('This code is not intended to be run in any main thread!');
}