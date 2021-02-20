const superconsole = require('../../../../../scripts/logging/superconsole');

var async = require('async');

var conn = require('../sql/connection');

var $Classes = require('../../public/class-definitions/classes');

var LastUpdated = new Date(0);
var IsUpdating = false;
var UpdatePromise = null;

var Weapons = null;
var Mods = null;
var ModEffects = null;
var Enemies = null;

function TryUpdateData() {
    if (!IsUpdating) {
        UpdatePromise = new Promise(function (resolve, reject) {
            if ((new Date().getTime() - LastUpdated.getTime()) > 3600000) {
                IsUpdating = true;
                UpdateData().then(() => {
                    IsUpdating = false;
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    return UpdatePromise;
}

function UpdateData() {
    return new Promise(function (resolve, reject) {
        var wepPromise = UpdateWeapons();
        var modPromise = UpdateMods();
        var mefPromise = UpdateModEffects();
        var enePromise = UpdateEnemies();

        Promise.all([wepPromise, modPromise, mefPromise, enePromise]).then(() => {
            LastUpdated = new Date();
            resolve();
        });
    });
}

function UpdateWeapons() {
    return new Promise(function (resolve, reject) {
        var weapons = {};

        async.parallel([
            function(callback) {
                conn.query(
                    `SELECT * FROM weapons w WHERE w.validated = 1 ORDER BY w.name;`,
                    function(err, results) {
                        if (err)
                        {
                            superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, `$red:Encountered an error: $white,bright{${err}}`);
                            return;
                        }

                        for (var r = 0; r < results.length; r++)
                        {
                            var rw = results[r];
                            if (weapons[rw.id] == undefined)
                            {
                                var weapon = new $Classes.Weapon();
                                
                                weapons[rw.id] = weapon;
                            }
                            
                            weapons[rw.id]
                                .SetName(rw.name)
                                .SetImage(rw.image_url)
                                .SetMastery(rw.mastery)
                                .SetModTypes(rw.mod_type.split(','))
                                .SetMagazineSize(rw.magazine_capacity)
                                .SetReloadDuration(rw.reload_time)
                                .SetAdditionalSettingsHtml(rw.additional_settings_html);
                        }

                        callback(null, 1);
                    }
                );
            },
            function(callback) {
                conn.query(
                    `SELECT wfm.* FROM weapon_fire_modes wfm INNER JOIN weapons w ON w.id = wfm.id WHERE w.validated = 1 ORDER BY wfm.id, wfm.line;`,
                    function(err, results) {
                        if (err)
                        {
                            superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, `$red:Encountered an error: $white,bright{${err}}`);
                            return;
                        }

                        for (var r = 0; r < results.length; r++)
                        {
                            var rf = results[r];
                            if (weapons[rf.id] == undefined)
                            {
                                var weapon = new $Classes.Weapon();
                
                                weapons[rf.id] = weapon;
                            }

                            if (weapons[rf.id].FiringModes[rf.line - 1] == undefined)
                            {
                                var firingMode = new $Classes.WeaponFiringMode();
                
                                weapons[rf.id].FiringModes[rf.line - 1] = firingMode;
                            }

                            /**
                             * @type {import('../../public/class-definitions/classes').WeaponFiringMode}
                             */
                            var temp = weapons[rf.id].FiringModes[rf.line - 1];
                            temp
                                .SetName(rf.name)
                                .SetDamageImpact(rf.impact)
                                .SetDamagePuncture(rf.puncture)
                                .SetDamageSlash(rf.slash)
                                .SetDamageCold(rf.cold)
                                .SetDamageElectric(rf.electric)
                                .SetDamageHeat(rf.heat)
                                .SetDamageToxin(rf.toxin)
                                .SetDamageBlast(rf.blast)
                                .SetDamageCorrosive(rf.corrosive)
                                .SetDamageGas(rf.gas)
                                .SetDamageMagnetic(rf.magnetic)
                                .SetDamageRadiation(rf.radiation)
                                .SetDamageViral(rf.viral)
                                .SetPellets(rf.pellets)
                                .SetFireRate(rf.fire_rate)
                                .SetCriticalChance(rf.critical_chance)
                                .SetCriticalMultiplier(rf.critical_multiplier)
                                .SetStatusChance(rf.status_chance)
                                .SetAmmoConsumption(rf.ammo_consumption)
                                .SetIsBeam(rf.is_beam.readUIntBE(0, 1) ? true : false)
                                .SetChargeDelay(rf.charge_delay);
                        }

                        callback(null, 1);
                    }
                );
            },
            function(callback) {
                conn.query(
                    `SELECT wfmr.* FROM weapon_fire_mode_residuals wfmr INNER JOIN weapons w ON w.id = wfmr.id WHERE w.validated = 1 ORDER BY wfmr.id, wfmr.line, wfmr.subline;`,
                    function(err, results) {
                        if (err)
                        {
                            superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, `$red:Encountered an error: $white,bright{${err}}`);
                            return;
                        }

                        for (var r = 0; r < results.length; r++)
                        {
                            var rr = results[r];
                            if (weapons[rr.id] == undefined)
                            {
                                var weapon = new $Classes.Weapon();
                
                                weapons[rr.id] = weapon;
                            }

                            /**
                             * @type {Weapon}
                             */
                            var weapon = weapons[rr.id];
                            if (weapon.FiringModes[rr.line - 1] == undefined)
                            {
                                var firingMode = new $Classes.WeaponFiringMode();

                                weapon.FiringModes[rr.line - 1] = firingMode;
                            }

                            /**
                             * @type {WeaponFiringMode}
                             */
                            var firingMode = weapon.FiringModes[rr.line - 1];

                            var firingModeResidual = new $Classes.WeaponFiringModeResidual()
                                .SetDamageImpact(rr.impact)
                                .SetDamagePuncture(rr.puncture)
                                .SetDamageSlash(rr.slash)
                                .SetDamageCold(rr.cold)
                                .SetDamageElectric(rr.electric)
                                .SetDamageHeat(rr.heat)
                                .SetDamageToxin(rr.toxin)
                                .SetDamageBlast(rr.blast)
                                .SetDamageCorrosive(rr.corrosive)
                                .SetDamageGas(rr.gas)
                                .SetDamageMagnetic(rr.magnetic)
                                .SetDamageRadiation(rr.radiation)
                                .SetDamageViral(rr.viral)
                                .SetPellets(rr.pellets)
                                .SetDuration(rr.duration)
                                .SetInheritCriticalChance(rr.inherit_critical_chance)
                                .SetOverrideCriticalChance(rr.critical_chance)
                                .SetOverrideCriticalMultiplier(rr.critical_multiplier)
                                .SetOverrideStatusChance(rr.status_chance);

                            firingMode.AddResidual(firingModeResidual);
                        }

                        callback(null, 1);
                    }
                )
            }
        ],
        function(err, results) {
            Weapons = weapons;
            superconsole.log(superconsole.MessageLevel.INFORMATION, `$blue:Updated weapons as of $white,bright{${new Date().toString()}}`,);
            resolve();
        });
    });
}

function UpdateMods() {
    return new Promise(function (resolve, reject) {
        var mods = {};

        async.parallel([
            function(callback) {
                conn.query(
                    `SELECT * FROM mods ORDER BY name;`,
                    function(err, results) {
                        if (err)
                        {
                            superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, `$red:Encountered an error: $white,bright{${err}}`);
                            return;
                        }

                        for (var r = 0; r < results.length; r++)
                        {
                            var rw = results[r];
                            if (mods[rw.id] == undefined)
                            {
                                var mod = new $Classes.Mod();
                                
                                mods[rw.id] = mod;
                            }

                            mods[rw.id]
                                .SetName(rw.name)
                                .SetImage(rw.image_url)
                                .SetRarity(rw.mod_rarity)
                                .SetType(rw.mod_type)
                                .SetDrain(rw.min_drain, rw.ranks);
                            
                            /*mods[rw.id]
                                .SetName(rw.name);*/
                        }

                        callback(null, 1);
                    }
                );
            },
            function(callback) {
                conn.query(
                    `SELECT me.*, men.description, GROUP_CONCAT( CONCAT( mero.rank, ':', mero.value ) SEPARATOR ';' ) 'rank_overrides' FROM mod_effects me INNER JOIN mod_effect_names men ON men.id = me.effect_id LEFT OUTER JOIN mod_effect_rank_overrides mero ON me.id = mero.id AND me.line = mero.line GROUP BY me.id, me.line ORDER BY me.id, me.line;`,
                    function(err, results) {
                        if (err)
                        {
                            superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, `$red:Encountered an error: $white,bright{${err}}`);
                            return;
                        }

                        for (var r = 0; r < results.length; r++)
                        {
                            var rw = results[r];
                            if (mods[rw.id] == undefined)
                            {
                                var mod = new $Classes.Mod();
                                
                                mods[rw.id] = mod;
                            }

                            mods[rw.id]
                                .AddEffect(rw.effect_id, rw.value, rw.description);

                            if (rw.rank_overrides != null) {
                                /** @type {string[]} */
                                var rankOverrides = rw.rank_overrides.split(';');

                                for (var o = 0; o < rankOverrides.length; o++)
                                {
                                    var rankOverride = rankOverrides[o];
                                    var rank = parseInt(rankOverride.split(':')[0]);
                                    var power = parseFloat(rankOverride.split(':')[1]);

                                    mods[rw.id]
                                        .AddEffectRankOverride(rank, rw.effect_id, power);
                                }
                            }
                        }

                        callback(null, 1);
                    }
                );
            }
        ],
        function(err, results) {
            Mods = mods;
            superconsole.log(superconsole.MessageLevel.INFORMATION, `$blue:Updated mods as of $white,bright{${new Date().toString()}}`,);
            resolve();
        });
    });
}

function UpdateModEffects() {
    return new Promise(function (resolve, reject) {
        var modEffects = {};

        async.parallel([
            function(callback) {
                conn.query(
                    `SELECT * FROM mod_effect_names;`,
                    function(err, results) {
                        if (err)
                        {
                            superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, `$red:Encountered an error: $white,bright{${err}}`);
                            return;
                        }

                        for (var r = 0; r < results.length; r++)
                        {
                            var rm = results[r];
                            if (modEffects[rm.id] == undefined)
                            {
                                modEffects[rm.id] = rm.description;
                            }
                        }

                        callback(null, 1);
                    }
                );
            }
        ],
        function(err, results) {
            ModEffects = modEffects;
            superconsole.log(superconsole.MessageLevel.INFORMATION, `$blue:Updated mod effects as of $white,bright{${new Date().toString()}}`,);
            resolve();
        });
    });
}

function UpdateEnemies() {
    return new Promise(function (resolve, reject) {
        var enemies = {};

        async.parallel([
            function(callback) {
                conn.query(
                    `SELECT * FROM enemies ORDER BY name;`,
                    function(err, results) {
                        if (err)
                        {
                            superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, `$red:Encountered an error: $white,bright{${err}}`);
                            return;
                        }

                        for (var r = 0; r < results.length; r++)
                        {
                            var rw = results[r];
                            if (enemies[rw.id] == undefined)
                            {
                                var enemy = new $Classes.Enemy();
                                
                                enemies[rw.id] = enemy;
                            }
                            
                            /** @type {import('../../public/class-definitions/classes').Enemy} */
                            var enemy = enemies[rw.id];
                            enemy
                                .SetName(rw.name)
                                .SetBaseLevel(rw.base_level)
                                .SetHealthType(rw.health_type)
                                .SetHealth(rw.health_value)
                                .SetArmorType(rw.armor_type)
                                .SetArmor(rw.armor_value)
                                .SetShieldType(rw.shield_type)
                                .SetShield(rw.shield_value)
                                .SetImage(rw.image_url);
                        }

                        callback(null, 1);
                    }
                );
            }
        ],
        function(err, results) {
            Enemies = enemies;
            superconsole.log(superconsole.MessageLevel.INFORMATION, `$blue:Updated enemies as of $white,bright{${new Date().toString()}}`,);
            resolve();
        });
    });
}

async function GetWeapons() {
    await TryUpdateData();
    return Weapons;
}
module.exports.GetWeapons = GetWeapons;

async function GetWeaponById(id) {
    if (id == null)
        return null;

    var objects = await GetWeapons();
    /** @type {import('../../public/class-definitions/classes').Weapon} */
    var object = objects[id];
    object = $Classes.Weapon.FromObject(object.ToObject());
    return object;
}
module.exports.GetWeaponById = GetWeaponById;

async function GetMods() {
    await TryUpdateData();
    return Mods;
}
module.exports.GetMods = GetMods;

async function GetModById(id) {
    if (id == null)
        return null;

    var applyEffects = null;
    if (id.indexOf('@') > -1) {
        applyEffects = id.split('@')[1];
        id = id.split('@')[0];
    }

    var objects = await GetMods();
    /** @type {import('../../public/class-definitions/classes').Mod} */
    var object = objects[id];
    if (object == null) {
        superconsole.log(superconsole.MessageLevel.ERROR, `$red:Found a mod that doesn't exist: $white,bright{${id}}`);
        return null;
    }

    object = $Classes.Mod.FromObject(object.ToObject());
    object.SetRank(object.Ranks);

    if (applyEffects != undefined) {
        applyEffects = applyEffects.split('&');

        for (var a = 0; a < applyEffects.length; a++)
        {
            var type = applyEffects[a].substring(0, applyEffects[a].indexOf(':'));
            var effect = applyEffects[a].substring(applyEffects[a].indexOf(':') + 1, applyEffects[a].length);

            switch (type) {
                case ('r'):
                    var rankNumber = parseInt(effect);
                    if (!isNaN(rankNumber)) {
                        object.SetRank(rankNumber);
                    }
                    break;

                case ('e'):
                    if (id != 'riven-mod')
                        break;

                    var modEffects = effect.split(';');
                    for (var e = 0; e < modEffects.length; e++)
                    {
                        var modEffect = modEffects[e];
                        var modEffectType = modEffect.split(':')[0];
                        var modEffectPower = parseFloat(modEffect.split(':')[1]);
                        
                        if (isNaN(modEffectType) || isNaN(modEffectPower))
                            continue;
                        
                        if (modEffectType != undefined && modEffectPower != undefined) {
                            object.AddEffect(modEffectType, modEffectPower, '');
                        }
                    }
                    break;
            }
        }
    }

    return object;
}
module.exports.GetModById = GetModById;

async function GetModEffects() {
    await TryUpdateData();
    return ModEffects;
}
module.exports.GetModEffects = GetModEffects;

async function GetEnemies() {
    await TryUpdateData();
    return Enemies;
}
module.exports.GetEnemies = GetEnemies;

async function GetEnemyById(id) {
    if (id == null)
        return null;

    var objects = await GetEnemies();
    /** @type {import('../../public/class-definitions/classes').Enemy} */
    var object = objects[id];
    object = $Classes.Enemy.FromObject(object.ToObject());
    return object;
}
module.exports.GetEnemyById = GetEnemyById;