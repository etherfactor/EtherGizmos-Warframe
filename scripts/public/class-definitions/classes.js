//Hack to let 'module' exist in front-end
if (typeof module == 'undefined') {
    module = { exports: {} }
}

//Hack to let 'window' exist in back-end
if (typeof window == 'undefined') {
    window = this;
}

(function(window) {
    var $Classes = {};
    window.$Classes = $Classes;

    function $_ToViewCase(string)
    {
        var split = string.replace(/_/g, ' ').split(' ');
        for (var i = 0; i < split.length; i++)
        {
            split[i] = split[i][0].toUpperCase() + split[i].substring(1).toLowerCase();
        }
        return split.join(' ');
    }

    function $_ValueToName(object)
    {
        var keys = Object.keys(object);
        var newObject = {};

        for (var k = 0; k < keys.length; k++)
        {
            var key = keys[k];
            newObject[object[key]] = $_ToViewCase(key);
        }

        return newObject;
    }

    var WeaponType = {
        RIFLE: 1,
        SHOTGUN: 2,
        PISTOL: 4,
        BOW: 8,
        UNIQUE: 16,
        PRIMARY: 1024,
        ASSAULT_RIFLE: 1025,
        SNIPER: 1026,
        CONTINUOUS: 1027,
        PISTOL_UNIQUE: 1028,
        PISTOL_CONTINUOUS: 1029,
        ALL_DUAL_CLEAVERS: 8000,
        ALL_SOBEK: 8001,
        ONLY_HEK: 8002,
        ALL_MITER: 8003,
        ALL_JAW_SWORD: 8004,
        ONLY_BURSTON_PRIME: 8005,
        ALL_VIPER: 8006,
        ALL_SILVA_AEGIS: 8007,
        ALL_SUPRA: 8008,
        ALL_KESTREL: 8009,
        ALL_BOLTO: 8010,
        ALL_OBEX: 8011,
        ALL_GRINLOK: 8012,
        ALL_SPECTRA: 8013,
        ALL_ACRID: 8014,
        ALL_LANKA: 8015,
        ALL_EMBOLIST: 8016,
        ALL_DARK_DAGGER: 8017,
        ALL_MIRE: 8018,
        ALL_KUNAI: 8019,
        ALL_SKANA: 8020,
        ALL_VULKAR: 8021,
        ALL_FURIS: 8022,
        ALL_PANTHERA: 8023,
        ALL_PENTA: 8024,
        ALL_FLUX_RIFLE: 8025,
        ALL_DETRON: 8026,
        ALL_PROVA: 8027,
        ALL_TETRA: 8028,
        ALL_JAT_KITTAG: 8029,
        ALL_TWIN_BASOLK: 8030,
        ALL_OGRIS: 8031,
        ALL_DRAKGOON: 8032,
        ALL_RIPKAS: 8033,
        ALL_GRAKATA: 8034,
        ALL_MUTALIST_QUANTA: 8035,
        ALL_CONVECTRIX: 8036,
        ALL_HARPAK: 8037,
        ALL_MAGNUS: 8038,
        ALL_BRONCO: 8039,
        ALL_TONKOR: 8040,
        ALL_ARGONAK: 8041,
        ALL_DAIKYU: 8042,
        ALL_FURAX: 8043,
        ALL_JAVLOK: 8044,
        ALL_RUBICO: 8045,
        ALL_LATRON: 8046,
        ALL_MARELOK: 8047,
        ONLY_PARIS_PRIME: 8048,
        ONLY_AKBRONCO_PRIME: 8049,
        ONLY_SOMA_PRIME: 8050,
        ONLY_AKSTILETTO_PRIME: 8051,
        UNIVERSAL: 9999
    }
    $Classes.WeaponType = WeaponType;
    module.exports.WeaponType = WeaponType;
    var WeaponTypeName = $_ValueToName(WeaponType);

    var DamageType = {
        IMPACT: 1,
        PUNCTURE: 2,
        SLASH: 4,
        COLD: 8,
        ELECTRIC: 16,
        HEAT: 32,
        TOXIN: 64,
        BLAST: 40,
        CORROSIVE: 80,
        GAS: 96,
        MAGNETIC: 24,
        RADIATION: 48,
        VIRAL: 72,
        TRUE: 128,
        VOID: 256
    }
    $Classes.DamageType = DamageType;
    module.exports.DamageType = DamageType;
    var DamageTypeName = $_ValueToName(DamageType);
    $Classes.DamageTypeName = DamageTypeName;
    module.exports.DamageTypeName = DamageTypeName;

    var ModRarity = {
        COMMON: 1,
        UNCOMMON: 2,
        RARE: 4,
        LEGENDARY: 8,
        RIVEN: 16,
        PECULIAR: 32,
        AMALGAM: 64
    }
    $Classes.ModRarity = ModRarity;
    module.exports.ModRarity = ModRarity;

    var ModRarityBackground = {};
    ModRarityBackground[ModRarity.COMMON] = '/images/mods/_bg_common.png';
    ModRarityBackground[ModRarity.UNCOMMON] = '/images/mods/_bg_uncommon.png';
    ModRarityBackground[ModRarity.RARE] = '/images/mods/_bg_rare.png';
    ModRarityBackground[ModRarity.LEGENDARY] = '/images/mods/_bg_legendary.png';
    ModRarityBackground[ModRarity.RIVEN] = '/images/mods/_bg_riven.png';
    ModRarityBackground[ModRarity.PECULIAR] = '/images/mods/_bg_common.png'; //use common for now
    ModRarityBackground[ModRarity.AMALGAM] = '/images/mods/_bg_amalgam.png';

    var ModEffect = {
        DAMAGE: 10,     //Done
        MULTISHOT: 11,  //Done

        CRITICAL_CHANCE: 20,        //Done
        CRITICAL_DAMAGE: 21,        //Done
        STATUS_CHANCE: 22,          //Done
        STATUS_CHANCE_ADDITIVE: 24, //Done
        STATUS_DURATION: 23,        //Done

        IMPACT: 30,     //Done
        PUNCTURE: 31,   //Done
        SLASH: 32,      //Done

        COLD: 40,       //Done
        ELECTRIC: 41,   //Done
        HEAT: 42,       //Done
        TOXIN: 43,      //Done

        BLAST: 50,      //Done
        CORROSIVE: 51,  //Done
        GAS: 52,        //Done
        MAGNETIC: 53,   //Done
        RADIATION: 54,  //Done
        VIRAL: 55,      //Done

        FIRE_RATE: 60,          //Done
        RELOAD_SPEED: 61,       //Done
        MAGAZINE_CAPACITY: 62,  //Done
        AMMO_CAPACITY: 63,      //Done

        BANE_OF_GRINEER: 70,        //Done
        DAMAGE_TO_GRINEER: 70,      //Done
        BANE_OF_CORPUS: 71,         //Done
        DAMAGE_TO_CORPUS: 71,       //Done
        BANE_OF_INFESTED: 72,       //Done
        DAMAGE_TO_INFESTED: 72,     //Done
        BANE_OF_CORRUPTED: 73,      //Done
        DAMAGE_TO_CORRUPTED: 73,    //Done

        PUNCH_THROUGH: 80,
        ACCURACY: 81,
        SPREAD: 82,
        RECOIL: 83,
        FLIGHT_SPEED: 84,
        ZOOM: 85,
        BEAM_RANGE: 86,
        BLAST_RADIUS: 87,
        NOISE_REDUCTION: 88,
        STICK_CHANCE: 89,
        MAGAZINE_CAPACITY_ADDITIVE: 90,
        LIFE_STEAL: 91,
        FLIGHT_DISTANCE: 92,

        HEADSHOT_DAMAGE: 100,
        FIRST_SHOT_DAMAGE: 101,
        LAST_SHOT_DAMAGE: 102,
        EXPLOSION_CHANCE: 103,
        BODY_EXPLOSION_DAMAGE: 104,
        HEADSHOT_KILL_ENERGY: 105,
        DEAD_AIM: 106,
        AMMO_EFFICIENCY: 107,

        AMMO_MUTATION: 120,
        COMBO_DURATION: 121,
        HOLSTER_RELOAD: 122,
        HOLSTER_RELOAD_ALL: 123,
        AMMO_MUTATION_SHOTGUN_SNIPER: 124,
        AMMO_MUTATION_RIFLE_PISTOL: 125,
        KILL_ENEMY_REFILL_AMMO: 126,
        BODYSHOT_DAMAGE: 127,

        RICOCHET_BOUNCE: 130,
        GORE_CHANCE: 131,

        DAGGERS_REDUCE_ARMOR: 150,
        ARGONAK_REVEAL_PUNCH_THROUGH: 151,
        LIFE_STEAL_ON_NIKANAS: 152,
        DAIKYU_PICKUP_ARROWS: 153,
        BLAST_RADIUS_FROM_MELEE: 154,
        FURAX_MELEE_KILL_KNOCKDOWN: 155,
        SHIELD_BLOCK_COMBO_COUNT: 156,
        SHOTGUN_RELOAD_SPEED: 157,

        HUNTER_MUNITIONS_EFFECT: 200,
        PROPORTIONAL_HEALTH_EXPLOSION: 201,

        VIGILANTE_SET_EFFECT: 300,

        MITER_POP_NULLIFIER: 400,
        SILVA_AEGIS_BLOCK_CHARGE: 401,
        OBEX_FINISH_EXPLOSION: 402,
        LANKA_FLYING_SHOCK: 403,
        PANTHERA_SECONDARY_DISARM: 404,
        PENTA_TETHER: 405,
        FLUX_RIFLE_STATUS_FLUC_MIN: 406, //TODO
        FLUX_RIFLE_STATUS_FLUC_MAX: 407, //TODO
        DETRON_KILL_EXPLOSION: 408,
        PROVA_CHARGE_SHOCK: 409,
        SILVA_AEGIS_BLOCK_REDIRECT: 411,
        JAT_KITTAG_KILL_EXPLOSION: 412,
        SOBEK_KILL_EXPLOSION: 413,
        TWIN_BASOLK_CHARGE_TELEPORT: 414,
        OGRIS_NAPALM: 415, //TODO
        RIPKAS_PRONE_DAMAGE: 416,
        RIPKAS_PRONE_STATUS_CHANCE: 417,
        GRAKATA_EMPTY_MAGAZINE: 418,
        MUTALIST_QUANTA_MASS: 419, //TODO
        PENTA_NAPALM: 420, //TODO
        CONVECTRIX_EFFICIENCY: 421,
        BRONCO_CLOSE_STUN: 422,
        LATRON_NEXT_SHOT_BONUS: 423,
        LATRON_NEXT_SHOT_BONUS_BUFF: 423.5,
        DAIKYU_DISTANCE_DAMAGE: 424, //TODO
        PARIS_STATUS_RESTORE_HEALTH: 425,
        SOMA_PRIME_HIT_CRITICAL: 426, //TODO

        SPRINT_SPEED: 1020,
        DODGE_SPEED: 1021,
        MOVE_SPEED_AIMING: 1023,
        BULLET_JUMP: 1030,
        AIM_GLIDE: 1031,
        WALL_LATCH: 1032,
        HOLSTER_SPEED: 1040,
        IGNORE_STAGGER: 1041,
        REVIVE_SPEED: 1042,

        DURATION: 2000,
        RADIUS: 2001,
        RADIUS_RELATIVE_EXPLOSION: 2002,

        JUSTICE: 4000,
        TRUTH: 4001,
        ENTROPY: 4002,
        SEQUENCE: 4003,
        BLIGHT: 4004,
        PURITY: 4005
    }
    $Classes.ModEffect = ModEffect;
    module.exports.ModEffect = ModEffect;
    var ModEffectName = $_ValueToName(ModEffect);
    $Classes.ModEffectName = ModEffectName;
    module.exports.ModEffectName = ModEffectName;

    var ModEffectDamage = {};
    ModEffectDamage[ModEffect.IMPACT] = DamageType.IMPACT;
    ModEffectDamage[ModEffect.PUNCTURE] = DamageType.PUNCTURE;
    ModEffectDamage[ModEffect.SLASH] = DamageType.SLASH;
    ModEffectDamage[ModEffect.COLD] = DamageType.COLD;
    ModEffectDamage[ModEffect.ELECTRIC] = DamageType.ELECTRIC;
    ModEffectDamage[ModEffect.HEAT] = DamageType.HEAT;
    ModEffectDamage[ModEffect.TOXIN] = DamageType.TOXIN;
    ModEffectDamage[ModEffect.BLAST] = DamageType.BLAST;
    ModEffectDamage[ModEffect.CORROSIVE] = DamageType.CORROSIVE;
    ModEffectDamage[ModEffect.GAS] = DamageType.GAS;
    ModEffectDamage[ModEffect.MAGNETIC] = DamageType.MAGNETIC;
    ModEffectDamage[ModEffect.RADIATION] = DamageType.RADIATION;
    ModEffectDamage[ModEffect.VIRAL] = DamageType.VIRAL;
    $Classes.ModEffectDamage = ModEffectDamage;
    module.exports.ModEffectDamage = ModEffectDamage;

    var $_InitializeHealthType = function() {
        var healthType = {};
        var damageTypes = Object.keys(DamageType);
        for (var d = 0; d < damageTypes.length; d++)
        {
            var damageType = damageTypes[d];
            healthType[DamageType[damageType]] = 0;
        }
        return healthType;
    }

    var ShieldType = {
        SHIELD: $_InitializeHealthType(),
        PROTO_SHIELD: $_InitializeHealthType()
    }
    ShieldType.SHIELD[DamageType.IMPACT] = +0.5;
    ShieldType.SHIELD[DamageType.PUNCTURE] = -0.2;
    ShieldType.SHIELD[DamageType.COLD] = +0.5;
    ShieldType.SHIELD[DamageType.MAGNETIC] = +0.75;
    ShieldType.SHIELD[DamageType.RADIATION] = -0.25;
    ShieldType.PROTO_SHIELD[DamageType.IMPACT] = +0.15;
    ShieldType.PROTO_SHIELD[DamageType.PUNCTURE] = -0.5;
    ShieldType.PROTO_SHIELD[DamageType.HEAT] = -0.5;
    ShieldType.PROTO_SHIELD[DamageType.TOXIN] = +0.25;
    ShieldType.PROTO_SHIELD[DamageType.CORROSIVE] = -0.5;
    ShieldType.PROTO_SHIELD[DamageType.MAGNETIC] = +0.75;
    $Classes.ShieldType = ShieldType;
    module.exports.ShieldType = ShieldType;

    var ShieldTypeId = {};
    ShieldTypeId.SHIELD = 1;
    ShieldTypeId.PROTO_SHIELD = 2;
    $Classes.ShieldTypeId = ShieldTypeId;
    module.exports.ShieldTypeId = ShieldTypeId;
    
    var ShieldTypeName = {
        1: { Name: 'Shield', Multipliers: ShieldType.SHIELD },
        2: { Name: 'Proto Shield', Multipliers: ShieldType.PROTO_SHIELD }
    }

    /** @typedef { [key: number]: number } ArmorType */
    var ArmorType = {
        FERRITE: $_InitializeHealthType(),
        ALLOY: $_InitializeHealthType()
    }
    ArmorType.FERRITE[DamageType.PUNCTURE] = +0.5;
    ArmorType.FERRITE[DamageType.SLASH] = -0.15;
    ArmorType.FERRITE[DamageType.BLAST] = -0.25;
    ArmorType.FERRITE[DamageType.CORROSIVE] = +0.75;
    ArmorType.ALLOY[DamageType.PUNCTURE] = +0.15;
    ArmorType.ALLOY[DamageType.SLASH] = -0.5;
    ArmorType.ALLOY[DamageType.COLD] = +0.25;
    ArmorType.ALLOY[DamageType.ELECTRIC] = -0.5;
    ArmorType.ALLOY[DamageType.MAGNETIC] = -0.5;
    ArmorType.ALLOY[DamageType.RADIATION] = +0.75;
    $Classes.ArmorType = ArmorType;
    module.exports.ArmorType = ArmorType;

    var ArmorTypeId = {};
    ArmorTypeId.FERRITE = 1;
    ArmorTypeId.ALLOY = 2;
    $Classes.ArmorTypeId = ArmorTypeId;
    module.exports.ArmorTypeId = ArmorTypeId;

    var ArmorTypeName = {
        1: { Name: 'Ferrite', Multipliers: ArmorType.FERRITE },
        2: { Name: 'Alloy', Multipliers: ArmorType.ALLOY }
    }

    var HealthType = {
        CLONED_FLESH: $_InitializeHealthType(),
        MACHINERY: $_InitializeHealthType(),
        FLESH: $_InitializeHealthType(),
        ROBOTIC: $_InitializeHealthType(),
        INFESTED: $_InitializeHealthType(),
        INFESTED_FLESH: $_InitializeHealthType(),
        FOSSILIZED: $_InitializeHealthType(),
        INFESTED_SINEW: $_InitializeHealthType()
    }
    HealthType.CLONED_FLESH[DamageType.IMPACT] = -0.25;
    HealthType.CLONED_FLESH[DamageType.SLASH] = +0.25;
    HealthType.CLONED_FLESH[DamageType.HEAT] = +0.25;
    HealthType.CLONED_FLESH[DamageType.GAS] = -0.5;
    HealthType.CLONED_FLESH[DamageType.VIRAL] = +0.75;
    HealthType.CLONED_FLESH[DamageType.VOID] = -0.5;
    HealthType.MACHINERY[DamageType.IMPACT] = +0.25;
    HealthType.MACHINERY[DamageType.ELECTRIC] = +0.5;
    HealthType.MACHINERY[DamageType.TOXIN] = -0.25;
    HealthType.MACHINERY[DamageType.BLAST] = +0.75;
    HealthType.MACHINERY[DamageType.VIRAL] = -0.25;
    HealthType.FLESH[DamageType.IMPACT] = -0.25;
    HealthType.FLESH[DamageType.SLASH] = +0.25;
    HealthType.FLESH[DamageType.TOXIN] = +0.5;
    HealthType.FLESH[DamageType.GAS] = -0.25;
    HealthType.FLESH[DamageType.VIRAL] = +0.5;
    HealthType.ROBOTIC[DamageType.PUNCTURE] = +0.25;
    HealthType.ROBOTIC[DamageType.SLASH] = -0.25;
    HealthType.ROBOTIC[DamageType.ELECTRIC] = +0.5;
    HealthType.ROBOTIC[DamageType.TOXIN] = -0.25;
    HealthType.ROBOTIC[DamageType.RADIATION] = +0.25;
    HealthType.INFESTED[DamageType.SLASH] = +0.25;
    HealthType.INFESTED[DamageType.HEAT] = +0.25;
    HealthType.INFESTED[DamageType.GAS] = +0.75;
    HealthType.INFESTED[DamageType.RADIATION] = -0.5;
    HealthType.INFESTED[DamageType.VIRAL] = -0.5;
    HealthType.INFESTED_FLESH[DamageType.SLASH] = +0.5;
    HealthType.INFESTED_FLESH[DamageType.COLD] = -0.5;
    HealthType.INFESTED_FLESH[DamageType.HEAT] = +0.5;
    HealthType.INFESTED_FLESH[DamageType.GAS] = +0.5;
    HealthType.FOSSILIZED[DamageType.SLASH] = +0.15;
    HealthType.FOSSILIZED[DamageType.COLD] = -0.25;
    HealthType.FOSSILIZED[DamageType.TOXIN] = -0.5;
    HealthType.FOSSILIZED[DamageType.BLAST] = +0.5;
    HealthType.FOSSILIZED[DamageType.CORROSIVE] = +0.75;
    HealthType.FOSSILIZED[DamageType.RADIATION] = -0.75;
    HealthType.FOSSILIZED[DamageType.VOID] = -0.5;
    HealthType.INFESTED_SINEW[DamageType.PUNCTURE] = +0.25;
    HealthType.INFESTED_SINEW[DamageType.COLD] = +0.25;
    HealthType.INFESTED_SINEW[DamageType.BLAST] = -0.5;
    HealthType.INFESTED_SINEW[DamageType.RADIATION] = +0.5;
    $Classes.HealthType = HealthType;
    module.exports.HealthType = HealthType;

    var HealthTypeId = {};
    HealthTypeId.CLONED_FLESH = 1;
    HealthTypeId.MACHINERY = 2;
    HealthTypeId.FLESH = 3;
    HealthTypeId.ROBOTIC = 4;
    HealthTypeId.INFESTED = 5;
    HealthTypeId.INFESTED_FLESH = 6;
    HealthTypeId.FOSSILIZED = 7;
    HealthTypeId.INFESTED_SINEW = 8;
    $Classes.HealthTypeId = HealthTypeId;
    module.exports.HealthTypeId = HealthTypeId;
    
    var HealthTypeName = {
        1: { Name: 'Cloned Flesh', Multipliers: HealthType.CLONED_FLESH },
        2: { Name: 'Machinery', Multipliers: HealthType.MACHINERY },
        3: { Name: 'Flesh', Multipliers: HealthType.FLESH },
        4: { Name: 'Robotic', Multipliers: HealthType.ROBOTIC },
        5: { Name: 'Infested', Multipliers: HealthType.INFESTED },
        6: { Name: 'Infested Flesh', Multipliers: HealthType.INFESTED_FLESH },
        7: { Name: 'Fossilized', Multipliers: HealthType.FOSSILIZED },
        8: { Name: 'Infested Sinew', Multipliers: HealthType.INFESTED_SINEW }
    }

    var MessageType = {
        SIMULATION_PROGRESS: 100,
        QUEUE_PROGRESS: 110,
        SIMULATION_METRICS: 200
    }
    $Classes.MessageType = MessageType;
    module.exports.MessageType = MessageType;

    const BuffNames = {
        LATRON_NEXT_SHOT_BONUS: 'Double Tap',
        SOMA_PRIME_HIT_CRITICAL: 'Hata-Satya'
    };
    $Classes.BuffNames = BuffNames;
    module.exports.BuffNames = BuffNames;

    function $_CalculateOrLoadProperty(object, name, func) {
        object.$__Property = object.$__Property || {};
        object.$__PropertyCalculated = object.$__PropertyCalculated || {};
        //console.log(object.Name + ': ' + name + ' @ ' + object.$__PropertyCalculated[name]);
        if (object.$__PropertyCalculated[name] == undefined || object.$__PropertyCalculated[name] == false)
        {
            //console.log('  recalculating');
            object.$__Property[name] = func();
            object.$__PropertyCalculated[name] = true;
        }

        return object.$__Property[name];
    }
    $Classes.$_CalculateOrLoadProperty = $_CalculateOrLoadProperty;
    module.exports.$_CalculateOrLoadProperty = $_CalculateOrLoadProperty;

    function $_FlagChange(object, property) {
        if (property == undefined) {
            object.$__PropertyCalculated = {};
        } else {
            delete object.$__PropertyCalculated[property];
        }
    }
    $Classes.$_FlagChange = $_FlagChange;
    module.exports.$_FlagChange = $_FlagChange;

    /**
     * 
     * @param {{}} damage 
     * @param {Weapon} weapon 
     */
    function $_ModDamage(damage, weapon) {
        var newDamage = {};
        var baseDamage = 0;

        var $_addPhysicalMod = function(typeName) {
            var added = weapon.$_GetModdedProperty(ModEffect[typeName]);
            newDamage[DamageType[typeName]] = (newDamage[DamageType[typeName]] || 0) * (1 + added);
        }
    
        var $_addElementalMod = function(typeName) {
            var added = weapon.$_GetModdedProperty(ModEffect[typeName]);
            newDamage[DamageType[typeName]] = (newDamage[DamageType[typeName]] || 0) + baseDamage * added;
        }
    
        var $_combinePureElements = function() {
            var currentElement = null;
            var usedElements = [];

            var $_updateCurrentElement = function(newElement) {
                //console.log('New element:', newElement);
                if (usedElements.indexOf(newElement) >= 0)
                    return;

                if (currentElement == newElement) return;
    
                if (currentElement == null)
                {
                    //console.log('Setting element to', newElement);
                    currentElement = newElement;
    
                    usedElements.push(newElement);
                    //console.log('Used elements:', usedElements);
                }
                else
                {
                    //console.log('Combining element', currentElement, 'with', newElement);
                    newDamage[newElement + currentElement] = newDamage[newElement] + newDamage[currentElement];
                    newDamage[newElement] = 0;
                    newDamage[currentElement] = 0;
                    currentElement = null;
    
                    usedElements.push(newElement);
                }
    
                //console.log(usedElements);
            }
    
            for (var m = 0; m < weapon.Mods.length; m++)
            {
                var mod = weapon.Mods[m];
                if (mod == undefined)
                    continue;

                var keys = Object.keys(mod.Effects);
                for (var e = keys.length - 1; e >= 0; e--)
                {
                    var element = keys[e];
                    if (element == ModEffect.COLD
                        || element == ModEffect.ELECTRIC
                        || element == ModEffect.HEAT
                        || element == ModEffect.TOXIN)
                    {
                        var newElement = ModEffectDamage[element];
                        //console.log('Mod element:', newElement);
                        $_updateCurrentElement(newElement);
                    }
                }
            }
    
            var keys = Object.keys(newDamage);
            for (var k = 0; k < keys.length; k++)
            {
                var element = keys[k];
                if (newDamage[element] <= 0)
                    continue;
                
                //console.log(element, ';', DamageType.COLD, ';', DamageType.ELECTRIC, ';', DamageType.HEAT, ';', DamageType.TOXIN);
                if (element == DamageType.COLD
                    || element == DamageType.ELECTRIC
                    || element == DamageType.HEAT
                    || element == DamageType.TOXIN)
                {
                    var newElement = parseInt(element);
                    //console.log('Weapon element:', element);
                    $_updateCurrentElement(newElement);
                }
            }
        }

        var damageMultiplier = 1 + weapon.$_GetModdedProperty(ModEffect.DAMAGE);
        if (weapon.FiringMode.IsBeam) {
            damageMultiplier *= 1 + weapon.$_GetModdedProperty(ModEffect.MULTISHOT);
        }
        
        var keys = Object.keys(damage);
        for (var k = 0; k < keys.length; k++)
        {
            var addedDamage = damage[keys[k]] * (damageMultiplier);
            newDamage[keys[k]] = addedDamage;
            baseDamage += addedDamage;
        }

        $_addPhysicalMod('IMPACT', newDamage);
        $_addPhysicalMod('PUNCTURE', newDamage);
        $_addPhysicalMod('SLASH', newDamage);

        $_addElementalMod('COLD', newDamage, baseDamage);
        $_addElementalMod('ELECTRIC', newDamage, baseDamage);
        $_addElementalMod('HEAT', newDamage, baseDamage);
        $_addElementalMod('TOXIN', newDamage, baseDamage);

        $_addElementalMod('BLAST', newDamage, baseDamage);
        $_addElementalMod('CORROSIVE', newDamage, baseDamage);
        $_addElementalMod('GAS', newDamage, baseDamage);
        $_addElementalMod('MAGNETIC', newDamage, baseDamage);
        $_addElementalMod('RADIATION', newDamage, baseDamage);
        $_addElementalMod('VIRAL', newDamage, baseDamage);

        $_combinePureElements(newDamage);

        return newDamage;
    }

    /**
     * @namespace
     * @property {string} Name
     */
    class Weapon { 
        constructor() {
            /**
             * @type {WeaponFiringMode[]}
             */
            this.FiringModes = [];

            /**
             * @type {WeaponFiringMode}
             */
            this.FiringMode = null;

            /**
             * @type {Mod[]}
             */
            this.Mods = [];

            //Should this replicate when sent between client/server/threads? For now, replication is disabled
            /** @type {{ [key: string]: Buff }} */
            this.Buffs = {};

            $_FlagChange(this);
        }
        
        ToObject() {
            if (this.FiringMode == undefined)
                this.SetFiringMode(0);

            var data = {
                Name: this.Name,
                Image: this.Image,
                Mastery: this.Mastery,
                WeaponType: this.WeaponType,
                ModTypes: this.ModTypes,
                BaseMagazineSize: this.BaseMagazineSize,
                BaseMaximumAmmo: this.BaseMaximumAmmo,
                BaseReloadDuration: this.BaseReloadDuration,
                FiringModes: [],
                FiringModeName: this.FiringMode.Name,
                Mods: [],
                AdditionalSettingsHtml: this.AdditionalSettingsHtml,
                RelativeBaseDamageData: this.FiringMode.RelativeBaseDamageData
            }

            for (var f = 0; f < this.FiringModes.length; f++)
            {
                var firingMode = this.FiringModes[f];
                data.FiringModes[f] = firingMode.ToObject();
            }

            for (var m = 0; m < this.Mods.length; m++)
            {
                var mod = this.Mods[m];
                data.Mods[m] = mod != undefined ? mod.ToObject() : null;
            }

            return data;
        }

        /**
         * 
         * @param {Weapon} object 
         */
        static FromObject(object) {
            var weapon = new this()
                .SetName(object.Name)
                .SetImage(object.Image)
                .SetMastery(object.Mastery)
                .SetModTypes(object.ModTypes)
                .SetMagazineSize(object.BaseMagazineSize)
                .SetMaximumAmmo(object.BaseMaximumAmmo)
                .SetReloadDuration(object.BaseReloadDuration)
                .SetAdditionalSettingsHtml(object.AdditionalSettingsHtml);

            for (var f = 0; f < object.FiringModes.length; f++)
            {
                var firingMode = object.FiringModes[f];
                weapon.AddFiringMode(WeaponFiringMode.FromObject(firingMode));
            }

            for (var m = 0; m < object.Mods.length; m++)
            {
                var mod = object.Mods[m];
                weapon.SetMod(m, (mod != undefined ? Mod.FromObject(mod) : null));
            }

            if (object.FiringModeName != undefined) {
                for (var f = 0; f < object.FiringModes.length; f++) {
                    var firingMode = object.FiringModes[f];
                    if (firingMode.Name == object.FiringModeName) {
                        weapon.SetFiringMode(f);
                    }
                }
            } else {
                //Need to load firing mode
                weapon.SetFiringMode(0);
            }

            if (object.RelativeBaseDamageData != undefined) {
                weapon.AddRelativeBaseDamage(object.RelativeBaseDamageData.Type, object.RelativeBaseDamageData.Proportion);
            }

            return weapon;
        }

        SetName(name) {
            this.Name = name;
            return this;
        }

        SetImage(url) {
            this.Image = url;
            return this;
        }

        SetMastery(mastery) {
            this.Mastery = parseInt(mastery);
            return this;
        }

        /**
         * 
         * @param {string} weaponType 
         */
        /*SetType(weaponType) {
            this.WeaponType = parseInt(weaponType);
            $_FlagChange(this);
            console.log('Set type to', weaponType);
            return this;
        }*/

        /**
         * 
         * @param {number[]} modTypes 
         */
        SetModTypes(modTypes) {
            this.ModTypes = modTypes;
            for (var t = 0; t < this.ModTypes.length; t++)
            {
                this.ModTypes[t] = parseInt(this.ModTypes[t]);
            }
            this.WeaponType = modTypes[0];
            $_FlagChange(this);
            //console.log('Set mod types to', modTypes);
            return this;
        }

        SetMagazineSize(magazineSize) {
            this.BaseMagazineSize = parseInt(magazineSize);
            $_FlagChange(this);
            return this;
        }

        SetMaximumAmmo(maximumAmmo) {
            this.BaseMaximumAmmo = parseInt(maximumAmmo);
            $_FlagChange(this);
            return this;
        }

        SetReloadDuration(reloadDuration) {
            this.BaseReloadDuration = parseFloat(reloadDuration);
            $_FlagChange(this);
            return this;
        }

        AddFiringMode(firingMode) {
            this.FiringModes.push(firingMode);
            return this;
        }


        SetFiringMode(position) {
            this.FiringMode = this.FiringModes[position];
            $_FlagChange(this);
            return this;
        }

        /**
         * 
         * @param {number} position 
         * @param {Mod} mod 
         * @param {boolean} silentSlot 
         */
        SetMod(position, mod, silentSlot) {
            if (position < 0 || position >= 8) return;

            if (mod != null) {
                for (var m = 0; m < this.Mods.length; m++)
                {
                    var testMod = this.Mods[m];
                    if (mod == testMod) {
                        this.Mods[m] = this.Mods[position];
                        this.Mods[position] = null;
                    }
                }
            }

            if (this.Mods[position] != null && !silentSlot) {
                this.Mods[position].SetSlottedWeapon(null);
            }

            this.Mods[position] = mod;

            if (mod != null && !silentSlot) {
                mod.SetSlottedWeapon(this);
            }

            $_FlagChange(this);
            return this;
        }

        /**
         * 
         * @param {Buff} buff 
         */
        AddBuff(buff) {
            var relevantBuff;
            if (!this.Buffs[buff.Name]) {
                this.Buffs[buff.Name] = buff;
                relevantBuff = buff;
            } else {
                var currentBuff = this.Buffs[buff.Name];
                currentBuff.AddStack();
                relevantBuff = currentBuff;
            }

            //Optimally should only reset particular properties
            /*var keys = Object.keys(relevantBuff.Effects);
            for (var e = 0; e < keys.length; e++)
            {
                var effect = keys[e];
            }*/

            $_FlagChange(this);
            return this;
        }

        /**
         * 
         * @param {Buff | string} buff 
         */
        RemoveBuff(buff) {
            if (typeof(buff) == 'string') {
                delete this.Buffs[buff];
            } else if (typeof(buff) == 'object') {
                delete this.Buffs[buff.Name];
            } else {
                throw new Error(`Invalid type for argument 'buff'!`);
            }
            $_FlagChange(this);
            return this;
        }

        SetAdditionalSettingsHtml(html) {
            this.AdditionalSettingsHtml = html;
            return this;
        }

        AddRelativeBaseDamage(damageType, proportion)
        {
            for (var f = 0; f < this.FiringModes.length; f++)
            {
                this.FiringModes[f].AddRelativeBaseDamage(damageType, proportion);
            }
            $_FlagChange(this);
            return this;
        }


        ForceUpdate() {
            $_FlagChange(this);
        }

        // DAMAGE: 10,

        // IMPACT: 30,
        // PUNCTURE: 31,
        // SLASH: 32,

        // COLD: 40,
        // ELECTRIC: 41,
        // HEAT: 42,
        // TOXIN: 43,

        // BLAST: 50,
        // CORROSIVE: 51,
        // GAS: 52,
        // MAGNETIC: 53,
        // RADIATION: 54,
        // VIRAL: 55,
        get Damage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'Damage', function() {
                try {
                    return $_ModDamage(MAIN.FiringMode.BaseDamage, MAIN);
                } catch(ex) {
                    console.log(ex);
                    console.log(MAIN);
                }
            });
        }

        get BaseDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseDamage', function() {
                var baseDamage = MAIN.FiringMode.BaseDamage;
                var totalBaseDamage = 0;
                var keys = Object.keys(baseDamage);
                for (var d = 0; d < keys.length; d++)
                {
                    totalBaseDamage += baseDamage[keys[d]];
                }

                return totalBaseDamage * (1 + MAIN.$_GetModdedProperty(ModEffect.DAMAGE));
            });
        }

        /**
         * @returns {WeaponFiringModeResidualDetail[]}
         */
        get Residuals() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'Residuals', function() {
                var residuals = [];

                for (var r = 0; r < MAIN.FiringMode.Residuals.length; r++)
                {
                    var residual = MAIN.FiringMode.Residuals[r];
                    
                    var baseDamage = residual.BaseDamage;
                    var residualDamage = $_ModDamage(baseDamage, MAIN);

                    var damageTypeKeys = Object.keys(baseDamage);
                    
                    var moddedBaseDamage = {};
                    var totalModdedBaseDamage = 0;
                    var totalModdedDamage = 0;
                    for (var d = 0; d < damageTypeKeys.length; d++)
                    {
                        var key = damageTypeKeys[d];
                        moddedBaseDamage[key] = (1 + MAIN.$_GetModdedProperty(ModEffect.DAMAGE)) * baseDamage[key];
                        totalModdedBaseDamage += moddedBaseDamage[key];
                        totalModdedDamage += residualDamage[key];
                    }
    
                    var damageDisplay = [];
    
                    var keys = Object.keys(residualDamage);
                    for (var k = 0; k < keys.length; k++)
                    {
                        var key = keys[k];
                        if (residualDamage[key] > 0)
                        {
                            damageDisplay.push({ Name: DamageTypeName[key], Value: residualDamage[key], BaseValue: baseDamage[key] });
                        }
                    }

                    var residualObject = new WeaponFiringModeResidualDetail(residual, MAIN)
                        .SetBaseDamage(moddedBaseDamage)
                        .SetDamage(residualDamage)
                        .SetDamageDisplay(damageDisplay);

                    if (residual.OverrideCriticalChance != undefined) {
                        residualObject.SetCriticalChance((1 + MAIN.$_GetModdedProperty(ModEffect.CRITICAL_CHANCE)) * residual.OverrideCriticalChance);
                    } else {
                        residualObject.SetCriticalChance(MAIN.CriticalChance);
                    }

                    if (residual.OverrideCriticalMultiplier != undefined) {
                        residualObject.SetCriticalMultiplier((1 + MAIN.$_GetModdedProperty(ModEffect.CRITICAL_DAMAGE)) * residual.OverrideCriticalMultiplier);
                    } else {
                        residualObject.SetCriticalMultiplier(MAIN.CriticalMultiplier);
                    }

                    if (residual.OverrideStatusChance != undefined) {
                        residualObject.SetStatusChance((1 + MAIN.$_GetModdedProperty(ModEffect.STATUS_CHANCE)) * residual.OverrideStatusChance);
                    } else {
                        residualObject.SetStatusChance(MAIN.StatusChance);
                    }

                    residuals.push(residualObject);
                }

                return residuals;
            });
        }
        
        // MULTISHOT: 11,
        get Pellets() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'Pellets', function() {
                var pellets = MAIN.BasePellets;
                //Temporary '|| true' to maintain the original logic here, but to enable beam weapons to benefit from Multishot due to in-game findings
                //Change contradicts how this system works according to devs, but this is how it's been observed to work
                if (!MAIN.FiringMode.IsBeam || true) {
                    pellets *= (1 + MAIN.$_GetModdedProperty(ModEffect.MULTISHOT));
                }

                return pellets;
            });
        }

        get BasePellets() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BasePellets', function() {
                return MAIN.FiringMode.Pellets;
            });
        }

        // CRITICAL_CHANCE: 20,
        get CriticalChance() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'CriticalChance', function() {
                return MAIN.BaseCriticalChance * (1 + MAIN.$_GetModdedProperty(ModEffect.CRITICAL_CHANCE));
            });
        }

        get BaseCriticalChance() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseCriticalChance', function() {
                return MAIN.FiringMode.CriticalChance;
            });
        }

        // CRITICAL_DAMAGE: 21,
        get CriticalMultiplier() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'CriticalMultiplier', function() {
                return MAIN.BaseCriticalMultiplier * (1 + MAIN.$_GetModdedProperty(ModEffect.CRITICAL_DAMAGE));
            });
        }

        get BaseCriticalMultiplier() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseCriticalMultiplier', function() {
                return MAIN.FiringMode.CriticalMultiplier;
            });
        }

        // STATUS_CHANCE: 22,
        // STATUS_CHANCE_ADDITIVE: 24,
        get StatusChance() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'StatusChance', function() {
                return MAIN.BaseStatusChance * (1 + MAIN.$_GetModdedProperty(ModEffect.STATUS_CHANCE)) + MAIN.$_GetModdedProperty(ModEffect.STATUS_CHANCE_ADDITIVE);
            });
        }

        get BaseStatusChance() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseStatusChance', function() {
                return MAIN.FiringMode.StatusChance;
            });
        }

        // STATUS_DURATION: 23,
        get StatusDuration() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'StatusDuration', function() {
                return MAIN.BaseStatusDuration + MAIN.$_GetModdedProperty(ModEffect.STATUS_DURATION);
            });
        }

        get BaseStatusDuration() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseStatusDuration', function() {
                return 1;
            });
        }
        
        // FIRE_RATE: 60,
        get FireRate() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'FireRate', function() {
                return MAIN.BaseFireRate * (1 + MAIN.$_GetModdedProperty(ModEffect.FIRE_RATE));
            });
        }

        get BaseFireRate() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseFireRate', function() {
                return MAIN.FiringMode.FireRate;
            });
        }

        // RELOAD_SPEED: 61,
        get ReloadDuration() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'ReloadDuration', function() {
                return MAIN.BaseReloadDuration / (1 + MAIN.$_GetModdedProperty(ModEffect.RELOAD_SPEED));
            });
        }

        // MAGAZINE_CAPACITY: 62,
        // MAGAZINE_CAPACITY_ADDITIVE: 90,
        get MagazineSize() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'MagazineSize', function() {
                return MAIN.BaseMagazineSize * (1 + MAIN.$_GetModdedProperty(ModEffect.MAGAZINE_CAPACITY)) + MAIN.$_GetModdedProperty(ModEffect.MAGAZINE_CAPACITY_ADDITIVE);
            });
        }

        get AmmoConsumption() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AmmoConsumption', function() {
                return MAIN.FiringMode.AmmoConsumption;
            });
        }

        // AMMO_CAPACITY: 63,
        get MaximumAmmo() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'MaximumAmmo', function() {
                return MAIN.BaseMaximumAmmo * (1 + MAIN.$_GetModdedProperty(ModEffect.AMMO_CAPACITY));
            });
        }

        // BANE_OF_GRINEER: 70,
        // DAMAGE_TO_GRINEER: 70,
        get DamageToGrineer() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'DamageToGrineer', function() {
                return MAIN.BaseDamageToGrineer + MAIN.$_GetModdedProperty(ModEffect.DAMAGE_TO_GRINEER);
            });
        }

        get BaseDamageToGrineer() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseDamageToGrineer', function() {
                return 1;
            });
        }

        // BANE_OF_CORPUS: 71,
        // DAMAGE_TO_CORPUS: 71,
        get DamageToCorpus() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'DamageToCorpus', function() {
                return MAIN.BaseDamageToCorpus + MAIN.$_GetModdedProperty(ModEffect.DAMAGE_TO_CORPUS);
            });
        }

        get BaseDamageToCorpus() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseDamageToCorpus', function() {
                return 1;
            });
        }

        // BANE_OF_INFESTED: 72,
        // DAMAGE_TO_INFESTED: 72,
        get DamageToInfested() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'DamageToInfested', function() {
                return MAIN.BaseDamageToInfested + MAIN.$_GetModdedProperty(ModEffect.DAMAGE_TO_INFESTED);
            });
        }

        get BaseDamageToInfested() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseDamageToInfested', function() {
                return 1;
            });
        }

        // BANE_OF_CORRUPTED: 73,
        // DAMAGE_TO_CORRUPTED: 73,
        get DamageToCorrupted() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'DamageToCorrupted', function() {
                return MAIN.BaseDamageToCorrupted + MAIN.$_GetModdedProperty(ModEffect.DAMAGE_TO_CORRUPTED);
            });
        }

        get BaseDamageToCorrupted() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseDamageToCorrupted', function() {
                return 1;
            });
        }

        // PUNCH_THROUGH: 80,
        get PunchThrough() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'PunchThrough', function() {
                return MAIN.BasePunchThrough + MAIN.$_GetModdedProperty(ModEffect.PUNCH_THROUGH);
            });
        }

        get BasePunchThrough() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BasePunchThrough', function() {
                return 0;
            });
        }

        // ACCURACY: 81,
        get Accuracy() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'Accuracy', function() {
                return MAIN.BaseAccuracy + MAIN.$_GetModdedProperty(ModEffect.ACCURACY);
            });
        }

        get BaseAccuracy() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseAccuracy', function() {
                return 0;
            });
        }

        // SPREAD: 82,
        get Spread() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'Spread', function() {
                return MAIN.BaseSpread + MAIN.$_GetModdedProperty(ModEffect.SPREAD);
            });
        }

        get BaseSpread() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseSpread', function() {
                return 0;
            });
        }

        // RECOIL: 83,
        get Recoil() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'Recoil', function() {
                return MAIN.BaseRecoil + MAIN.$_GetModdedProperty(ModEffect.RECOIL);
            });
        }
        
        get BaseRecoil() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseRecoil', function() {
                return 0;
            });
        }

        // FLIGHT_SPEED: 84,
        get FlightSpeed() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'FlightSpeed', function() {
                return MAIN.BaseFlightSpeed + MAIN.$_GetModdedProperty(ModEffect.FLIGHT_SPEED);
            });
        }

        get BaseFlightSpeed() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseFlightSpeed', function() {
                return 1;
            });
        }

        // HEADSHOT_DAMAGE: 100,
        get HeadshotMultiplier() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'HeadshotMultiplier', function() {
                return 1 + MAIN.$_GetModdedProperty(ModEffect.HEADSHOT_DAMAGE);
            });
        }

        // FIRST_SHOT_DAMAGE: 101,
        get FirstShotDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'FirstShotDamage', function() {
                return 1 + MAIN.$_GetModdedProperty(ModEffect.FIRST_SHOT_DAMAGE);
            });
        }

        // LAST_SHOT_DAMAGE: 102,
        get LastShotDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'LastShotDamage', function() {
                return 1 + MAIN.$_GetModdedProperty(ModEffect.LAST_SHOT_DAMAGE);
            });
        }

        // EXPLOSION_CHANCE: 103,
        get ExplosionChance() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'ExplosionChance', function() {
                return 0 + MAIN.$_GetModdedProperty(ModEffect.EXPLOSION_CHANCE);
            });
        }

        // DEAD_AIM: 106,
        get DeadAim() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'DeadAim', function() {
                return 1 + MAIN.$_GetModdedProperty(ModEffect.DEAD_AIM);
            });
        }

        // AMMO_EFFICIENCY: 107,
        get AmmoEfficiency() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'DeadAim', function() {
                return 0 + MAIN.$_GetModdedProperty(ModEffect.AMMO_EFFICIENCY);
            });
        }

        // BODYSHOT_DAMAGE: 127,
        get BodyshotMultiplier() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BodyshotMultiplier', function() {
                return 1 + MAIN.$_GetModdedProperty(ModEffect.BODYSHOT_DAMAGE);
            });
        }

        // HUNTER_MUNITIONS_EFFECT: 200,
        get HunterMunitionsEffect() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'HunterMunitionsEffect', function() {
                return MAIN.BaseHunterMunitionsEffect + MAIN.$_GetModdedProperty(ModEffect.HUNTER_MUNITIONS_EFFECT);
            });
        }

        get BaseHunterMunitionsEffect() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseHunterMunitionsEffect', function() {
                return 0;
            });
        }

        // VIGILANTE_SET_EFFECT: 300,
        get VigilanteSetEffect() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'VigilanteSetEffect', function() {
                return MAIN.BaseVigilanteSetEffect + MAIN.$_GetModdedProperty(ModEffect.VIGILANTE_SET_EFFECT);
            });
        }

        get BaseVigilanteSetEffect() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseVigilanteSetEffect', function() {
                return 0;
            });
        }

        // CONVECTRIX_EFFICIENCY: 421,
        get AugmentConvectrixEfficiency() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AugmentConvectrixEfficiency', function() {
                return 0 + MAIN.$_GetModdedProperty(ModEffect.CONVECTRIX_EFFICIENCY);
            });
        }

        // LATRON_NEXT_SHOT_BONUS: 423,
        get AugmentLatronNextShotBonus() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AugmentLatronNextShotBonus', function() {
                return 0 + MAIN.$_GetModdedProperty(ModEffect.LATRON_NEXT_SHOT_BONUS);
            });
        }

        // This exists for the damage bonus added by the buff, when it applies. LATRON_NEXT_SHOT_BONUS refers to the buff bonus per stage.
        // LATRON_NEXT_SHOT_BONUS_BUFF: 423.5,
        get AugmentLatronNextShotBonusBuff() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AugmentLatronNextShotBonusBuff', function() {
                return 1 + MAIN.$_GetModdedProperty(ModEffect.LATRON_NEXT_SHOT_BONUS_BUFF);
            });
        }

        // DAIKYU_DISTANCE_DAMAGE: 424,
        get AugmentDaikyuDistanceDamageBonus() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AugmentDaikyuDistanceDamageBonus', function() {
                return MAIN.$_GetModdedProperty(ModEffect.DAIKYU_DISTANCE_DAMAGE) > 0
                    ? 1.4  //If the mod bonus exists, it's always 140%
                    : 1.0; //If the mod bonus doesn't exist, it's 100%
            });
        }

        // SOMA_PRIME_HIT_CRITICAL: 426,
        get AugmentSomaPrimeHitCriticalChance() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AugmentSomaPrimeHitCriticalChance', function() {
                return 0 + MAIN.$_GetModdedProperty(ModEffect.SOMA_PRIME_HIT_CRITICAL);
            });
        }

        get WeaponTypeName() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'WeaponTypeName', function() {
                return WeaponTypeName[MAIN.WeaponType];
            });
        }

        get TotalDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'TotalDamage', function() {
                var keys = Object.keys(MAIN.Damage);
                var damage = 0;
                for (var k = 0; k < keys.length; k++)
                {
                    damage += MAIN.Damage[keys[k]];
                }
    
                return damage;
            });
        }

        get CriticalDPSMultiplier() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'CriticalDPSMultiplier', function() {
                return (MAIN.CriticalMultiplier - 1) * MAIN.CriticalChance + 1;
            });
        }

        get MaxFactionDamageMultiplier() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'MaxFactionDamageMultiplier', function() {
                return Math.max(MAIN.DamageToGrineer, MAIN.DamageToCorpus, MAIN.DamageToInfested, MAIN.DamageToCorrupted);
            });
        }

        get DPS() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'DPS', function() {
                var damage = MAIN.TotalDamage;
    
                var dpsMultiplier = (MAIN.MagazineSize / MAIN.FireRate) / ((MAIN.MagazineSize / MAIN.FireRate) + MAIN.ReloadDuration);
                var critMultiplier = MAIN.CriticalDPSMultiplier;
                var factionDamage = MAIN.MaxFactionDamageMultiplier;
    
                return damage * MAIN.Pellets * MAIN.FireRate * dpsMultiplier * critMultiplier * factionDamage;
            });
        }

        get StatusDPS() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'StatusDPS', function() {
                var weapon = MAIN;
                //if (weapon.Name != 'Tiberon Prime') return '???';
    
                var dps = weapon.DPS;
    
                var damage = weapon.Damage;
                //console.log(damage);
                var totalDamage = weapon.TotalDamage;
                var baseDamage = 0;
    
                var damageMultiplier = weapon.$_GetModdedProperty(ModEffect.DAMAGE);
                baseDamage = (weapon.FiringMode.TotalOriginalBaseDamage + weapon.FiringMode.TotalRelativeBaseDamage) * (1 + damageMultiplier);
    
                var criticalDPSMultiplier = weapon.CriticalDPSMultiplier;
    
                //console.log(weapon.Name + ': ' + baseDamage);
    
                var factionDamage = weapon.MaxFactionDamageMultiplier;
    
                function $_statusTypeWeight(damageType)
                {
                    //console.log(DamageTypeName[damageType] + ': ' + damage[damageType]);
                    return weapon.StatusChance * (damage[damageType] / totalDamage);
                }
    
                var coldPerSecond = $_statusTypeWeight(DamageType.COLD) * weapon.Pellets * weapon.FireRate;
                var coldEffect = 0;
                if (coldPerSecond * 6 < 1) {
                    coldEffect = coldPerSecond * 6 * 0.25;
                } else {
                    coldEffect = 0.7;
                }
    
                var viralPerSecond = $_statusTypeWeight(DamageType.VIRAL) * weapon.Pellets * weapon.FireRate;
                var viralEffect = 0;
                if (viralPerSecond * 6 < 1) {
                    viralEffect = viralPerSecond * 6 * 1;
                } else {
                    viralEffect = 3.25;
                }
    
                //console.log(weapon.Name + ': ' + coldPerSecond + '->' + coldEffect + '; ' + viralPerSecond + '->' + viralEffect);
    
                function $_statusDamage(damageType, damageProportion, duration, factionDamageStacks)
                {
                    /*console.log('  base damage: ' + (baseDamage));
                    console.log('  damage proportion: ' + (damageProportion));
                    console.log('  pellets: ' + (weapon.Pellets));
                    console.log('  fire rate: ' + (weapon.FireRate));
                    console.log('  critical damage: ' + (criticalDPSMultiplier));
                    console.log('  status type weight: ' + ($_statusTypeWeight(damageType)));
                    console.log('  faction damage: ' + (Math.pow(factionDamage, factionDamageStacks)));
                    console.log('  duration: ' + ((duration + 1)));*/
                    return baseDamage * damageProportion * weapon.Pellets * weapon.FireRate * criticalDPSMultiplier * $_statusTypeWeight(damageType) * Math.pow(factionDamage, factionDamageStacks) * ((duration + 1) / (1 - coldEffect));
                }
    
                //console.log(weapon.Name + ': ' + weapon.StatusChance);
    
                var slashProcDps = $_statusDamage(DamageType.SLASH, 0.35, 6, 2);
                //console.log('  slash: ' + slashProcDps);
                var electricProcDps = $_statusDamage(DamageType.ELECTRIC, 0.5 * (1 + weapon.$_GetModdedProperty(ModEffect.ELECTRIC)), 6, 2);
                //console.log('  electric: ' + electricProcDps);
                var heatProcDps = $_statusDamage(DamageType.HEAT, 0.5 * (1 + weapon.$_GetModdedProperty(ModEffect.HEAT)), 6, 2);
                //console.log('  heat: ' + heatProcDps);
                var toxinProcDps = $_statusDamage(DamageType.TOXIN, 0.5 * (1 + weapon.$_GetModdedProperty(ModEffect.TOXIN)), 6, 2);
                //console.log('  toxin: ' + toxinProcDps);
                var gasProcDps = $_statusDamage(DamageType.GAS, 0.5, 6, 2);
                //console.log('  gas: ' + gasProcDps);
    
                return (dps + slashProcDps + electricProcDps + heatProcDps + toxinProcDps + gasProcDps) * (1 + viralEffect);
            });
        }

        get DamageDisplay() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'DamageDisplay', function() {
                //console.log(MAIN.Name);

                var damage = MAIN.Damage;
                var baseDamage = MAIN.FiringMode.BaseDamage;

                var result = [];

                var keys = Object.keys(damage);
                for (var k = 0; k < keys.length; k++)
                {
                    var key = keys[k];
                    if (damage[key] > 0)
                    {
                        result.push({ Name: DamageTypeName[key], Value: damage[key], BaseValue: baseDamage[key] });
                    }
                }

                //console.log(baseDamage);
                //console.log(result);

                return result;
            });
        }

        get PrimaryDamageTypeDisplay() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'PrimaryDamageTypeDisplay', function() {
                var damages = MAIN.Damage;
                var keys = Object.keys(damages);

                var topDamage = -1;
                var topDamageAmount = -1;

                for (var d = 0; d < keys.length; d++)
                {
                    var key = keys[d];
                    var damage = damages[key];

                    if (damage > topDamageAmount) {
                        topDamage = key;
                        topDamageAmount = damage;
                    }
                }

                var topDamageProportion = topDamageAmount / MAIN.TotalDamage;

                return `${DamageTypeName[topDamage]} / ${(100*topDamageProportion).toFixed(0)}%`
            });
        }

        get UrlName() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'UrlName', function() {
                return MAIN.Name.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9\-]/g, '');
            });
        }

        get UrlPath() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'UrlPath', function() {
                var path = '';
                for (var m = 0; m < Math.max(MAIN.Mods.length, 8); m++)
                {
                    var mod = MAIN.Mods[m];
                    if (mod != undefined)
                    {
                        path += (path != '' ? '+' : '') + mod.UrlName;
                    }
                    else
                    {
                        path += (path != '' ? '+' : '') + 'empty';
                    }
                }

                return MAIN.UrlName + '+' + MAIN.FiringMode.UrlName + '/' + path;
            });
        }

        get RivenEquipped() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'RivenEquipped', function() {
                for (var m = 0; m < Math.max(MAIN.Mods.length, 8); m++)
                {
                    var mod = MAIN.Mods[m];

                    if (mod == undefined)
                        continue;

                    if (mod.Name.toLowerCase() == 'riven mod')
                        return true;
                }

                return false;
            });
        }

        $_GetModdedProperty(modEffect) {
            var total = 0;

            for (var m = 0; m < this.Mods.length; m++)
            {
                var mod = this.Mods[m];
                if (mod == undefined)
                    continue;

                total += mod.Effects[modEffect] || 0;
            }

            var buffNames = Object.keys(this.Buffs);
            for (var b = 0; b < buffNames.length; b++)
            {
                var buffName = buffNames[b]
                var buff = this.Buffs[buffName];
                if (buff == undefined)
                    continue;

                total += (buff.Effects[modEffect] || 0);
            }

            //Can only ever lose 100% on a particular stat; stats should not be able to be negative
            return total > -1 ? total : -1;
        }
    }
    $Classes.Weapon = Weapon;
    module.exports.Weapon = Weapon;

    class WeaponFiringMode {
        constructor() {
            this.OriginalBaseDamage = {};
            this.RelativeBaseDamage = {};
            this.AmmoConsumption = 1;
            this.TotalOriginalBaseDamage = 0;
            this.TotalRelativeBaseDamage = 0;

            /**
             * @type {WeaponFiringModeResidual[]}
             */
            this.Residuals = [];

            $_FlagChange(this);
        }

        ToObject() {
            var data = {
                Name: this.Name,
                DamageImpact: this.OriginalBaseDamage[DamageType.IMPACT],
                DamagePuncture: this.OriginalBaseDamage[DamageType.PUNCTURE],
                DamageSlash: this.OriginalBaseDamage[DamageType.SLASH],
                DamageCold: this.OriginalBaseDamage[DamageType.COLD],
                DamageElectric: this.OriginalBaseDamage[DamageType.ELECTRIC],
                DamageHeat: this.OriginalBaseDamage[DamageType.HEAT],
                DamageToxin: this.OriginalBaseDamage[DamageType.TOXIN],
                DamageBlast: this.OriginalBaseDamage[DamageType.BLAST],
                DamageCorrosive: this.OriginalBaseDamage[DamageType.CORROSIVE],
                DamageGas: this.OriginalBaseDamage[DamageType.GAS],
                DamageMagnetic: this.OriginalBaseDamage[DamageType.MAGNETIC],
                DamageRadiation: this.OriginalBaseDamage[DamageType.RADIATION],
                DamageViral: this.OriginalBaseDamage[DamageType.VIRAL],
                Pellets: this.Pellets,
                FireRate: this.FireRate,
                CriticalChance: this.CriticalChance,
                CriticalMultiplier: this.CriticalMultiplier,
                StatusChance: this.StatusChance,
                AmmoConsumption: this.AmmoConsumption,
                IsBeam: this.IsBeam,
                Residuals: []
            }

            for (var r = 0; r < this.Residuals.length; r++)
            {
                data.Residuals.push(this.Residuals[r].ToObject());
            }

            return data;
        }

        static FromObject(object) {
            var firingMode = new this()
                .SetName(object.Name)
                .SetDamageImpact(object.DamageImpact)
                .SetDamagePuncture(object.DamagePuncture)
                .SetDamageSlash(object.DamageSlash)
                .SetDamageCold(object.DamageCold)
                .SetDamageElectric(object.DamageElectric)
                .SetDamageHeat(object.DamageHeat)
                .SetDamageToxin(object.DamageToxin)
                .SetDamageBlast(object.DamageBlast)
                .SetDamageCorrosive(object.DamageCorrosive)
                .SetDamageGas(object.DamageGas)
                .SetDamageMagnetic(object.DamageMagnetic)
                .SetDamageRadiation(object.DamageRadiation)
                .SetDamageViral(object.DamageViral)
                .SetPellets(object.Pellets)
                .SetFireRate(object.FireRate)
                .SetCriticalChance(object.CriticalChance)
                .SetCriticalMultiplier(object.CriticalMultiplier)
                .SetStatusChance(object.StatusChance)
                .SetAmmoConsumption(object.AmmoConsumption)
                .SetIsBeam(object.IsBeam);

            for (var r = 0; r < object.Residuals.length; r++)
            {
                var residual = WeaponFiringModeResidual.FromObject(object.Residuals[r]);
                firingMode.AddResidual(residual);
            }

            return firingMode;
        }

        SetName(name) {
            this.Name = name;
            return this;
        }

        SetFireRate(fireRate) {
            this.FireRate = parseFloat(fireRate);
            $_FlagChange(this);
            return this;
        }

        SetCriticalChance(criticalChance) {
            this.CriticalChance = parseFloat(criticalChance);
            $_FlagChange(this);
            return this;
        }

        SetCriticalMultiplier(criticalMultiplier) {
            this.CriticalMultiplier = parseFloat(criticalMultiplier);
            $_FlagChange(this);
            return this;
        }

        SetStatusChance(statusChance) {
            this.StatusChance = parseFloat(statusChance);
            $_FlagChange(this);
            return this;
        }

        SetAmmoConsumption(ammoConsumption) {
            this.AmmoConsumption = parseFloat(ammoConsumption);
            $_FlagChange(this);
            return this;
        }

        SetDamageImpact(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.IMPACT] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamagePuncture(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.PUNCTURE] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageSlash(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.SLASH] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageCold(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.COLD] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageElectric(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.ELECTRIC] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageHeat(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.HEAT] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageToxin(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.TOXIN] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageCorrosive(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.CORROSIVE] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageBlast(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.BLAST] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }
        
        SetDamageGas(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.GAS] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageMagnetic(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.MAGNETIC] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageRadiation(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.RADIATION] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageViral(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.VIRAL] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetPellets(pellets) {
            this.Pellets = parseInt(pellets);
            $_FlagChange(this);
            return this;
        }

        SetIsBeam(isBeam) {
            this.IsBeam = isBeam;
            $_FlagChange(this);
            return this;
        }

        AddRelativeBaseDamage(damageType, proportion)
        {
            if (proportion == undefined || isNaN(proportion) || proportion < 0)
                proportion = 0;

            this.RelativeBaseDamage = {};
            this.RelativeBaseDamage[damageType] = (this.RelativeBaseDamage[damageType] || 0) + this.TotalOriginalBaseDamage * proportion;
            this.TotalRelativeBaseDamage = this.TotalOriginalBaseDamage * proportion;
            this.RelativeBaseDamageData = { Type: damageType, Proportion: proportion };

            for (var r = 0; r < this.Residuals.length; r++)
            {
                this.Residuals[r].AddRelativeBaseDamage(damageType, proportion);
            }

            $_FlagChange(this);
            return this;
        }

        SetZoomModEffect(zoomModEffect) {
            this.ZoomModEffect = zoomModEffect;
            return this;
        }

        /**
         * 
         * @param {WeaponFiringModeResidual} residual 
         */
        AddResidual(residual) {
            this.Residuals.push(residual);
            return this;
        }

        $_UpdateBaseDamage() {
            this.TotalOriginalBaseDamage = 0;
            
            var keys = Object.keys(this.OriginalBaseDamage);
            for (var k = 0; k < keys.length; k++)
            {
                this.TotalOriginalBaseDamage += this.OriginalBaseDamage[keys[k]];
            }
        }

        get BaseDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseDamage', function() {
                var baseDamage = {};
    
                var keys = Object.keys(MAIN.OriginalBaseDamage);
                for (var k = 0; k < keys.length; k++)
                {
                    baseDamage[keys[k]] = (baseDamage[keys[k]] || 0) + MAIN.OriginalBaseDamage[keys[k]];
                }
    
                var keys = Object.keys(MAIN.RelativeBaseDamage);
                for (var k = 0; k < keys.length; k++)
                {
                    baseDamage[keys[k]] = (baseDamage[keys[k]] || 0) + MAIN.RelativeBaseDamage[keys[k]];
                }
    
                return baseDamage;
            });
        }

        get UrlName() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'UrlName', function() {
                return MAIN.Name.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9\-]/g, '');
            });
        }
    }
    $Classes.WeaponFiringMode = WeaponFiringMode;
    module.exports.WeaponFiringMode = WeaponFiringMode;

    class WeaponFiringModeResidual {
        constructor() {
            this.OriginalBaseDamage = {};
            this.RelativeBaseDamage = {};
            this.TotalOriginalBaseDamage = 0;
            this.TotalRelativeBaseDamage = 0;
            this.Duration = 0;
        }

        ToObject() {
            var data = {
                DamageImpact: this.OriginalBaseDamage[DamageType.IMPACT],
                DamagePuncture: this.OriginalBaseDamage[DamageType.PUNCTURE],
                DamageSlash: this.OriginalBaseDamage[DamageType.SLASH],
                DamageCold: this.OriginalBaseDamage[DamageType.COLD],
                DamageElectric: this.OriginalBaseDamage[DamageType.ELECTRIC],
                DamageHeat: this.OriginalBaseDamage[DamageType.HEAT],
                DamageToxin: this.OriginalBaseDamage[DamageType.TOXIN],
                DamageBlast: this.OriginalBaseDamage[DamageType.BLAST],
                DamageCorrosive: this.OriginalBaseDamage[DamageType.CORROSIVE],
                DamageGas: this.OriginalBaseDamage[DamageType.GAS],
                DamageMagnetic: this.OriginalBaseDamage[DamageType.MAGNETIC],
                DamageRadiation: this.OriginalBaseDamage[DamageType.RADIATION],
                DamageViral: this.OriginalBaseDamage[DamageType.VIRAL],
                Duration: this.Duration,
                Pellets: this.Pellets,
                InheritCriticalChance: this.InheritCriticalChance,
                OverrideCriticalChance: this.OverrideCriticalChance,
                OverrideCriticalMultiplier: this.OverrideCriticalMultiplier,
                OverrideStatusChance: this.OverrideStatusChance
            };

            return data;
        }

        static FromObject(object) {
            var residual = new this()
                .SetDamageImpact(object.DamageImpact)
                .SetDamagePuncture(object.DamagePuncture)
                .SetDamageSlash(object.DamageSlash)
                .SetDamageCold(object.DamageCold)
                .SetDamageElectric(object.DamageElectric)
                .SetDamageHeat(object.DamageHeat)
                .SetDamageToxin(object.DamageToxin)
                .SetDamageBlast(object.DamageBlast)
                .SetDamageCorrosive(object.DamageCorrosive)
                .SetDamageGas(object.DamageGas)
                .SetDamageMagnetic(object.DamageMagnetic)
                .SetDamageRadiation(object.DamageRadiation)
                .SetDamageViral(object.DamageViral)
                .SetDuration(object.Duration)
                .SetPellets(object.Pellets)
                .SetInheritCriticalChance(object.InheritCriticalChance)
                .SetOverrideCriticalChance(object.OverrideCriticalChance)
                .SetOverrideCriticalMultiplier(object.OverrideCriticalMultiplier)
                .SetOverrideStatusChance(object.OverrideStatusChance);

            return residual;
        }

        SetDuration(duration) {
            this.Duration = duration;
            return this;
        }

        SetPellets(pellets) {
            this.Pellets = pellets;
            return this;
        }

        SetInheritCriticalChance(inherit) {
            this.InheritCriticalChance = Uint8Array.from(inherit)[0] ? true : false;
            return this;
        }

        SetOverrideCriticalChance(criticalChance) {
            this.OverrideCriticalChance = criticalChance;
            return this;
        }

        SetOverrideCriticalMultiplier(criticalMultiplier) {
            this.OverrideCriticalMultiplier = criticalMultiplier;
            return this;
        }

        SetOverrideStatusChance(statusChance) {
            this.OverrideStatusChance = statusChance;
            return this;
        }

        SetDamageImpact(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.IMPACT] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamagePuncture(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.PUNCTURE] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageSlash(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.SLASH] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageCold(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.COLD] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageElectric(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.ELECTRIC] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageHeat(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.HEAT] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageToxin(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.TOXIN] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageBlast(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.BLAST] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageCorrosive(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.CORROSIVE] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageGas(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.GAS] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageMagnetic(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.MAGNETIC] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageRadiation(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.RADIATION] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        SetDamageViral(damage) {
            if (damage != undefined) this.OriginalBaseDamage[DamageType.VIRAL] = parseFloat(damage);
            this.$_UpdateBaseDamage();
            $_FlagChange(this);
            return this;
        }

        AddRelativeBaseDamage(damageType, proportion) {
            this.RelativeBaseDamage = {};
            this.RelativeBaseDamage[damageType] = (this.RelativeBaseDamage[damageType] || 0) + this.TotalOriginalBaseDamage * proportion;
            this.TotalRelativeBaseDamage = this.TotalOriginalBaseDamage * proportion;
            this.RelativeBaseDamageData = { Type: damageType, Proportion: proportion };

            $_FlagChange(this);
            return this;
        }

        $_UpdateBaseDamage() {
            this.TotalOriginalBaseDamage = 0;
            
            var keys = Object.keys(this.OriginalBaseDamage);
            for (var k = 0; k < keys.length; k++)
            {
                this.TotalOriginalBaseDamage += this.OriginalBaseDamage[keys[k]];
            }
        }

        get BaseDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'BaseDamage', function() {
                var baseDamage = {};
    
                var keys = Object.keys(MAIN.OriginalBaseDamage);
                for (var k = 0; k < keys.length; k++)
                {
                    baseDamage[keys[k]] = (baseDamage[keys[k]] || 0) + MAIN.OriginalBaseDamage[keys[k]];
                }

                var keys = Object.keys(MAIN.RelativeBaseDamage);
                for (var k = 0; k < keys.length; k++)
                {
                    baseDamage[keys[k]] = (baseDamage[keys[k]] || 0) + MAIN.RelativeBaseDamage[keys[k]];
                }
    
                return baseDamage;
            });
        }
    }
    $Classes.WeaponFiringModeResidual = WeaponFiringModeResidual;
    module.exports.WeaponFiringModeResidual = WeaponFiringModeResidual;

    class WeaponFiringModeResidualDetail {
        /**
         * 
         * @param {WeaponFiringModeResidual} residual 
         * @param {Weapon} weapon 
         */
        constructor(residual, weapon, r) {
            this.Residual = residual;
            this.Weapon = weapon;

            function $_generateWeaponResidualInstanceInstantiator(className, identifier, timer, critResult) {
                if (require) {
                    var $ClassesPriv = require('../../private/class-definitions/classes');
                    var instance = new $ClassesPriv.WeaponFiringModeResidualInstance(this, r, identifier, timer, critResult);
                    return instance;
                } else {
                    throw new Error('This can only be called from inside a simulation!');
                }
            }

            this.Instantiate = $_generateWeaponResidualInstanceInstantiator;
        }

        SetCriticalChance(criticalChance) {
            this.CriticalChance = criticalChance;
            return this;
        }

        SetCriticalMultiplier(criticalMultiplier) {
            this.CriticalMultiplier = criticalMultiplier;
            return this;
        }

        SetStatusChance(statusChance) {
            this.StatusChance = statusChance;
            return this;
        }

        SetBaseDamage(damage) {
            this.BaseDamage = damage;
            return this;
        }

        SetDamage(damage) {
            this.Damage = damage;
            return this;
        }

        SetDamageDisplay(damage) {
            this.DamageDisplay = damage;
            return this;
        }

        get InheritCriticalChance() {
            return this.Residual.InheritCriticalChance;
        }

        get BaseOverrideCriticalChance() {
            return this.Residual.OverrideCriticalChance;
        }

        get BaseOverrideCriticalMultiplier() {
            return this.Residual.OverrideCriticalMultiplier;
        }

        get BaseOverrideStatusChance() {
            return this.Residual.OverrideStatusChance;
        }

        get Pellets() {
            return this.Residual.Pellets;
        }

        get Duration() {
            return this.Residual.Duration;
        }
    }
    $Classes.WeaponFiringModeResidualDetail = WeaponFiringModeResidualDetail;
    module.exports.WeaponFiringModeResidualDetail = WeaponFiringModeResidualDetail;

    class Buff {
        /**
         * @param {import('../../private/class-definitions/classes').Timer} timer 
         * @param {number} duration 
         */
        constructor(timer = undefined, duration = undefined) {
            this.$_Effects = {};
            this.EffectDescriptions = {};

            this.Stacks = 1;
            this.RefreshToMaxDurationWhenExpires = false;

            /** @type {number} - Number of seconds before the buff is removed */
            this.$_TotalDuration = duration;

            /** @type {number} - Time on the timer when the buff is removed */
            this.RemoveTick;
            if (timer && duration) {
                this.RemoveTick = timer.ElapsedTime + this.$_TotalDuration;
            }

            /** @type {import('../../private/class-definitions/classes').Timer} - Simulation timer */
            this.Timer = timer;
        }

        SetName(name) {
            this.Name = name;
            return this;
        }

        SetStacks(stacks) {
            //Ensure stacks aren't negative
            this.Stacks = Math.min(Math.max(stacks, 0), this.MaxStacks || Number.MAX_VALUE);
            if (this.CanRefresh) {
                this.RefreshDuration();
            }
            $_FlagChange(this);
            return this;
        }

        SetMaxStacks(max) {
            this.MaxStacks = max;
            return this;
        }

        SetMaxBonus(bonus) {
            this.MaxBonus = bonus;
            return this;
        }

        AddStack() {
            this.SetStacks(this.Stacks + 1);
            return this;
        }

        RemoveStack() {
            this.SetStacks(this.Stacks - 1);
            return this;
        }

        SetCanRefresh(canRefresh) {
            this.CanRefresh = canRefresh;
            return this;
        }

        RefreshDuration() {
            if (this.Timer && this.$_TotalDuration) {
                this.RemoveTick = this.Timer.ElapsedTime + this.$_TotalDuration;
            }
            return this;
        }

        SetRefreshToMaxDurationWhenExpires(refreshToMaxDuration) {
            this.RefreshToMaxDurationWhenExpires = refreshToMaxDuration;
            return this;
        }

        AddModEffect(modEffect, power = 0, description = undefined) {
            this.$_Effects[modEffect] = parseFloat(power);
            if (description != undefined) {
                var updatedDescription = description;
                updatedDescription = updatedDescription
                    .replace('{{x%}}', (power * 100).toLocaleString())
                    .replace('{{x+}}', power.toLocaleString())
                    .replace('+-', '-');

                this.EffectDescriptions[modEffect] = updatedDescription;
            }
            $_FlagChange(this);
            return this;
        }

        get Effects() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'Effects', function() {
                var effects = {};
                var effKeys = Object.keys(MAIN.$_Effects);
                for (var e = 0; e < effKeys.length; e++) {
                    var effKey = effKeys[e];
                    effects[effKey] = Math.min(MAIN.$_Effects[effKey] * MAIN.Stacks, MAIN.MaxBonus);
                }

                return effects;
            });
        }

        get RemainingDuration() {
            if (this.RemoveTick && this.Timer)
                return this.RemoveTick - this.Timer.ElapsedTime;

            return undefined;
        }
    }
    $Classes.Buff = Buff;
    module.exports.Buff = Buff;

    class Mod {
        constructor() {
            this.Rank = undefined;

            this.$_Effects = {};
            this.$_EffectDescriptions = {};

            this.$_EffectRankOverrides = {};

            $_FlagChange(this);
        }

        ToObject() {
            var data = {
                Name: this.Name,
                Image: this.Image,
                Rarity: this.Rarity,
                ModType: this.ModType,
                MinDrain: this.MinDrain,
                Rank: this.Rank,
                Ranks: this.Ranks,
                $_EffectDescriptions: this.$_EffectDescriptions,
                $_Effects: this.$_Effects,
                $_EffectRankOverrides: this.$_EffectRankOverrides
            }

            return data;
        }

        /**
         * 
         * @param {Mod} object 
         */
        static FromObject(object) {
            var mod = new Mod()
                .SetName(object.Name)
                .SetImage(object.Image)
                .SetRarity(object.Rarity)
                .SetType(object.ModType)
                .SetDrain(object.MinDrain, object.Ranks)
                .SetRank(object.Rank);

            var effKeys = Object.keys(object.$_Effects);
            for (var e = 0; e < effKeys.length; e++)
            {
                var effType = effKeys[e];
                mod.AddEffect(effType, object.$_Effects[effType]);
            }

            mod.$_EffectDescriptions = object.$_EffectDescriptions;
            mod.$_EffectRankOverrides = object.$_EffectRankOverrides;

            return mod;
        }

        SetName(name) {
            this.Name = name;
            return this;
        }

        SetImage(image) {
            this.Image = image;
            return this;
        }

        SetRarity(rarity) {
            this.Rarity = rarity;
            return this;
        }

        SetType(modType) {
            this.ModType = modType;
            $_FlagChange(this);
            return this;
        }

        SetDrain(minDrain, ranks) {
            this.MinDrain = minDrain;
            this.Ranks = ranks;
            
            this.SetRank(ranks);
            return this;
        }

        AddEffect(modEffect, power = 0, description = undefined) {
            this.$_Effects[modEffect] = parseFloat(power);
            if (description != undefined) {
                this.$_EffectDescriptions[modEffect] = description;

                /*var updatedDescription = description;
                updatedDescription = updatedDescription
                    .replace('{{x%}}', (power * 100).toLocaleString())
                    .replace('{{x+}}', power.toLocaleString())
                    .replace('+-', '-');

                this.EffectDescriptions[modEffect] = updatedDescription;*/
            }
            $_FlagChange(this);
            return this;
        }

        /**
         * Overrides a specific mod effect at a specified rank
         * @param {number} rank 
         * @param {ModEffect} modEffect 
         * @param {number} power 
         */
        AddEffectRankOverride(rank, modEffect, power = 0) {
            this.$_EffectRankOverrides[rank] = this.$_EffectRankOverrides[rank] || {};
            this.$_EffectRankOverrides[rank][modEffect] = power;
            return this;
        }

        SetRank(rank) {
            this.Rank = Math.max(Math.min(rank, this.Ranks), 0);

            $_FlagChange(this);
            if (this.$_SlottedWeapon != null) {
                $_FlagChange(this.$_SlottedWeapon);
            }

            return this;
        }

        /**
         * 
         * @param {Weapon} weapon 
         */
        IsCompatible(weapon) {
            if (weapon.ModTypes.indexOf(this.ModType) >= 0 || this.ModType == 9999)
                return true;

            return false;
        }

        /**
         * 
         * @param {Weapon} weapon 
         */
        SetSlottedWeapon(weapon) {
            this.$_SlottedWeapon = weapon;
            return this;
        }

        get Effects() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'Effects', function() {
                var modEffects = {};

                function parseEffects(effects, scaleToRank) {
                    if (effects == undefined)
                        return;

                    var keys = Object.keys(effects);
                    for (var e = 0; e < keys.length; e++)
                    {
                        var effect = keys[e];
                        var power = effects[effect];

                        if (scaleToRank) {
                            modEffects[effect] = ((MAIN.Rank + 1) / (MAIN.Ranks + 1)) * power;
                        } else {
                            modEffects[effect] = power;
                        }
                    }
                }

                parseEffects(MAIN.$_Effects, true);
                parseEffects(MAIN.$_EffectRankOverrides[MAIN.Rank], false);

                return modEffects;
            });
        }

        get EffectDescriptions() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'EffectDescriptions', function() {
                var effectDescriptions = {};

                var keys = Object.keys(MAIN.$_EffectDescriptions);
                for (var d = 0; d < keys.length; d++)
                {
                    var effect = keys[d];
                    var description = MAIN.$_EffectDescriptions[effect];

                    var power = MAIN.Effects[effect];

                    var updatedDescription = description;
                    updatedDescription = updatedDescription
                        .replace('{{x%}}', (power * 100).toLocaleString())
                        .replace('{{x+}}', power.toLocaleString())
                        .replace('+-', '-');

                    effectDescriptions[effect] = updatedDescription;
                }

                return effectDescriptions;
            });
        }

        get Description() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'Description', function() {
                var effectDescriptions = MAIN.EffectDescriptions;
                var descriptions = []
                var keys = Object.keys(effectDescriptions);
                for (var k = 0; k < keys.length; k++)
                {
                    var key = keys[k];
                    descriptions.push(effectDescriptions[key]);
                }
    
                return descriptions.join('\n');
            });
        }

        get ModBorder() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'ModBorder', function() {
                return ModRarityBackground[MAIN.Rarity];
            });
        }

        get ModTypeDisplay() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'ModTypeDisplay', function() {
                return WeaponTypeName[MAIN.ModType];
            });
        }

        get MaxDrain() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'MaxDrain', function() {
                return MAIN.MinDrain + MAIN.Ranks;
            });
        }

        get UrlNameClean() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'UrlNameClean', function() {
                /** @type {string} */
                var urlName = MAIN.Name.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9\-]/g, '');

                return urlName;
            });
        }

        get UrlName() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'UrlName', function() {
                /** @type {string} */
                var urlName = MAIN.UrlNameClean;

                if (MAIN.Rank < MAIN.Ranks) {
                    var urlNameAdd = '';
                    urlNameAdd = `${MAIN.Rank}`;

                    if (urlNameAdd != '') {
                        if (!urlName.includes('@')) {
                            urlName += `@r:${urlNameAdd}`;
                        } else {
                            urlName += `&r:${urlNameAdd}`;
                        }
                    }
                }

                if (MAIN.Name.toLowerCase() == 'riven mod') {
                    var urlNameAdd = '';
                    var keys = Object.keys(MAIN.$_Effects);
                    for (var e = 0; e < keys.length; e++)
                    {
                        var effect = keys[e];
                        urlNameAdd += `${urlNameAdd != '' ? ';' : ''}${effect}:${MAIN.$_Effects[effect].toFixed(5)}`;
                    }

                    if (urlNameAdd != '') {
                        if (!urlName.includes('@')) {
                            urlName += `@e:${urlNameAdd}`;
                        } else {
                            urlName += `&e:${urlNameAdd}`;
                        }
                    }
                }

                return urlName;
            });
        }
    }
    $Classes.Mod = Mod;
    module.exports.Mod = Mod;

    class Enemy {
        constructor() {
            this.BaseShieldMultiplier = 1;
            this.BaseArmorMultiplier = 1;
            this.BaseHealthMultiplier = 1;

            $_FlagChange(this);
        }

        ToObject() {
            var data = {
                Name: this.Name,
                BaseLevel: this.BaseLevel,
                Level: this.Level,
                ShieldType: this.ShieldTypeId,
                BaseShield: this.BaseShield,
                ArmorType: this.ArmorTypeId,
                BaseArmor: this.BaseArmor,
                HealthType: this.HealthTypeId,
                BaseHealth: this.BaseHealth,
                Image: this.Image
            }

            return data;
        }

        static FromObject(object) {
            var enemy = new this()
                .SetName(object.Name)
                .SetBaseLevel(object.BaseLevel)
                .SetLevel(object.Level)
                .SetShieldType(object.ShieldType)
                .SetShield(object.BaseShield)
                .SetArmorType(object.ArmorType)
                .SetArmor(object.BaseArmor)
                .SetHealthType(object.HealthType)
                .SetHealth(object.BaseHealth)
                .SetImage(object.Image);

            return enemy;
        }

        SetName(name) {
            this.Name = name;
            return this;
        }

        SetBaseLevel(baseLevel) {
            this.BaseLevel = Math.max(baseLevel, 1);
            $_FlagChange(this);
            return this;
        }

        SetLevel(level) {
            this.Level = level; //Math.max(level, this.BaseLevel);
            return this;
        }

        SetShieldType(shieldType) {
            this.ShieldTypeId = shieldType;
            $_FlagChange(this);
            return this;
        }

        SetShield(shield) {
            this.BaseShield = shield;
            $_FlagChange(this);
            return this;
        }

        SetShieldMultiplier(multiplier) {
            this.BaseShieldMultiplier = multiplier;
            $_FlagChange(this);
            return this;
        }

        SetArmorType(armorType) {
            /** @type {ArmorType} */
            this.ArmorTypeId = armorType;
            $_FlagChange(this);
            return this;
        }

        SetArmor(armor) {
            this.BaseArmor = armor;
            $_FlagChange(this);
            return this;
        }

        SetArmorMultiplier(multiplier) {
            this.BaseArmorMultiplier = multiplier;
            $_FlagChange(this);
            return this;
        }

        SetHealthType(healthType) {
            this.HealthTypeId = healthType;
            $_FlagChange(this);
            return this;
        }

        SetHealth(health) {
            this.BaseHealth = health;
            $_FlagChange(this);
            return this;
        }

        SetHealthMultiplier(multiplier) {
            this.BaseHealthMultiplier = multiplier;
            $_FlagChange(this);
            return this;
        }

        SetImage(image) {
            this.Image = image;
            $_FlagChange(this);
            return this;
        }

        get UrlName() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'UrlName', function() {
                return MAIN.Name.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9\-]/g, '');
            });
        }

        get UrlPath() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'UrlPath', function() {
                return MAIN.UrlName + '+' + MAIN.Level;
            });
        }

        get Level() {
            return this.$_Level;
        }

        set Level(value) {
            this.$_Level = parseInt(value);
            $_FlagChange(this);
        }

        get Shield() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'Shield', function() {
                function f1(x) { return 1 + 0.0075 * Math.pow(x - MAIN.BaseLevel, 2); }
                function f2(x) { return 1 + 1.6 * Math.pow(x - MAIN.BaseLevel, 0.75); }
                function f3(x) { return Math.min(1, (Math.max(x, 70 + MAIN.BaseLevel) - (70 + MAIN.BaseLevel)) / 15) }

                return MAIN.BaseShieldMultiplier * MAIN.BaseShield * (1 + (f1(MAIN.Level) - 1) * (1 - f3(MAIN.Level)) + (f2(MAIN.Level) - 1) * f3(MAIN.Level));
            });
        }

        get ShieldType() {
            if (this.ShieldTypeId == null) return null;
            return ShieldTypeName[this.ShieldTypeId].Multipliers;
        }

        get ShieldTypeName() {
            if (this.ShieldTypeId == null) return null;
            return ShieldTypeName[this.ShieldTypeId].Name;
        }

        get Armor() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'Armor', function() {
                function f1(x) { return 1 + 0.005 * Math.pow(x - MAIN.BaseLevel, 1.75); }
                function f2(x) { return 1 + 0.4 * Math.pow(x - MAIN.BaseLevel, 0.75); }
                function f3(x) { return Math.min(1, (Math.max(x, 60 + MAIN.BaseLevel) - (60 + MAIN.BaseLevel)) / 20) }

                return MAIN.BaseArmorMultiplier * MAIN.BaseArmor * (1 + (f1(MAIN.Level) - 1) * (1 - f3(MAIN.Level)) + (f2(MAIN.Level) - 1) * f3(MAIN.Level));
            });
        }

        get ArmorType() {
            if (this.ArmorTypeId == null) return null;
            return ArmorTypeName[this.ArmorTypeId].Multipliers;
        }

        get ArmorTypeName() {
            if (this.ArmorTypeId == null) return null;
            return ArmorTypeName[this.ArmorTypeId].Name;
        }

        get Health() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'Health', function() {
                function f1(x) { return 1 + 0.015 * Math.pow(x - MAIN.BaseLevel, 2); }
                function f2(x) { return 1 + 10.7331 * Math.pow(x - MAIN.BaseLevel, 0.5); }
                function f3(x) { return Math.min(1, (Math.max(x, 70 + MAIN.BaseLevel) - (70 + MAIN.BaseLevel)) / 15) }

                return MAIN.BaseHealthMultiplier * MAIN.BaseHealth * (1 + (f1(MAIN.Level) - 1) * (1 - f3(MAIN.Level)) + (f2(MAIN.Level) - 1) * f3(MAIN.Level));
            });
        }

        get HealthType() {
            if (this.HealthTypeId == null) return null;
            return HealthTypeName[this.HealthTypeId].Multipliers;
        }

        get HealthTypeName() {
            if (this.HealthTypeId == null) return null;
            return HealthTypeName[this.HealthTypeId].Name;
        }
    }
    $Classes.Enemy = Enemy;
    module.exports.Enemy = Enemy;


    class ResultDisplay {
        constructor() {
            this.MainBubbles = [];
            this.Blocks = [];
            this.Classes = [];
        }

        AddMainBubble() {
            var bubble = new ResultMainBubble(this);
            this.MainBubbles.push(bubble);
            return bubble;
        }

        DefineRow(numberInRow, classes) {
            for (var i = 0; i < numberInRow; i++)
            {
                this.Blocks.push(numberInRow);
                this.Classes.push(classes);
            }
            return this;
        }
    }
    $Classes.ResultDisplay = ResultDisplay;
    module.exports.ResultDisplay = ResultDisplay;

    class ResultMainBubble {
        constructor(resultDisplayOrParent) {
            /** @type {ResultDisplay | ResultMainBubble} */
            this.ResultDisplay = resultDisplayOrParent;

            this.$_SubBubbles = [];

            this.$_ReplacementBubbles = {};
            this.$_ReplacementKey = null;

            this.$_SubBubbleId = 0;
        }

        SetTitle(title) {
            this.$_Title = title;
            return this;
        }

        SetIcon(icon) {
            this.$_Icon = icon;
            return this;
        }

        SetImage(image) {
            this.$_Image = image;
            return this;
        }

        AddSubBubble() {
            var bubble = new ResultSubBubble(this, this.$_SubBubbleId++);
            this.$_SubBubbles.push(bubble);
            return bubble;
        }

        ReplaceMainBubble(key) {
            var bubble = new ResultMainBubble(key);
            this.$_ReplacementBubbles[key.Id] = bubble;
            //console.log(this.$_ReplacementBubbles);
            return bubble;
        }

        /** @returns {ResultDisplay} */
        FinalizeMainBubble() {
            var actual = 0;
            for (var s = 0; s < this.$_SubBubbles.length; s++)
            {
                if (this.$_SubBubbles[s].Location == null) {
                    actual++;
                }
            }

            var angle = 180 - 30 * (actual - 1);
            for (var s = 0; s < this.$_SubBubbles.length; s++)
            {
                if (this.$_SubBubbles[s].Location == null) {
                    this.$_SubBubbles[s].Location = 'sub-' + angle;
                    angle += 60;
                }
            }

            return this.ResultDisplay;
        }

        /** @return {ResultSubBubble} */
        FinalizeReplacementBubble() {
            var actual = 0;
            for (var s = 0; s < this.$_SubBubbles.length; s++)
            {
                if (this.$_SubBubbles[s].Location == null) {
                    actual++;
                }
            }

            var angle = 180 - 30 * (actual - 1);
            for (var s = 0; s < this.$_SubBubbles.length; s++)
            {
                if (this.$_SubBubbles[s].Location == null) {
                    this.$_SubBubbles[s].Location = 'sub-' + angle;
                    angle += 60;
                }
            }

            return this.ResultDisplay;
        }

        ActivateReplacement(key) {
            //console.log(key);
            if (key.IsKey) {
                this.$_ReplacementKey = key.Id;
            }
        }

        DeactivateReplacement() {
            this.$_ReplacementKey = null;
        }

        get Title() {
            if (this.$_ReplacementKey == null) {
                return this.$_Title;
            } else {
                return this.$_ReplacementBubbles[this.$_ReplacementKey].Title;
            }
        }

        get Icon() {
            if (this.$_ReplacementKey == null) {
                return this.$_Icon;
            } else {
                return this.$_ReplacementBubbles[this.$_ReplacementKey].Icon;
            }
        }

        get Image() {
            if (this.$_ReplacementKey == null) {
                return this.$_Image;
            } else {
                return this.$_ReplacementBubbles[this.$_ReplacementKey].Image;
            }
        }

        get SubBubbles() {
            if (this.$_ReplacementKey == null) {
                return this.$_SubBubbles;
            } else {
                return this.$_ReplacementBubbles[this.$_ReplacementKey].SubBubbles;
            }
        }
    }

    class ResultSubBubble {
        constructor(mainBubble, id) {
            /** @type {ResultMainBubble} */
            this.MainBubble = mainBubble;

            this.Id = id;

            this.IsKey = false;
            this.IsBack = false;
        }

        SetSize(size) {
            this.Size = size;
            return this;
        }

        SetLocation(location) {
            this.Location = 'sub-' + location;
            return this;
        }

        SetIcon(icon) {
            this.Icon = icon;
            return this;
        }

        SetValue(value) {
            this.Value = value;
            return this;
        }

        SetAltName(altName) {
            this.AltName = altName;
            return this;
        }

        ReplaceMainBubble(icon, location) {
            this.IsKey = true;
            var bubble = this.MainBubble.ReplaceMainBubble(this);
            var subBubble = bubble.AddSubBubble()
                .SetSize('small')
                .SetIcon(icon)
                .SetValue('Back')
                .SetAltName('Go Back');

            if (location != undefined) {
                subBubble.SetLocation(location);
            }

            subBubble.IsBack = true;
            subBubble.FinalizeSubBubble();

            return bubble;
        }

        FinalizeSubBubble() {
            return this.MainBubble;
        }

        DoReplacement(mainBubble) {
            if (this.IsKey) {
                mainBubble.ActivateReplacement(this);
            }

            if (this.IsBack) {
                mainBubble.DeactivateReplacement();
            }
        }

        get Classes() {
            var result = {};
            result[this.Location] = true;
            result[this.Size] = true;

            return result;
        }
    }

    class SimulationRequest {
        constructor() {
            /** @type {{ Name: string, Level: number }} */
            this.Enemy1;
            /** @type {{ Name: string, Level: number }} */
            this.Enemy2;
            /** @type {{ Name: string, Level: number }} */
            this.Enemy3;
            /** @type {{ Name: string, Level: number }} */
            this.Enemy4;

            this.AdditionalSettingsVariables = {};
        }

        ToObject() {
            var data = {
                Weapon: this.Weapon,
                Enemy1: this.Enemy1,
                Enemy2: this.Enemy2,
                Enemy3: this.Enemy3,
                Enemy4: this.Enemy4,
                Settings: this.Settings,
                AdditionalSettingsVariables: this.AdditionalSettingsVariables
            };

            return data;
        }

        /**
         * 
         * @param {SimulationRequest} data 
         */
        static FromObject(data) {
            var request = new this();
            request.Weapon = data.Weapon;
            request.Enemy1 = data.Enemy1;
            request.Enemy2 = data.Enemy2;
            request.Enemy3 = data.Enemy3;
            request.Enemy4 = data.Enemy4;
            request.Settings = data.Settings;
            request.AdditionalSettingsVariables = data.AdditionalSettingsVariables;

            return request;
        }

        /**
         * 
         * @param {Weapon} weapon 
         */
        SetWeapon(weapon) {
            this.Weapon = {
                Name: weapon.UrlName,
                FiringMode: weapon.FiringMode.UrlName,
                Mods: [
                    weapon.Mods[0] != null ? weapon.Mods[0].UrlName : null,
                    weapon.Mods[1] != null ? weapon.Mods[1].UrlName : null,
                    weapon.Mods[2] != null ? weapon.Mods[2].UrlName : null,
                    weapon.Mods[3] != null ? weapon.Mods[3].UrlName : null,
                    weapon.Mods[4] != null ? weapon.Mods[4].UrlName : null,
                    weapon.Mods[5] != null ? weapon.Mods[5].UrlName : null,
                    weapon.Mods[6] != null ? weapon.Mods[6].UrlName : null,
                    weapon.Mods[7] != null ? weapon.Mods[7].UrlName : null
                ]
            };
            return this;
        }

        /**
         * 
         * @param {Enemy} enemy 
         */
        SetEnemy(pos, enemy) {
            if (pos < 0 || pos >= 4)
                throw new Error('Cannot specify more than 4 enemies!');

            this[`Enemy${pos+1}`] = {
                Name: enemy != null ? enemy.UrlName : null,
                Level: enemy != null ? enemy.Level : null
            };
            return this;
        }

        /**
         * 
         * @param {string} type 
         * @param {number} accuracy 
         * @param {number} headshot 
         */
        SetSettings(type, accuracy, headshot) {
            this.Settings = {
                Type: type,
                Accuracy: accuracy,
                Headshot: headshot
            }
            return this;
        }

        /**
         * 
         * @param {{}} additionalSettingsVariables 
         */
        SetAdditionalSettingsVariables(additionalSettingsVariables) {
            this.AdditionalSettingsVariables = additionalSettingsVariables;
            return this;
        }
    }
    $Classes.SimulationRequest = SimulationRequest;
    module.exports.SimulationRequest = SimulationRequest;

    class SimulationProgress {
        constructor() {

        }

        ToObject() {
            var data = {
                Progress: this.Progress
            };

            return data;
        }

        /**
         * 
         * @param {ProgressEvent} object 
         */
        static FromObject(object) {
            var progress = new this()
                .SetProgress(object.Progress);

            return progress;
        }

        SetProgress(amount) {
            this.Progress = amount;
            return this;
        }
    }
    $Classes.SimulationProgress = SimulationProgress;
    module.exports.SimulationProgress = SimulationProgress;

    class QueueProgress {
        constructor() {

        }

        ToObject() {
            var data = {
                InitialPosition: this.InitialPosition,
                CurrentPosition: this.CurrentPosition
            };

            return data;
        }

        /**
         * 
         * @param {QueueProgress} object 
         */
        static FromObject(object) {
            var progress = new this()
                .SetInitialPosition(object.InitialPosition)
                .SetCurrentPosition(object.CurrentPosition);

            return progress;
        }

        SetInitialPosition(position) {
            this.InitialPosition = position;
            return this;
        }

        SetCurrentPosition(position) {
            this.CurrentPosition = position;
            return this;
        }
    }
    $Classes.QueueProgress = QueueProgress;
    module.exports.QueueProgress = QueueProgress;

    class SimulationError {
        /**
         * 
         * @param {Enemy} enemy 
         */
        constructor(enemy) {
            if (enemy != undefined) {
                this.Enemy = {
                    Name: enemy.Name
                };
            }
        }

        ToObject() {
            var data = {
                $_Id: this.$_Id,
                Stack: this.Stack,
                Enemy: this.Enemy
            };

            return data;
        }

        /**
         * 
         * @param {SimulationError} object 
         */
        static FromObject(object) {
            var error = new this()
                .SetId(object.$_Id)
                .SetStack(object.Stack);

            error.Enemy = object.Enemy;

            return error;
        }

        /**
         * 
         * @param {number} id 
         */
        SetId(id) {
            this.$_Id = id;
            return this;
        }

        /**
         * 
         * @param {Error} error 
         */
        SetError(error) {
            this.Stack = error.stack;
            return this;
        }

        SetStack(stack) {
            this.Stack = stack;
            return this;
        }
    }
    $Classes.SimulationError = SimulationError;
    module.exports.SimulationError = SimulationError;

    class Metrics {
        /**
         * 
         * @param {Weapon} weapon 
         * @param {Enemy} enemy 
         */
        constructor(weapon, enemy) {
            if (enemy != undefined) {
                this.Enemy = {
                    ArmorAtDeath: undefined,
                    TotalArmor: enemy.Armor,
                    TotalHealth: enemy.Health,
                    TotalShield: enemy.Shield,
                    Name: enemy.Name,
                    UrlName: enemy.UrlName,
                    Level: enemy.Level,
                    Image: enemy.Image
                };
            }

            this.KillTime = undefined;

            /** @type {{ [key: number]: ProcMetrics }} */
            this.Procs = {};

            this.ShotsFired = 0;
            this.PelletsFired = 0;
            this.Hits = 0;
            this.Headshots = 0;
            this.HeadCrits = 0;

            this.Reloads = 0;

            this.Crits = {};

            this.Instances = [];

            this.Times = { Raw: {}, Total: {} };
        }

        ToObject() {
            var data = {
                $_Id: this.$_Id,
                Enemy: this.Enemy,
                KillTime: this.KillTime,
                Procs: {},
                ShotsFired: this.ShotsFired,
                PelletsFired: this.PelletsFired,
                Hits: this.Hits,
                Headshots: this.Headshots,
                HeadCrits: this.HeadCrits,
                Reloads: this.Reloads,
                Crits: this.Crits,
                Instances: this.Instances,
                Times: this.Times
            };

            var keys = Object.keys(this.Procs);
            for (var p = 0; p < keys.length; p++)
            {
                /** @type {number} */
                var key = keys[p];
                var proc = this.Procs[key];

                data.Procs[key] = proc.ToObject();
            }

            return data;
        }

        /**
         * 
         * @param {Metrics} object 
         */
        static FromObject(object) {
            var metrics = new this();

            metrics.$_Id = object.$_Id;
            metrics.Enemy = object.Enemy;
            metrics.KillTime = object.KillTime;
            metrics.ShotsFired = object.ShotsFired;
            metrics.PelletsFired = object.PelletsFired;
            metrics.Hits = object.Hits;
            metrics.Headshots = object.Headshots;
            metrics.HeadCrits = object.HeadCrits;
            metrics.Reloads = object.Reloads;
            metrics.Crits = object.Crits;
            metrics.Instances = object.Instances;
            metrics.Times = object.Times;

            var keys = Object.keys(object.Procs);
            for (var p = 0; p < keys.length; p++)
            {
                /** @type {number} */
                var key = keys[p];
                var proc = object.Procs[key];

                metrics.Procs[key] = ProcMetrics.FromObject(proc, metrics);
            }

            return metrics;
        }

        SetId(id) {
            this.$_Id = id;
            return this;
        }

        SetKillTime(killTime) {
            this.KillTime = killTime;
            return this;
        }

        SetEnemyArmorAtDeath(armor) {
            this.Enemy.ArmorAtDeath = armor;
            return this;
        }

        AddShotsFired(count) {
            this.ShotsFired += count;
            return this;
        }

        AddPelletsFired(count) {
            this.PelletsFired += count;
            return this;
        }

        AddHits(count) {
            this.Hits += count;
            return this;
        }

        AddHeadshots(count) {
            this.Headshots += count;
            return this;
        }

        AddHeadCrits(count) {
            this.HeadCrits += count;
            return this;
        }

        AddReload() {
            this.Reloads += 1;
            return this;
        }

        ParseCriticals(criticals) {
            var keys = Object.keys(criticals);
            for (var k = 0; k < keys.length; k++)
            {
                var key = keys[k];
                this.Crits[key] = (this.Crits[key] || 0) + criticals[key];
            }
            return this;
        }

        ParseProcs(procs) {
            for (var p = 0; p < procs.length; p++)
            {
                var proc = parseInt(procs[p]);
                this.Procs[proc] = this.Procs[proc] || new ProcMetrics(this);
                this.Procs[proc].AddProcCount(1);
            }
            return this;
        }

        AddShotDamageInstance(identifier, damage, time) {
            this.Instances[identifier] = (this.Instances[identifier] || 0) + damage;
            this.$_AddRawTimeDamage(damage, time);
            return this;
        }

        /**
         * 
         * @param {number} identifier 
         * @param {number} procType 
         * @param {number} damage 
         */
        AddProcDamageInstance(identifier, damage, procType, time) {
            this.Procs[procType] = this.Procs[procType] || new ProcMetrics(this);
            this.Procs[procType].AddProcDamageInstance(identifier, damage);
            this.$_AddTotalTimeDamage(damage, time);
            return this;
        }

        $_AddRawTimeDamage(damage, time) {
            this.Times.Raw[time] = (this.Times.Raw[time] || 0) + damage;
        }

        $_AddTotalTimeDamage(damage, time) {
            this.$_AddRawTimeDamage(damage, time);
            this.Times.Total[time] = (this.Times.Total[time] || 0) + damage;
        }

        get CumulativeTotalDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'CumulativeTotalDamage', function() {
                var total = 0;

                var keys = Object.keys(MAIN.Instances);
                for (var k = 0; k < keys.length; k++)
                {
                    var individual = 0;

                    /** @type {number} */
                    var key = keys[k];
                    individual += MAIN.Instances[key];

                    var procKeys = Object.keys(MAIN.Procs);
                    for (var p = 0; p < procKeys.length; p++)
                    {
                        /** @type {number} */
                        var procKey = procKeys[p];
                        var procArray = MAIN.Procs[procKey].Instances[key];

                        //Only some shots produce procs, so skip over the ones that have none
                        if (procArray == null) continue;

                        for (var a = 0; a < procArray.length; a++)
                        {
                            individual += procArray[a];
                        }
                    }

                    total += individual;
                }

                return total;
            });
        }

        get CumulativeRawDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'CumulativeRawDamage', function() {
                var raw = 0;

                var keys = Object.keys(MAIN.Instances);
                for (var k = 0; k < keys.length; k++)
                {
                    var individual = 0;

                    /** @type {number} */
                    var key = keys[k];
                    individual += MAIN.Instances[key];

                    raw += individual;
                }

                return raw;
            });
        }

        get MaximumTotalDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'MaximumTotalDamage', function() {
                var maximum = 0;

                var keys = Object.keys(MAIN.Instances);
                for (var k = 0; k < keys.length; k++)
                {
                    var test = 0;

                    /** @type {number} */
                    var key = keys[k];
                    test += MAIN.Instances[key];

                    var procKeys = Object.keys(MAIN.Procs);
                    for (var p = 0; p < procKeys.length; p++)
                    {
                        /** @type {number} */
                        var procKey = procKeys[p];
                        var procArray = MAIN.Procs[procKey].Instances[key];

                        //Only some shots produce procs, so skip over the ones that have none
                        if (procArray == null) continue;

                        for (var a = 0; a < procArray.length; a++)
                        {
                            test += procArray[a];
                        }
                    }

                    if (test > maximum) {
                        maximum = test;
                    }
                }

                return maximum;
            });
        }

        get MaximumRawDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'MaximumRawDamage', function() {
                var maximum = 0;

                var keys = Object.keys(MAIN.Instances);
                for (var k = 0; k < keys.length; k++)
                {
                    var test = 0;

                    /** @type {number} */
                    var key = keys[k];
                    test += MAIN.Instances[key];

                    if (test > maximum) {
                        maximum = test;
                    }
                }

                return maximum;
            });
        }

        get AverageTotalDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AverageTotalDamage', function() {
                return MAIN.CumulativeTotalDamage / MAIN.ShotsFired;
            });
        }

        get AverageRawDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AverageRawDamage', function() {
                return MAIN.CumulativeRawDamage / MAIN.ShotsFired;
            });
        }

        get AverageTotalDPS() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AverageTotalDPS', function() {
                return MAIN.CumulativeTotalDamage / MAIN.KillTime;
            });
        }

        get AverageRawDPS() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AverageRawDPS', function() {
                return MAIN.CumulativeRawDamage / MAIN.KillTime;
            });
        }

        get RawDamageProportion() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'RawDamageProportion', function() {
                return MAIN.CumulativeRawDamage / MAIN.CumulativeTotalDamage;
            });
        }
    }
    $Classes.Metrics = Metrics;
    module.exports.Metrics = Metrics;

    class ProcMetrics {
        /**
         * 
         * @param {Metrics} metrics 
         */
        constructor(metrics) {
            this.Metrics = metrics;

            this.$_Count = 0;

            /** @type {number[][]} */
            this.Instances = [];
        }

        ToObject() {
            var data = {
                $_Count: this.$_Count,
                Instances: this.Instances
            };

            return data;
        }

        /**
         * 
         * @param {ProcMetrics} object 
         */
        static FromObject(object, metrics) {
            var proc = new this(metrics);

            proc.$_Count = object.$_Count;
            proc.Instances = object.Instances;

            return proc;
        }

        AddProcCount(count) {
            this.$_Count += count;
            return this;
        }

        AddProcDamageInstance(identifier, damage) {
            this.Instances[identifier] = (this.Instances[identifier] || []);
            this.Instances[identifier].push(damage);
            return this;
        }

        get ProcCount() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'ProcCount', function() {
                /*var count = 0;

                var keys = Object.keys(MAIN.Instances);
                for (var k = 0; k < keys.length; k++)
                {
                    var key = keys[k];

                    if (MAIN.Instances[key] == null)
                        continue;

                    count += 1;
                }

                return count;*/

                return MAIN.$_Count;
            });
        }

        get TickCount() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'TickCount', function() {
                var count = 0;
                var keys = Object.keys(MAIN.Instances);
                for (var k = 0; k < keys.length; k++)
                {
                    var key = parseInt(keys[k]);

                    if (MAIN.Instances[key] == null)
                        continue;

                    count += MAIN.Instances[key].length;
                }

                return count;
            });
        }

        get CumulativeDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'CumulativeDamage', function() {
                var cumulative = 0;
                var keys = Object.keys(MAIN.Instances);
                for (var k = 0; k < keys.length; k++)
                {
                    var key = keys[k];

                    if (MAIN.Instances[key] == null)
                        continue;

                    for (var i = 0; i < MAIN.Instances[key].length; i++)
                    {
                        cumulative += MAIN.Instances[key][i];
                    }
                }

                return cumulative;
            });
        }

        get MaximumProcDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'MaximumProcDamage', function() {
                var maximum = 0;
                var keys = Object.keys(MAIN.Instances);
                for (var k = 0; k < keys.length; k++)
                {
                    var procSum = 0;
                    var key = keys[k];

                    if (MAIN.Instances[key] == null)
                        continue;

                    for (var i = 0; i < MAIN.Instances[key].length; i++)
                    {
                        procSum += MAIN.Instances[key][i]
                    }
                    if (procSum > maximum)
                        maximum = procSum;
                }

                return maximum;
            });
        }

        get MaximumTickDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'MaximumTickDamage', function() {
                var maximum = 0;
                var keys = Object.keys(MAIN.Instances);
                for (var k = 0; k < keys.length; k++)
                {
                    var key = keys[k];

                    if (MAIN.Instances[key] == null)
                        continue;

                    for (var i = 0; i < MAIN.Instances[key].length; i++)
                    {
                        if (MAIN.Instances[key][i] > maximum)
                            maximum = MAIN.Instances[key][i];
                    }
                }

                return maximum;
            });
        }

        get AverageProcDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AverageProcDamage', function() {
                return MAIN.CumulativeDamage / MAIN.ProcCount;
            });
        }

        get AverageTickDamage() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AverageTickDamage', function() {
                var result = MAIN.CumulativeDamage / MAIN.TickCount;
                return !isNaN(result) ? result : 0;
            });
        }

        get DamageProportion() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'DamageProportion', function() {
                return MAIN.CumulativeDamage / (MAIN.Metrics.Enemy.TotalHealth + MAIN.Metrics.Enemy.TotalShield);
            });
        }
    }
    $Classes.ProcMetrics = ProcMetrics;
    module.exports.ProcMetrics = ProcMetrics;

    class EncodedMessage {
        constructor() {

        }

        ToObject() {
            var data = {
                $_Data: this.$_Data,
                $_DataType: this.$_DataType
            };

            return data;
        }

        ToString() {
            var data = this.ToObject();
            return JSON.stringify(data);
        }

        static FromObject(object) {
            var message = new EncodedMessage();
            message.$_Data = object.$_Data;
            message.$_DataType = object.$_DataType;

            return message;
        }

        Encode(data) {
            if (data.ToObject == undefined || data.constructor.FromObject == undefined)
                throw new Error('The encoded object must have ToObject() and FromObject(obj) methods!');

            this.$_Data = data.ToObject();
            this.$_DataType = data.constructor.name;

            return this;
        }

        /**
         * @returns {*}
         */
        Decode() {
            var result = null;
            switch (this.$_DataType) {
                case (Metrics.name):
                    result = Metrics.FromObject(this.$_Data);
                    break;

                case (QueueProgress.name):
                    result = QueueProgress.FromObject(this.$_Data);
                    break;

                case (SimulationError.name):
                    result = SimulationError.FromObject(this.$_Data);
                    break;

                case (SimulationProgress.name):
                    result = SimulationProgress.FromObject(this.$_Data);
                    break;

                case (SimulationRequest.name):
                    result = SimulationRequest.FromObject(this.$_Data);
                    break;

                default:
                    throw new Error(`No specified handling for ${this.$_DataType}; must be added to the switch above!`);
            }

            return result;
        }
    }
    $Classes.EncodedMessage = EncodedMessage;
    module.exports.EncodedMessage = EncodedMessage;

    class EncodedMessageHandler {
        constructor() {
            this.Handlers = {};
        }

        /**
         * 
         * @param {string} className 
         * @param {function(object) => void} callback 
         */
        CreateHandle(className, callback) {
            if (this.Handlers[className] != undefined)
                throw new Error('This EncodedMessageHandler already has a callback for this class type!');

            this.Handlers[className] = callback;
            return this;
        }

        /**
         * 
         * @param {Object} object 
         */
        DoHandle(object) {
            var message = EncodedMessage.FromObject(object);

            var encoded = message.Decode();

            var name = encoded.constructor.name;

            if (this.Handlers[name] == undefined)
                throw new Error(`No handler for object type: ${name}`);

            this.Handlers[name](encoded);
        }
    }
    $Classes.EncodedMessageHandler = EncodedMessageHandler;
    module.exports.EncodedMessageHandler = EncodedMessageHandler;

    class NewsMessage {
        constructor() {

        }

        ToObject() {
            var data = {
                Title: this.Title,
                Body: this.Body,
                Timestamp: this.Timestamp
            };

            return data;
        }

        static FromObject(object) {
            var newsMessage = new this()
                .SetTitle(object.Title)
                .SetBody(object.Body)
                .SetTimestamp(object.Timestamp);

            return newsMessage;
        }

        SetTitle(title) {
            this.Title = title;
            return this;
        }

        SetBody(body) {
            this.Body = body;
            return this;
        }

        SetTimestamp(timestamp) {
            if (typeof(timestamp) == 'object') {
                this.Timestamp = timestamp;
            } else {
                this.Timestamp = new Date(timestamp);
            }
            return this;
        }
    }
    $Classes.NewsMessage = NewsMessage;
    module.exports.NewsMessage = NewsMessage;

    class Alert {
        constructor() {

        }

        ToObject() {
            var data = {
                $_Id: this.$_Id,
                StartTime: this.StartTime,
                EndTime: this.EndTime,
                Text: this.Text,
                Survey: this.Survey ? this.Survey.ToObject() : undefined,
                RedirectUrl: this.RedirectUrl
            };

            return data;
        }

        /**
         * 
         * @param {Alert} object 
         */
        static FromObject(object) {
            var survey = new this()
                .SetId(object.$_Id)
                .SetStartTime(object.StartTime)
                .SetEndTime(object.EndTime)
                .SetText(object.Text)
                .SetSurvey(object.Survey ? Survey.FromObject(object.Survey) : undefined)
                .SetRedirectUrl(object.RedirectUrl);

            return survey;
        }

        SetId(id) {
            this.$_Id = id;
            return this;
        }

        SetStartTime(time) {
            this.StartTime = time;
            return this;
        }

        SetEndTime(time) {
            this.EndTime = time;
            return this;
        }

        SetText(text) {
            this.Text = text;
            return this;
        }

        /**
         * 
         * @param {Survey} survey 
         */
        SetSurvey(survey) {
            this.Survey = survey;
            return this;
        }

        SetRedirectUrl(url) {
            this.RedirectUrl = url;
            return this;
        }

        get AlertIdentifier() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AlertIdentifier', function() {
                return `AlertSurvey${MAIN.$_Id}`;
            });
        }
    }
    $Classes.Alert = Alert;
    module.exports.Alert = Alert;

    class Survey {
        constructor() {
            /** @type {SurveyQuestion[]} */
            this.Questions = [];
        }

        ToObject() {
            var data = {
                $_Id: this.$_Id,
                StartTime: this.StartTime,
                EndTime: this.EndTime,
                AlertPrompt: this.AlertPrompt,
                ModalPrompt: this.ModalPrompt,
                Questions: []
            };

            for (var q = 0; q < this.Questions.length; q++)
            {
                var surveyQuestion = this.Questions[q];
                data.Questions[q] = surveyQuestion.ToObject();
            }

            return data;
        }

        /**
         * 
         * @param {Survey} object 
         */
        static FromObject(object) {
            var survey = new this()
                .SetId(object.$_Id)
                .SetStartTime(object.StartTime)
                .SetEndTime(object.EndTime)
                .SetAlertPrompt(object.AlertPrompt)
                .SetModalPrompt(object.ModalPrompt);

            for (var q = 0; q < object.Questions.length; q++)
            {
                var surveyQuestion = object.Questions[q];
                survey.AddQuestion(SurveyQuestion.FromObject(surveyQuestion));
            }

            return survey;
        }

        SetId(id) {
            this.$_Id = id;
            return this;
        }

        SetStartTime(time) {
            this.StartTime = time;
            return this;
        }

        SetEndTime(time) {
            this.EndTime = time;
            return this;
        }

        SetAlertPrompt(prompt) {
            this.AlertPrompt = prompt;
            return this;
        }

        SetModalPrompt(prompt) {
            this.ModalPrompt = prompt;
            return this;
        }

        /**
         * 
         * @param {SurveyQuestion} question 
         */
        AddQuestion(question) {
            this.Questions.push(question);
            return this;
        }

        get AnyQuestionsRequired() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AnyQuestionsRequired', function() {
                var required = false;
                for (var q = 0; q < MAIN.Questions.length; q++)
                {
                    required = required || !MAIN.Questions[q].AllowEmpty;
                }
                
                return required;
            });
        }
    }
    $Classes.Survey = Survey;
    module.exports.Survey = Survey;

    var SurveyResponseType = {
        FREE_TEXT: 1,
        FREE_TEXT_MULTILINE: 2,
        SELECT_DROPDOWN: 3,
        SELECT_AUTOCOMPLETE: 4,
        RADIO_LIST: 5,
        CHECK_LIST: 6
    }

    class SurveyQuestion {
        constructor() {
            this.Options = [];
        }

        ToObject() {
            var data = {
                QuestionText: this.QuestionText,
                ResponseType: this.ResponseType,
                IncludeOther: this.IncludeOther,
                AllowEmpty: this.AllowEmpty,
                Options: []
            };

            for (var o = 0; o < this.Options.length; o++)
            {
                var surveyQuestionOption = this.Options[o];
                data.Options[o] = surveyQuestionOption.ToObject();
            }

            return data;
        }

        /**
         * 
         * @param {SurveyQuestion} object 
         */
        static FromObject(object) {
            var surveyQuestion = new this()
                .SetQuestionText(object.QuestionText)
                .SetResponseType(object.ResponseType)
                .SetIncludeOther(object.IncludeOther)
                .SetAllowEmpty(object.AllowEmpty);

            for (var o = 0; o < object.Options.length; o++)
            {
                var surveyQuestionOption = object.Options[o];
                surveyQuestion.AddOption(SurveyQuestionOption.FromObject(surveyQuestionOption));
            }

            return surveyQuestion;
        }

        /**
         * 
         * @param {string} text 
         */
        SetQuestionText(text) {
            if (!text.includes('<#prompt>')) {
                text = text.trim();
                text += '<br><#prompt>';
            }
            this.QuestionText = text;
            return this;
        }

        SetResponseType(responseType) {
            this.ResponseType = responseType;
            return this;
        }

        SetIncludeOther(includeOther) {
            this.IncludeOther = includeOther;
            return this;
        }

        SetAllowEmpty(allowEmpty) {
            this.AllowEmpty = allowEmpty;
            return this;
        }

        /**
         * 
         * @param {SurveyQuestionOption} option 
         */
        AddOption(option) {
            this.Options.push(option);
            return this;
        }

        get AllOptions() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'AllOptions', function() {
                var options = [];
                for (var o = 0; o < MAIN.Options.length; o++)
                {
                    options.push(MAIN.Options[o]);
                }

                if (MAIN.IncludeOther) {
                    options.push(new SurveyQuestionOption().SetValue(null).SetDisplayText('Other: '));
                }

                return options;
            });
        }

        get DisplayHtmlPrePrompt() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'DisplayHtmlPrePrompt', function() {
                return MAIN.QuestionText.split('<#prompt>')[0];
            });
        }

        get DisplayHtmlPostPrompt() {
            var MAIN = this;
            return $_CalculateOrLoadProperty(this, 'DisplayHtmlPostPrompt', function() {
                return MAIN.QuestionText.split('<#prompt>')[1];
            });
        }
    }
    $Classes.SurveyQuestion = SurveyQuestion;
    module.exports.SurveyQuestion = SurveyQuestion;

    class SurveyQuestionOption {
        constructor() {

        }

        ToObject() {
            var data = {
                Value: this.Value,
                DisplayText: this.DisplayText
            };

            return data;
        }

        /**
         * 
         * @param {SurveyQuestionOption} object 
         */
        static FromObject(object) {
            var surveyQuestionOption = new this()
                .SetValue(object.Value)
                .SetDisplayText(object.DisplayText);

            return surveyQuestionOption;
        }

        SetValue(value) {
            this.Value = value;
            return this;
        }

        SetDisplayText(text) {
            this.DisplayText = text;
            return this;
        }
    }
    $Classes.SurveyQuestionOption = SurveyQuestionOption;
    module.exports.SurveyQuestionOption = SurveyQuestionOption;

    class AlertCollection {
        constructor() {
            /** @type {Alert[]} */
            this.Alerts = [];
        }

        ToObject() {
            var data = {
                /** @type {Alert[]} */
                Alerts: []
            };

            for (var s = 0; s < this.Alerts.length; s++)
            {
                var alert = this.Alerts[s];
                data.Alerts[s] = alert.ToObject();
            }

            return data;
        }

        /**
         * 
         * @param {AlertCollection} object 
         */
        static FromObject(object) {
            var alertCollection = new this();

            for (var s = 0; s < object.Alerts.length; s++)
            {
                var alert = object.Alerts[s];
                alertCollection.AddAlert(Alert.FromObject(alert));
            }

            return alertCollection;
        }

        /**
         * 
         * @param {function(alert)} callOnEach 
         */
        ForEach(callOnEach) {
            for (var s = 0; s < this.Alerts.length; s++)
            {
                var alert = this.Alerts[s];
                callOnEach(alert);
            }
            return this;
        }

        AddAlert(survey) {
            this.Alerts.push(survey);
            return this;
        }
    }
    $Classes.AlertCollection = AlertCollection;
    module.exports.AlertCollection = AlertCollection;

})(window);