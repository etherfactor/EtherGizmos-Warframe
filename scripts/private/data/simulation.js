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
                            console.log(err);
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
                            console.log(err);
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

                            weapons[rf.id].FiringModes[rf.line - 1]
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
                                .SetIsBeam(rf.is_beam.readUIntBE(0, 1) ? true : false);
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
                            console.log(err);
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
            console.log(`Updated weapons as of ${new Date().toString()}`,);
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
                            console.log(err);
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
                    `SELECT me.*, men.description FROM mod_effects me INNER JOIN mod_effect_names men ON men.id = me.effect_id ORDER BY me.id, me.line;`,
                    function(err, results) {
                        if (err)
                        {
                            console.log(err);
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
                        }

                        callback(null, 1);
                    }
                );
            }
        ],
        function(err, results) {
            Mods = mods;
            console.log(`Updated mods as of ${new Date().toString()}`,);
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
                            console.log(err);
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
            console.log(`Updated mod effects as of ${new Date().toString()}`,);
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
                            console.log(err);
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
            console.log(`Updated enemies as of ${new Date().toString()}`,);
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
        console.log(`Found a mod that doesn't exist: ${id}`);
        return null;
    }

    object = $Classes.Mod.FromObject(object.ToObject());

    if (applyEffects != null) {
        applyEffects = applyEffects.split(';');
        for (var e = 0; e < applyEffects.length; e++)
        {
            var effect = applyEffects[e];
            var effectType = effect.split(':')[0];
            var effectPower = effect.split(':')[1];
            
            if (effectType != undefined && effectPower != undefined) {
                object.AddEffect(effectType, effectPower, null);
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