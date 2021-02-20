//Hack to let 'module' exist in front-end
if (typeof module == 'undefined') {
    module = { exports: {} }
}

//Hack to let 'window' exist in back-end
if (typeof window == 'undefined') {
    window = this;
}

if (false) {
    /** @type {import('./classes')} */
    var $Classes;
}

(function(window) {
    var $AngularClasses = {};
    window.$AngularClasses = $AngularClasses;

    class NewsController {
        /**
         * 
         * @param {*} $http 
         * @param {AjaxLoaderService} $AjaxLoader 
         * @param {IndexService} $Index 
         */
        constructor($http, $AjaxLoader, $Index) {
            this.$http = $http;
            this.$AjaxLoader = $AjaxLoader;
            this.$Index = $Index;

            /** @type {import('./classes').NewsMessage[]} */
            this.News = null;
        }

        $onInit() {
            const MAIN = this;

            var ajaxIdentifierNews = 'news';
            MAIN.$AjaxLoader.StartWaiting(ajaxIdentifierNews);
            MAIN.$http.get('/data/news').then(function(response) {
                var data = response.data;
                MAIN.News = MAIN.$Index.AddNews(data);

                MAIN.$AjaxLoader.FinishWaiting(ajaxIdentifierNews);
            });
        }
    }
    NewsController.$inject = [ '$http', '$AjaxLoader', '$Index' ];
    $AngularClasses.NewsController = NewsController;
    module.exports.NewsController = NewsController;

    class SurveyController {
        /**
         * 
         * @param {*} $http 
         * @param {AjaxLoaderService} $AjaxLoader 
         */
        constructor($http, $AjaxLoader) {
            this.$http = $http;
            this.$AjaxLoader = $AjaxLoader;

            /** @type {import('../generic/alerts')} */
            this.$Alerts = window.$Alerts;

            /** @type {import('./classes').Alert[]} */
            this.Alerts = [];
        }

        $onInit() {
            const MAIN = this;

            var ajaxIdentifierSurveys = 'surveys';
            MAIN.$AjaxLoader.StartWaiting(ajaxIdentifierSurveys);
            MAIN.$http.get('/data/alerts').then(function(response) {
                var data = response.data;
                MAIN.AddAlerts(data);

                MAIN.$AjaxLoader.FinishWaiting(ajaxIdentifierSurveys);
            });
        }

        AddAlerts(data) {
            const MAIN = this;

            var alertCollection = $Classes.AlertCollection.FromObject(data);
            alertCollection.ForEach(function(survey) {
                MAIN.Alerts.push(survey);
            });
        }

        SubmitSurveyForm() {
            const MAIN = this;

            if (!MAIN.$_validateFormData(MAIN.Alerts[0]))
                return;

            var formData = $('#SurveyForm').serialize();
            formData = formData || '';
            formData += `${formData != '' ? '&' : ''}id=${MAIN.Alerts[0].$_Id}&count=${MAIN.Alerts[0].Survey.Questions.length}`;

            $.ajax({
                url: '/api/survey',
                type: 'post',
                data: formData,
                success: function() { }
            });

            MAIN.CloseAlert('AlertSurvey', MAIN.OldestNonHiddenAlert.AlertIdentifier);
            $('#ModalSurvey').modal('hide');
        };

        ShowSurvey() {
            if (this.OldestNonHiddenAlert.Survey) {
                $('#ModalSurvey').modal('show');
            }
            return this;
        };

        CloseModal(id) {
            $(`#${id}`).modal('hide');
            return this;
        }

        CloseAlert(id, identifier) {
            $(`#${id}`).alert('close');
            this.$Alerts.SetHidden(identifier);
            return this;
        }

        Redirect(url) {
            window.location.href = url;
        }

        /**
         * 
         * @param {import('./classes').Alert} alert 
         */
        $_validateFormData(alert) {
            var formData = $('#SurveyForm').serialize();

            var missing = [];
            
            for (var q = 0; q < alert.Survey.Questions.length; q++)
            {
                var question = alert.Survey.Questions[q];
                if (!question.AllowEmpty && !formData.includes(`q${q+1}`)) {
                    missing.push(`q${q+1}`);
                    question.ErrorMessage = 'Required question!';
                } else {
                    delete question.ErrorMessage;
                }
            }

            if (missing.length == 0)
                return true;

            return false;
        }

        /**
         * @returns {import('./classes').Alert}
         */
        get OldestNonHiddenAlert() {
            const MAIN = this;

            if (!MAIN.Alerts || MAIN.Alerts.length == 0)
                return null;

            return $Classes.$_CalculateOrLoadProperty(this, 'OldestNonHiddenAlert', function() {
                for (var s = 0; s < MAIN.Alerts.length; s++)
                {
                    var alert = MAIN.Alerts[s];
                    if (!MAIN.$Alerts.GetHidden(alert.AlertIdentifier)) {
                        return alert;
                    }
                }

                return null;
            });

            console.log(alert);

            return alert;
        }
    }
    SurveyController.$inject = [ '$http', '$AjaxLoader' ];
    $AngularClasses.SurveyController = SurveyController;
    module.exports.SurveyController = SurveyController;

    class AjaxLoader {
        constructor() {
            this.Config = new AjaxLoader_Config(function() {
                throw new Error('$AjaxLoader must be configured with a callback!');
            });
        }

        $get() {
            return new AjaxLoaderService(this.Config);
        }
    }
    $AngularClasses.AjaxLoader = AjaxLoader;
    module.exports.AjaxLoader = AjaxLoader;

    class AjaxLoaderService {
        /**
         * 
         * @param {AjaxLoader_Config} config 
         */
        constructor(config) {
            this.Config = config;
            this.Waiting = {};
        }

        StartWaiting(identifier, checkUnique = true) {
            const MAIN = this;

            if (MAIN.Waiting[identifier] != undefined)
            {
                if (checkUnique)
                    throw new Error('$AjaxLoader identifier is not unique!');
                else
                    return false;
            }

            MAIN.Waiting[identifier] = 1;
            return true;
        }

        FinishWaiting(identifier, data) {
            const MAIN = this;

            if (MAIN.Waiting[identifier] == undefined)
                throw new Error('$AjaxLoader identifier cannot be found!');

            MAIN.Waiting[identifier] = 0;

            if (Math.max(...AjaxLoaderService.$_values(MAIN.Waiting)) == 0)
            {
                MAIN.Config.Callback(data);
            }
        }

        static $_values(object) {
            var output = [];

            var keys = Object.keys(object);
            for (var k = 0; k < keys.length; k++)
            {
                output.push(object[keys[k]]);
            }

            return output;
        }
    }
    $AngularClasses.AjaxLoaderService = AjaxLoaderService;
    module.exports.AjaxLoaderService = AjaxLoaderService;

    class AjaxLoader_Config {
        /**
         * 
         * @param {function(data) => void} callback 
         */
        constructor(callback) {
            this.Callback = callback;
        }
    }
    $AngularClasses.AjaxLoader_Config = AjaxLoader_Config;
    module.exports.AjaxLoader_Config = AjaxLoader_Config;

    class AjaxLoader_Config_Index {
        /**
         * 
         * @param {AjaxLoader} AjaxLoader 
         */
        constructor(AjaxLoader) {
            AjaxLoader.Config.Callback = function(data) {
                $('body').removeClass('loading-data');
            };
        }
    }
    AjaxLoader_Config_Index.$inject = [ '$AjaxLoaderProvider' ];
    $AngularClasses.AjaxLoader_Config_Index = AjaxLoader_Config_Index;
    module.exports.AjaxLoader_Config_Index = AjaxLoader_Config_Index;

    class AjaxLoader_Config_Arsenal {
        /**
         * 
         * @param {AjaxLoader} AjaxLoader 
         */
        constructor(AjaxLoader) {
            AjaxLoader.Config.Callback = function(data) {
                $('body').removeClass('loading-data');
            };
        }
    }
    AjaxLoader_Config_Arsenal.$inject = [ '$AjaxLoaderProvider' ];
    $AngularClasses.AjaxLoader_Config_Arsenal = AjaxLoader_Config_Arsenal;
    module.exports.AjaxLoader_Config_Arsenal = AjaxLoader_Config_Arsenal;

    class AjaxLoader_Config_Simulator {
        /**
         * 
         * @param {AjaxLoader} AjaxLoader 
         */
        constructor(AjaxLoader) {
            AjaxLoader.Config.Callback = function(data) {
                $('body').removeClass('loading-data');

                data.$Simulator.FinalizeLoading();
            };
        }
    }
    AjaxLoader_Config_Simulator.$inject = [ '$AjaxLoaderProvider' ];
    $AngularClasses.AjaxLoader_Config_Simulator = AjaxLoader_Config_Simulator;
    module.exports.AjaxLoader_Config_Simulator = AjaxLoader_Config_Simulator;

    class Index {
        constructor() {
            this.config = {};
        }
        
        $get() {
            return new IndexService(this.config);
        }
    }
    $AngularClasses.Index = Index;
    module.exports.Index = Index;

    class IndexService {
        constructor(config) {
            /** @type {import('./classes').NewsMessage[]} */
            this.News = [];

            /** @type {import('./classes').Survey[]} */
            this.Surveys = [];
        }

        AddNews(data) {
            const MAIN = this;

            var keys = Object.keys(data);

            for (var k = 0; k < keys.length; k++)
            {
                var json = data[keys[k]];
                var news = new $Classes.NewsMessage()
                    .SetTitle(json.Title)
                    .SetBody(json.Body)
                    .SetTimestamp(json.Timestamp);

                MAIN.News.push(news);
            }

            return MAIN.News;
        }
    }
    $AngularClasses.IndexService = IndexService;
    module.exports.IndexService = IndexService;

    function $MultiLineFilter() {
        return function(text) {
            if (text !== undefined)
                return text.replace(/\r\n/g, '\n').replace(/\n/g, '<br>');
        }
    }
    $AngularClasses.$MultiLineFilter = $MultiLineFilter;
    module.exports.$MultiLineFilter = $MultiLineFilter;

    class Arsenal {
        constructor() {
            this.config = {};
        }
        
        $get() {
            return new ArsenalService(this.config);
        }
    }
    $AngularClasses.Arsenal = Arsenal;
    module.exports.Arsenal = Arsenal;

    class ArsenalService {
        constructor(config) {
            /** @type {import('./classes').Weapon[]} */
            this.Weapons = [];
        }

        AddWeapons(data) {
            var keys = Object.keys(data);

            for (var k = 0; k < keys.length; k++)
            {
                var json = data[keys[k]];
                var weapon = new $Classes.Weapon()
                    .SetName(json.Name)
                    .SetImage(json.Image)
                    .SetMastery(json.Mastery)
                    .SetModTypes(json.ModTypes)
                    .SetMagazineSize(json.BaseMagazineSize)
                    .SetMaximumAmmo(json.BaseMaximumAmmo)
                    .SetReloadDuration(json.BaseReloadDuration)
                    .SetAdditionalSettingsHtml(json.AdditionalSettingsHtml);

                var fkeys = Object.keys(json.FiringModes);
                for (var f = 0; f < fkeys.length; f++)
                {
                    var fjson = json.FiringModes[fkeys[f]];
                    /**
                     * @type {import('./classes').WeaponFiringMode}
                     */
                    var firingMode = new $Classes.WeaponFiringMode()
                        .SetName(fjson.Name)
                        .SetDamageImpact(fjson.OriginalBaseDamage[$Classes.DamageType.IMPACT])
                        .SetDamagePuncture(fjson.OriginalBaseDamage[$Classes.DamageType.PUNCTURE])
                        .SetDamageSlash(fjson.OriginalBaseDamage[$Classes.DamageType.SLASH])
                        .SetDamageCold(fjson.OriginalBaseDamage[$Classes.DamageType.COLD])
                        .SetDamageElectric(fjson.OriginalBaseDamage[$Classes.DamageType.ELECTRIC])
                        .SetDamageHeat(fjson.OriginalBaseDamage[$Classes.DamageType.HEAT])
                        .SetDamageToxin(fjson.OriginalBaseDamage[$Classes.DamageType.TOXIN])
                        .SetDamageBlast(fjson.OriginalBaseDamage[$Classes.DamageType.BLAST])
                        .SetDamageCorrosive(fjson.OriginalBaseDamage[$Classes.DamageType.CORROSIVE])
                        .SetDamageGas(fjson.OriginalBaseDamage[$Classes.DamageType.GAS])
                        .SetDamageMagnetic(fjson.OriginalBaseDamage[$Classes.DamageType.MAGNETIC])
                        .SetDamageRadiation(fjson.OriginalBaseDamage[$Classes.DamageType.RADIATION])
                        .SetDamageViral(fjson.OriginalBaseDamage[$Classes.DamageType.VIRAL])
                        .SetPellets(fjson.Pellets)
                        .SetFireRate(fjson.FireRate)
                        .SetCriticalChance(fjson.CriticalChance)
                        .SetCriticalMultiplier(fjson.CriticalMultiplier)
                        .SetStatusChance(fjson.StatusChance)
                        .SetAmmoConsumption(fjson.AmmoConsumption)
                        .SetIsBeam(fjson.IsBeam);

                    var rkeys = Object.keys(json.FiringModes[fkeys[f]].Residuals);
                    for (var r = 0; r < rkeys.length; r++)
                    {
                        var rjson = json.FiringModes[fkeys[f]].Residuals[rkeys[r]];
                        /**
                         * @type {import('./classes').WeaponFiringModeResidual}
                         */
                        var firingModeResidual = new $Classes.WeaponFiringModeResidual()
                            .SetDamageImpact(rjson.OriginalBaseDamage[$Classes.DamageType.IMPACT])
                            .SetDamagePuncture(rjson.OriginalBaseDamage[$Classes.DamageType.PUNCTURE])
                            .SetDamageSlash(rjson.OriginalBaseDamage[$Classes.DamageType.SLASH])
                            .SetDamageCold(rjson.OriginalBaseDamage[$Classes.DamageType.COLD])
                            .SetDamageElectric(rjson.OriginalBaseDamage[$Classes.DamageType.ELECTRIC])
                            .SetDamageHeat(rjson.OriginalBaseDamage[$Classes.DamageType.HEAT])
                            .SetDamageToxin(rjson.OriginalBaseDamage[$Classes.DamageType.TOXIN])
                            .SetDamageBlast(rjson.OriginalBaseDamage[$Classes.DamageType.BLAST])
                            .SetDamageCorrosive(rjson.OriginalBaseDamage[$Classes.DamageType.CORROSIVE])
                            .SetDamageGas(rjson.OriginalBaseDamage[$Classes.DamageType.GAS])
                            .SetDamageMagnetic(rjson.OriginalBaseDamage[$Classes.DamageType.MAGNETIC])
                            .SetDamageRadiation(rjson.OriginalBaseDamage[$Classes.DamageType.RADIATION])
                            .SetDamageViral(rjson.OriginalBaseDamage[$Classes.DamageType.VIRAL])
                            .SetPellets(rjson.Pellets)
                            .SetDuration(rjson.Duration)
                            .SetOverrideCriticalChance(rjson.OverrideCriticalChance)
                            .SetOverrideCriticalMultiplier(rjson.OverrideCriticalMultiplier)
                            .SetOverrideStatusChance(rjson.OverrideStatusChance);

                        firingMode.AddResidual(firingModeResidual);
                    }

                    weapon.AddFiringMode(firingMode);
                }

                weapon.SetFiringMode(0);

                //Weapons = []; //remove
                this.Weapons.push(weapon);
            }
        }
    }
    $AngularClasses.ArsenalService = ArsenalService;
    module.exports.ArsenalService = ArsenalService;

    class TabsController {
        constructor($scope, $http, $AjaxLoader, $Simulator) {
            this.$scope = $scope;
            this.$http = $http;
            this.$AjaxLoader = $AjaxLoader;
            this.$Simulator = $Simulator;

            this.ActiveTab = 'Modding';

            this.console = console;
        }

        SetTab(tab) {
            this.ActiveTab = tab;
        }
    }
    TabsController.$inject = [ '$scope', '$http', '$AjaxLoader', '$Simulator' ];
    $AngularClasses.TabsController = TabsController;
    module.exports.TabsController = TabsController;

    class WeaponsController {
        /**
         * 
         * @param {*} $scope 
         * @param {*} $http 
         * @param {AjaxLoaderService} $AjaxLoader 
         * @param {SimulatorService} $Simulator 
         */
        constructor($scope, $http, $AjaxLoader, $Simulator) {
            this.$scope = $scope;
            this.$http = $http;
            this.$AjaxLoader = $AjaxLoader;
            this.$Simulator = $Simulator;
            this.$Simulator.$scope = $scope;
            this.$Simulator.SetupOnHistoryChange();

            this.WeaponTableSortType = 'Name';
            this.WeaponTableSortReverse = false;

            var MAIN = this;

            //Note: remove this later; intended to preserve original function alongside controller-as syntax
            Object.defineProperty($scope, 'ActiveWeapon', { get: function() { console.log('fetching active weapon', $Simulator.ActiveWeapon); return $Simulator.ActiveWeapon; } });
            $scope.HandleAdditionalSettingsVariable = (variableName, value) => { this.$Simulator.HandleAdditionalSettingsVariable(variableName, value) };
            Object.defineProperty($scope, 'KuvaElement', { get: function() { return MAIN.KuvaElement; }, set: function(value) { MAIN.KuvaElement = value; } });
            Object.defineProperty($scope, '_KuvaElement', { get: function() { return MAIN._KuvaElement; }, set: function(value) { MAIN._KuvaElement = value; } });
            Object.defineProperty($scope, 'KuvaBonus', { get: function() { return MAIN.KuvaBonus; }, set: function(value) { MAIN.KuvaBonus = value; } });
            Object.defineProperty($scope, '_KuvaBonus', { get: function() { return MAIN._KuvaBonus; }, set: function(value) { MAIN._KuvaBonus = value; } });
        }

        $onInit() {
            const MAIN = this;

            var ajaxIdentifierWeapons = 'weapons';
            MAIN.$AjaxLoader.StartWaiting(ajaxIdentifierWeapons);
            MAIN.$http.get('/data/weapons').then(function(response) {
                var data = response.data;
                MAIN.$Simulator.AddWeapons(data);
                MAIN.Weapons = MAIN.$Simulator.Weapons;

                MAIN.$AjaxLoader.FinishWaiting(ajaxIdentifierWeapons, { $Simulator: MAIN.$Simulator });
            });
        }

        SetWeaponObject(object, ignoreHistory = false) {
            this.$Simulator.SetWeaponObject(object, ignoreHistory);
        };

        get ActiveWeapon() {
            return this.$Simulator.ActiveWeapon;
        }

        get SelectedFiringMode() {
            return this.$Simulator.SelectedFiringMode;
        }

        set SelectedFiringMode(value) {
            this.$Simulator.SetFiringModeString(value);
        }

        get KuvaElement() {
            return this.$Simulator.AdditionalSettingsVariables.KuvaElement;
        }

        set KuvaElement(value) {
            this.$Simulator.AdditionalSettingsVariables.KuvaElement = value;
        }

        get _KuvaElement() {
            return this.$Simulator.AdditionalSettingsVariables._KuvaElement;
        }

        set _KuvaElement(value) {
            this.$Simulator.AdditionalSettingsVariables._KuvaElement = value;
        }

        get KuvaBonus() {
            return this.$Simulator.AdditionalSettingsVariables.KuvaBonus;
        }

        set KuvaBonus(value) {
            this.$Simulator.AdditionalSettingsVariables.KuvaBonus = value;
        }

        get _KuvaBonus() {
            return this.$Simulator.AdditionalSettingsVariables._KuvaBonus;
        }

        set _KuvaBonus(value) {
            this.$Simulator.AdditionalSettingsVariables._KuvaBonus = value;
        }

        DoAdditionalSettingsVariableUrlUpdate(line) {
            this.$Simulator.DoUrlUpdate(line);
        }

        HandleAdditionalSettingsVariable(variableName, value) {
            this.$Simulator.HandleAdditionalSettingsVariable(variableName, value);
        }

        PrepareWeapon() {
            var modal = $('#ModalWeaponSelect');
            modal.modal('show');
        }

        /**
         * 
         * @param {import('./classes').Weapon} weapon 
         */
        RedirectToSimulator(weapon) {
            console.log('Redirecting...');
            window.location.href = `/simulator/${weapon.UrlName}`
        }
    }
    WeaponsController.$inject = [ '$scope', '$http', '$AjaxLoader', '$Simulator' ];
    $AngularClasses.WeaponsController = WeaponsController;
    module.exports.WeaponsController = WeaponsController;

    class ArsenalWeaponsController {
        /**
         * 
         * @param {*} $scope 
         * @param {*} $http 
         * @param {AjaxLoaderService} $AjaxLoader 
         * @param {SimulatorService} $Arsenal 
         */
        constructor($scope, $http, $AjaxLoader, $Arsenal) {
            this.$scope = $scope;
            this.$http = $http;
            this.$AjaxLoader = $AjaxLoader;
            this.$Arsenal = $Arsenal;
        }

        $onInit() {
            const MAIN = this;

            var ajaxIdentifierWeapons = 'weapons';
            MAIN.$AjaxLoader.StartWaiting(ajaxIdentifierWeapons);
            MAIN.$http.get('/data/weapons').then(function(response) {
                var data = response.data;
                MAIN.$Arsenal.AddWeapons(data);

                MAIN.$AjaxLoader.FinishWaiting(ajaxIdentifierWeapons);
            });
        }

        get Weapons() {
            return this.$Arsenal.Weapons;
        }
    }
    ArsenalWeaponsController.$inject = [ '$scope', '$http', '$AjaxLoader', '$Arsenal' ];
    $AngularClasses.ArsenalWeaponsController = ArsenalWeaponsController;
    module.exports.ArsenalWeaponsController = ArsenalWeaponsController;

    class ModsController {
        /**
         * 
         * @param {*} $scope 
         * @param {*} $http 
         * @param {AjaxLoaderService} $AjaxLoader 
         * @param {SimulatorService} $Simulator 
         */
        constructor($scope, $http, $AjaxLoader, $Simulator) {
            this.$scope = $scope;
            this.$http = $http;
            this.$AjaxLoader = $AjaxLoader;
            this.$Simulator = $Simulator;

            this.$Alerts = window.$Alerts;

            this.ModRarityFilter = -1;
            this.ModPolarityFilter = -1;
        }

        $onInit() {
            const MAIN = this;

            var ajaxIdentifierMods = 'mods';
            MAIN.$AjaxLoader.StartWaiting(ajaxIdentifierMods);
            MAIN.$http.get('/data/mods').then(function(response) {
                var data = response.data;
                var notableMods = MAIN.$Simulator.AddMods(data);            
                MAIN.Mods = MAIN.$Simulator.Mods;
                MAIN.$Simulator.Riven = notableMods.Riven;

                MAIN.$AjaxLoader.FinishWaiting(ajaxIdentifierMods, { $Simulator: MAIN.$Simulator });
            });

            var ajaxIdentifierModEffects = 'mod-effects'
            MAIN.$AjaxLoader.StartWaiting(ajaxIdentifierModEffects)
            MAIN.$http.get('/data/mod-effects').then(function(response) {
                var data = response.data;
                MAIN.$Simulator.ModEffectDescriptions = data;

                MAIN.$AjaxLoader.FinishWaiting(ajaxIdentifierModEffects, { $Simulator: MAIN.$Simulator });
            });
        }

        get ActiveWeapon() {
            return this.$Simulator.ActiveWeapon;
        }

        get FilteredMods() {
            return this.$Simulator.FilteredMods;
        }

        get ModEffects() {
            return this.$Simulator.ModEffects;
        }

        get Riven() {
            return this.$Simulator.Riven;
        }

        get RivenModEffects() {
            return this.$Simulator.RivenModEffects;
        }

        get RivenModEffectPower() {
            return this.$Simulator.RivenModEffectPower;
        }

        EditRiven() {
            $('#ModalRivenEdit').modal('show');
        }

        PrepareMod(position) {
            this.$Simulator.ActiveModSelection = position;

            var modal = $('#ModalModSelect');
            modal.find('.modal-title').text('Selecting Mod ' + (this.$Simulator.ActiveModSelection + 1));

            modal.modal('show');
        }

        SetModObject(object, position, ignoreHistory) {
            this.$Simulator.SetModObject(object, position, ignoreHistory);
        }

        /**
         * 
         * @param {import('./classes').Mod} mod 
         * @param {number} rank 
         */
        SetModRank(mod, rank) {
            mod.SetRank(rank);
            this.$Simulator.DoHistoryUpdate(734);
        }
        
        UpdateRivenModEffects() {
            this.$Simulator.UpdateRivenModEffects();
        }
    }
    ModsController.$inject = [ '$scope', '$http', '$AjaxLoader', '$Simulator' ];
    $AngularClasses.ModsController = ModsController;
    module.exports.ModsController = ModsController;

    class EnemyController {
        /**
         * 
         * @param {*} $scope 
         * @param {*} $http 
         * @param {AjaxLoaderService} $AjaxLoader 
         * @param {SimulatorService} $Simulator 
         */
        constructor($scope, $http, $AjaxLoader, $Simulator) {
            this.$_Id = Math.floor(Math.random() * 1000);

            this.$scope = $scope;
            this.$http = $http;
            this.$AjaxLoader = $AjaxLoader;
            this.$Simulator = $Simulator;

            this.console = console;
            this.$Alerts = window.$Alerts;

            this.ActiveEnemyPosition = this.$Simulator.GetActiveEnemyPosition();
            this.console = console;

            this.EnemyTableSortType = 'Name';
            this.EnemyTableSortReverse = false;

            this.Level = 100;
        }

        $onInit() {
            const MAIN = this;

            var ajaxIdentifierEnemies = 'enemies';
            var unique = MAIN.$AjaxLoader.StartWaiting(ajaxIdentifierEnemies, false);

            if (unique) {
                MAIN.$http.get('/data/enemies').then(function(response) {
                    MAIN.$Simulator.AddEnemies(response.data);
                    MAIN.$_finalize();
                    MAIN.$Simulator.FinishAwaitingEnemies();
                    MAIN.$AjaxLoader.FinishWaiting(ajaxIdentifierEnemies, { $Simulator: MAIN.$Simulator });
                });
            } else {
                MAIN.$Simulator.AwaitEnemies(MAIN);
            }
        }

        GetActiveEnemy(position) {
            return this.$Simulator.ActiveEnemy[position];
        }

        SetAlertHidden(identifier) {
            this.$Alerts.SetHidden(identifier);
        }

        SetEnemyObject(object, position, ignoreHistory) {
            this.$Simulator.SetEnemyObject(object, position, ignoreHistory);
        }

        get ActiveEnemy() {
            return this.$Simulator.ActiveEnemy[this.ActiveEnemyPosition];
        }

        DoLevelUrlUpdate(line) {
            this.$Simulator.DoUrlUpdate(line);
        }

        PrepareEnemy(modalNumber) {
            var modal = $('#ModalEnemySelect' + modalNumber);
            modal.modal('show');
        }

        $_finalize() {
            this.Enemies = this.$Simulator.Enemies;
        }
    }
    EnemyController.$inject = [ '$scope', '$http', '$AjaxLoader', '$Simulator' ];
    $AngularClasses.EnemyController = EnemyController;
    module.exports.EnemyController = EnemyController;

    class SimulationController {
        /**
         * 
         * @param {*} $scope 
         * @param {*} $http 
         * @param {AjaxLoaderService} $AjaxLoader 
         * @param {SimulatorService} $Simulator 
         */
        constructor($scope, $http, $AjaxLoader, $Simulator) {
            this.$scope = $scope;
            this.$http = $http;
            this.$AjaxLoader = $AjaxLoader;
            this.$Simulator = $Simulator;

            this.ActiveSimTab = 'Enemy';
            this.ActiveEnemyTab = 'Enemy1';

            this.SimulationTypeDesc = {
                Random: 'Simulations will be entirely random. No two runs are likely to have the same results.',
                Normalized: 'Identical simulations will always have the same results.',
                Ranked: 'Results are constant and will be stored for comparison against other weapons. Note that enemies and simulation-level settings cannot be changed for ranked simulations. Any reverted changes will be highlighted below.'
            }
        }

        GetElement(event) {
            return angular.element(event.srcElement || event.target);
        }

        get Accuracy() {
            return this.$Simulator.Accuracy;
        }

        set Accuracy(value) {
            this.$Simulator.Accuracy = value;
        }

        get ActiveWeapon() {
            return this.$Simulator.ActiveWeapon;
        }

        get ActiveEnemy1() {
            return this.$Simulator.ActiveEnemy[0];
        }

        get ActiveEnemy2() {
            return this.$Simulator.ActiveEnemy[1];
        }

        get ActiveEnemy3() {
            return this.$Simulator.ActiveEnemy[2];
        }

        get ActiveEnemy4() {
            return this.$Simulator.ActiveEnemy[3];
        }

        get HasSimulationData() {
            return this.$Simulator.HasSimulationData;
        }

        get Headshot() {
            return this.$Simulator.Headshot;
        }

        set Headshot(value) {
            this.$Simulator.Headshot = value;
        }

        get SimulationData() {
            return this.$Simulator.SimulationData;
        }

        get SimulationError() {
            return this.$Simulator.SimulationError;
        }

        get SimulationName() {
            return this.$Simulator.SimulationName;
        }

        get SimulationProgress() {
            return this.$Simulator.SimulationProgress;
        }

        get SimulationType() {
            return this.$Simulator.SimulationType;
        }

        set SimulationType(value) {
            this.$Simulator.SimulationType = value;
        }

        FindCircleParent(element) {
            var elementAlt = element;
            while (elementAlt.classList == undefined || elementAlt.classList.contains('circle') == false) {
                elementAlt = elementAlt.parentElement;
            }
            
            return elementAlt;
        }

        FindSubElement(element, search) {
            return $(element).find(search);
        }

        HideIconName(element) {
            var altElement = this.FindSubElement(element, 'span.alt');
            altElement.addClass('hidden');

            var svgElement = this.FindSubElement(element, 'svg');
            svgElement.removeClass('hidden');
        }

        /**
         * @deprecated
         * @param {*} $event 
         * @param {*} specifier 
         * @param {*} callback 
         */
        Hover($event, specifier, callback) {
            console.log('hover!');

            var element = this.GetElement($event)[0];
            element = specifier(element);
            callback(element);
        }

        OnSubBubbleMouseEnter($event) {
            var element = this.GetElement($event)[0];
            element = this.FindCircleParent(element);
            this.ShowIconName(element);
        }

        OnSubBubbleMouseLeave($event) {
            var element = this.GetElement($event)[0];
            element = this.FindCircleParent(element);
            this.HideIconName(element);
        }

        async RunSimulation () {
            this.$Simulator.ClearSimulationData();

            var data = new $Classes.SimulationRequest()
                .SetWeapon(this.$Simulator.ActiveWeapon)
                .SetEnemy(0, this.$Simulator.ActiveEnemy[0])
                .SetEnemy(1, this.$Simulator.ActiveEnemy[1])
                .SetEnemy(2, this.$Simulator.ActiveEnemy[2])
                .SetEnemy(3, this.$Simulator.ActiveEnemy[3])
                .SetSettings(this.$Simulator.SimulationType, parseInt(this.$Simulator.Accuracy.replace('%', '')) / 100, parseInt(this.$Simulator.Headshot.replace('%', '')) / 100)
                .SetAdditionalSettingsVariables(this.$Simulator.ValidAdditionalSettingsVariables);

            console.log('Simulating...', data);

            var message = new $Classes.EncodedMessage()
                .Encode(data)
                .ToString();
            
            var socket = await this.$Simulator.Socket;
            console.log(socket);
            socket.send(message);
        }

        ShowIconName(element) {
            var altElement = this.FindSubElement(element, 'span.alt');
            altElement.removeClass('hidden');

            var svgElement = this.FindSubElement(element, 'svg');
            svgElement.addClass('hidden');
        }

        $apply(wrapper) {
            this.$scope.$apply(wrapper);
        }
    }
    SimulationController.$inject = [ '$scope', '$http', '$AjaxLoader', '$Simulator' ];
    $AngularClasses.SimulationController = SimulationController;
    module.exports.SimulationController = SimulationController;

    class Simulator {
        constructor() {
            this.config = {};
        }

        $get() {
            return new SimulatorService(this.config);
        }
    }
    $AngularClasses.Simulator = Simulator;
    module.exports.Simulator = Simulator;

    class SimulatorService {
        constructor(config) {
            this.$scope = undefined;

            /** @type {import('./classes').EncodedMessageHandler} */
            this.MessageHandler = new $Classes.EncodedMessageHandler()
                .CreateHandle($Classes.SimulationProgress.name, (content) => { this.$_receiveSimulationProgress(content); })
                .CreateHandle($Classes.Metrics.name, (content) => { this.$_receiveSimulationResults(content); })
                .CreateHandle($Classes.SimulationError.name, (content) => { this.$_receiveSimulationError(content); })
                ;

            /** @type {WebSocket} */
            this.$_Socket = null;
            this.$_SocketEnabled = false;

            this.UrlPrefix = '/simulator';

            /** @type {import('./classes').Weapon[]} */
            this.Weapons = [];
            /** @type {import('./classes').Mod[]} */
            this.Mods = [];
            /** @type {import('./classes').Mod[]} */
            this.FilteredMods = [];
            /** @type {import('./classes').Enemy[]} */
            this.Enemies = [];
            
            this.$_AwaitingEnemies = [];

            this.ActiveEnemy = [];

            this.ModEffectDescriptions = undefined;

            /** @type {import('./classes').Mod} */
            this.Riven = undefined;

            this.RivenModEffects = [];
            this.RivenModEffectPower = [];

            this.SimulationType = 'Random';
            this.SimulationData = {};
            this.SimulationName = {};
            this.SimulationError = {};

            this.Accuracy = '90%';
            this.Headshot = '50%';

            this.HasSimulationData = false;
            this.SimulationProgress = 1;

            this.AdditionalSettingsVariables = {};
            this.AdditionalSettingsVariables.KuvaElement = $Classes.DamageType.IMPACT;
            this.AdditionalSettingsVariables._KuvaElement = $Classes.DamageTypeName[this.AdditionalSettingsVariables.KuvaElement].toUpperCase();
            this.AdditionalSettingsVariables._KuvaBonus = 0;

            this.$_ActiveEnemyPosition = 0;

            this.InitialState = this.ReadState();
        }

        GetActiveEnemyPosition() {
            return this.$_ActiveEnemyPosition++;
        }

        /**
         * 
         * @param {string} variableName 
         */
        GetAdditionalSettingsVariableIsValid(variableName) {
            if (variableName.substr(0, 1) == '_')
                return false;

            if (variableName.toLowerCase().includes('kuva')) {
                if ((this.AdditionalSettingsVariables.KuvaElement || 0) > 0 && (this.AdditionalSettingsVariables.KuvaBonus || 0) > 0) {
                    return true;
                }
                
                return false;
            }

            return true;
        }

        GetState() {
            var state = {
                Weapon: this.ActiveWeapon.UrlName,
                Mods: [null, null, null, null, null, null, null, null],
                Enemies: []
            };

            for (var m = 0; m < this.ActiveWeapon.Mods.length; m++)
            {
                var mod = this.ActiveWeapon.Mods[m];
                if (mod != undefined)
                {
                    state.Mods[m] = mod.UrlName;
                }
                else
                {
                    state.Mods[m] = null;
                }
            }

            for (var e = 0; e < this.ActiveEnemy.length; e++)
            {
                var enemy = this.ActiveEnemy[e];
                if (enemy != undefined)
                {
                    state.Enemies[e] = { UrlName: enemy.UrlName, Level: enemy.Level };
                }
                else
                {
                    state.Enemies[e] = null;
                }
            }

            return state;
        }

        SetEnemyObject(object, position, ignoreHistory = false) {
            var oldLevel = 100;
            if (this.ActiveEnemy[position] != undefined) {
                oldLevel = this.ActiveEnemy[position].Level;
            }
            this.ActiveEnemy[position] = $Classes.Enemy.FromObject(object.ToObject());
            this.ActiveEnemy[position].SetLevel(oldLevel);

            $('#ModalEnemySelect0').modal('hide');
            $('#ModalEnemySelect1').modal('hide');
            $('#ModalEnemySelect2').modal('hide');
            $('#ModalEnemySelect3').modal('hide');

            if (!ignoreHistory)
                this.DoHistoryUpdate(531);
        }

        SetEnemyString(string, position, ignoreHistory = false) {
            for (var e = 0; e < this.Enemies.length; e++)
            {
                var enemy = this.Enemies[e];
                if (enemy.UrlName == string)
                {
                    return this.SetEnemyObject(enemy, position, ignoreHistory);
                    break;
                }
            }
        }

        SetFiringModeIndex(index, ignoreHistory = false) {
            this.ActiveWeapon.SetFiringMode(index);
            this.SelectedFiringMode = this.ActiveWeapon.FiringMode.UrlName;

            if (!ignoreHistory)
                this.DoHistoryUpdate(1156);
        }

        SetFiringModeObject(object, ignoreHistory = false) {
            for (var f = 0; f < this.ActiveWeapon.FiringModes.length; f++)
            {
                var firingMode = this.ActiveWeapon.FiringModes[f];
                if (firingMode.UrlName == object.UrlName)
                {
                    this.SetFiringModeIndex(f, ignoreHistory);
                    break;
                }
            }
        }

        SetFiringModeString(string, ignoreHistory = false) {
            for (var f = 0; f < this.ActiveWeapon.FiringModes.length; f++)
            {
                var firingMode = this.ActiveWeapon.FiringModes[f];
                if (firingMode.UrlName == string)
                {
                    this.SetFiringModeIndex(f, ignoreHistory);
                    break;
                }
            }
        }

        SetModObject(object, position = this.ActiveModSelection, ignoreHistory = false) {
            this.ActiveWeapon.SetMod(position, object);
            for (var w = 0; w < this.Weapons.length; w++)
            {
                if (object == null || object.IsCompatible(this.Weapons[w]))
                {
                    this.Weapons[w].SetMod(position, object, true);
                }
            }

            $('#ModalModSelect').modal('hide');

            if (object != null && object.Name.toLowerCase() == 'riven mod' && this.SimulationType == 'Ranked') {
                this.SimulationType = 'Normalized';
            }

            if (!ignoreHistory)
                this.DoHistoryUpdate(424);
        }

        /**
         * 
         * @param {string} string 
         * @param {number} position 
         * @param {boolean} ignoreHistory 
         */
        SetModString(string, position = this.ActiveModSelection, ignoreHistory = false) {
            var actualString = undefined;
            var applyEffects = undefined;

            if (string != null) {
                actualString = string.split('@')[0];
                applyEffects = string.split('@')[1];
            }

            for (var m = 0; m < this.FilteredMods.length; m++)
            {
                var mod = this.FilteredMods[m];
                if (mod.UrlNameClean == actualString)
                {
                    if (applyEffects != undefined) {
                        applyEffects = applyEffects.split('&');

                        for (var a = 0; a < applyEffects.length; a++)
                        {
                            var type = applyEffects[a].substring(0, applyEffects[a].indexOf(':'));
                            var effect = applyEffects[a].substring(applyEffects[a].indexOf(':') + 1, applyEffects[a].length);

                            console.log(type, effect);

                            switch (type) {
                                case ('r'):
                                    var rankNumber = parseInt(effect);
                                    if (!isNaN(rankNumber)) {
                                        mod.SetRank(rankNumber);
                                    }
                                    break;

                                case ('e'):
                                    if (actualString != 'riven-mod')
                                        break;

                                    this.RivenModEffects.length = 0;
                                    this.RivenModEffectPower.length = 0;

                                    var modEffects = effect.split(';');
                                    for (var e = 0; e < modEffects.length; e++)
                                    {
                                        var modEffect = modEffects[e];
                                        var modEffectType = modEffect.split(':')[0];
                                        var modEffectPower = parseFloat(modEffect.split(':')[1]);
                                        
                                        if (isNaN(modEffectType) || isNaN(modEffectPower))
                                            continue;
                                        
                                        if (modEffectType != undefined && modEffectPower != undefined) {
                                            mod.AddEffect(modEffectType, modEffectPower, this.ModEffectDescriptions[modEffectType]);
                                            this.RivenModEffects.push(modEffectType);
                                            this.RivenModEffectPower.push(modEffectPower * 100);
                                        }
                                    }
                                    break;
                            }
                        }
                    } else {
                        mod.SetRank(mod.Ranks);
                    }

                    this.SetModObject(mod, position, ignoreHistory);
                    break;
                }
            }

            if (string == 'empty' || string == null) {
                this.SetModObject(null, position, ignoreHistory);
            }
        }

        SetWeaponObject(object, ignoreHistory = false) {
            //Handle additional settings variables values

            //Reset Kuva bonus for Kuva weapons
            this.AdditionalSettingsVariables.KuvaBonus = 0;
            this.AdditionalSettingsVariables._KuvaBonus = 0;
            this.AdditionalSettingsVariables.KuvaElement = $Classes.DamageType.IMPACT;
            this.AdditionalSettingsVariables._KuvaElement = $Classes.DamageTypeName[this.AdditionalSettingsVariables.KuvaElement].toUpperCase();

            //Handle additional settings variables on the weapon object
            if (this.ActiveWeapon) {
                this.ActiveWeapon.AddRelativeBaseDamage(this.AdditionalSettingsVariables.KuvaElement, this.AdditionalSettingsVariables.KuvaBonus);
            }

            this.ActiveWeapon = object;
            this.SetFiringModeIndex(0, true);

            this.FilteredMods = [];
            for (var m = 0; m < this.Mods.length; m++)
            {
                if (this.Mods[m].IsCompatible(this.ActiveWeapon))
                {
                    this.FilteredMods.push(this.Mods[m]);
                }
            }

            $('#ModalWeaponSelect').modal('hide');

            if (!ignoreHistory)
                this.DoHistoryUpdate(1306);
        }

        SetWeaponString(string, ignoreHistory = false) {
            for (var w = 0; w < this.Weapons.length; w++)
            {
                var weapon = this.Weapons[w];
                if (weapon.UrlName == string)
                {
                    this.SetWeaponObject(weapon, ignoreHistory);
                    break;
                }
            }
        }

        /**
         * @returns {Promise<WebSocket>}
         */
        get Socket() {
            const MAIN = this;

            return new Promise(function(resolve, reject) {
                if (!MAIN.$_SocketEnabled) {
                    if ("WebSocket" in window) {
                        console.log('Opening WebSocket');
        
                        var protocol = location.protocol;
                        var websocketProtocol = protocol.replace('http', 'ws');
        
                        var websocketPort;
                        switch (websocketProtocol) {
                            case ('ws:'):
                                websocketPort = $Websocket.Http;
                                break;
        
                            case ('wss:'):
                                websocketPort = $Websocket.Https;
                                break;
        
                            default:
                                throw new Error('Unrecognized protocol! Unable to connect to WebSocket!');
                        }
        
                        // Let us open a web socket
                        var socket = new WebSocket(`${websocketProtocol}//${location.host.replace(/:\d+/, '')}:${websocketPort}`);
                        MAIN.$_Socket = socket;
                        
                        socket.onopen = function() {
                            MAIN.$_SocketEnabled = true;
                            console.log('WebSocket successfully connected');

                            resolve(socket);
                        };
                        
                        socket.onmessage = function (event) {
                            MAIN.$scope.$apply(function() {
                                MAIN.MessageHandler.DoHandle(JSON.parse(event.data));
                            });
                        };
                        
                        socket.onclose = function() { 
                            // websocket is closed.
                            MAIN.$_SocketEnabled = false;
                        };
                    } else {
                        // The browser doesn't support WebSocket, need to use a URL call
                        console.log('Unable to open WebSocket');

                        reject();
                    }
                } else {
                    resolve(MAIN.$_Socket);
                }
            });
        }

        AddEnemies(data) {
            var keys = Object.keys(data);

            for (var k = 0; k < keys.length; k++)
            {
                var json = data[keys[k]];

                var enemy = new $Classes.Enemy()
                    .SetName(json.Name)
                    .SetBaseLevel(json.BaseLevel)
                    .SetHealthType(json.HealthTypeId)
                    .SetHealth(json.BaseHealth)
                    .SetArmorType(json.ArmorTypeId)
                    .SetArmor(json.BaseArmor)
                    .SetShieldType(json.ShieldTypeId)
                    .SetShield(json.BaseShield)
                    .SetImage(json.Image);

                this.Enemies.push(enemy);
            }
        }

        AddMods(data) {
            var keys = Object.keys(data);

            var notableMods = {};

            for (var k = 0; k < keys.length; k++)
            {
                var json = data[keys[k]];
                var mod = new $Classes.Mod()
                    .SetName(json.Name)
                    .SetImage(json.Image)
                    .SetRarity(json.Rarity)
                    .SetType(json.ModType)
                    .SetDrain(json.MinDrain, json.Ranks);

                var fkeys = Object.keys(json.$_Effects);
                for (var f = 0; f < fkeys.length; f++)
                {
                    mod.AddEffect(fkeys[f], json.$_Effects[fkeys[f]]);
                }

                mod.$_EffectDescriptions = json.$_EffectDescriptions;
                mod.$_EffectRankOverrides = json.$_EffectRankOverrides;

                this.Mods.push(mod);

                if (mod.Name == undefined) {
                    console.log(mod);
                }

                if (mod.Name.toLowerCase().indexOf('riven') > -1) {
                    notableMods.Riven = mod;
                }
            }

            return notableMods;
        }

        AddWeapons(data) {
            var keys = Object.keys(data);

            for (var k = 0; k < keys.length; k++)
            {
                var json = data[keys[k]];
                var weapon = new $Classes.Weapon()
                    .SetName(json.Name)
                    .SetImage(json.Image)
                    .SetMastery(json.Mastery)
                    .SetModTypes(json.ModTypes)
                    .SetMagazineSize(json.BaseMagazineSize)
                    .SetMaximumAmmo(json.BaseMaximumAmmo)
                    .SetReloadDuration(json.BaseReloadDuration)
                    .SetAdditionalSettingsHtml(json.AdditionalSettingsHtml);

                var fkeys = Object.keys(json.FiringModes);
                for (var f = 0; f < fkeys.length; f++)
                {
                    var fjson = json.FiringModes[fkeys[f]];
                    /**
                     * @type {import('./classes').WeaponFiringMode}
                     */
                    var firingMode = new $Classes.WeaponFiringMode()
                        .SetName(fjson.Name)
                        .SetDamageImpact(fjson.OriginalBaseDamage[$Classes.DamageType.IMPACT])
                        .SetDamagePuncture(fjson.OriginalBaseDamage[$Classes.DamageType.PUNCTURE])
                        .SetDamageSlash(fjson.OriginalBaseDamage[$Classes.DamageType.SLASH])
                        .SetDamageCold(fjson.OriginalBaseDamage[$Classes.DamageType.COLD])
                        .SetDamageElectric(fjson.OriginalBaseDamage[$Classes.DamageType.ELECTRIC])
                        .SetDamageHeat(fjson.OriginalBaseDamage[$Classes.DamageType.HEAT])
                        .SetDamageToxin(fjson.OriginalBaseDamage[$Classes.DamageType.TOXIN])
                        .SetDamageBlast(fjson.OriginalBaseDamage[$Classes.DamageType.BLAST])
                        .SetDamageCorrosive(fjson.OriginalBaseDamage[$Classes.DamageType.CORROSIVE])
                        .SetDamageGas(fjson.OriginalBaseDamage[$Classes.DamageType.GAS])
                        .SetDamageMagnetic(fjson.OriginalBaseDamage[$Classes.DamageType.MAGNETIC])
                        .SetDamageRadiation(fjson.OriginalBaseDamage[$Classes.DamageType.RADIATION])
                        .SetDamageViral(fjson.OriginalBaseDamage[$Classes.DamageType.VIRAL])
                        .SetPellets(fjson.Pellets)
                        .SetFireRate(fjson.FireRate)
                        .SetCriticalChance(fjson.CriticalChance)
                        .SetCriticalMultiplier(fjson.CriticalMultiplier)
                        .SetStatusChance(fjson.StatusChance)
                        .SetAmmoConsumption(fjson.AmmoConsumption)
                        .SetIsBeam(fjson.IsBeam)
                        .SetChargeDelay(fjson.ChargeDelay);

                    var rkeys = Object.keys(json.FiringModes[fkeys[f]].Residuals);
                    for (var r = 0; r < rkeys.length; r++)
                    {
                        var rjson = json.FiringModes[fkeys[f]].Residuals[rkeys[r]];
                        /**
                         * @type {import('./classes').WeaponFiringModeResidual}
                         */
                        var firingModeResidual = new $Classes.WeaponFiringModeResidual()
                            .SetDamageImpact(rjson.OriginalBaseDamage[$Classes.DamageType.IMPACT])
                            .SetDamagePuncture(rjson.OriginalBaseDamage[$Classes.DamageType.PUNCTURE])
                            .SetDamageSlash(rjson.OriginalBaseDamage[$Classes.DamageType.SLASH])
                            .SetDamageCold(rjson.OriginalBaseDamage[$Classes.DamageType.COLD])
                            .SetDamageElectric(rjson.OriginalBaseDamage[$Classes.DamageType.ELECTRIC])
                            .SetDamageHeat(rjson.OriginalBaseDamage[$Classes.DamageType.HEAT])
                            .SetDamageToxin(rjson.OriginalBaseDamage[$Classes.DamageType.TOXIN])
                            .SetDamageBlast(rjson.OriginalBaseDamage[$Classes.DamageType.BLAST])
                            .SetDamageCorrosive(rjson.OriginalBaseDamage[$Classes.DamageType.CORROSIVE])
                            .SetDamageGas(rjson.OriginalBaseDamage[$Classes.DamageType.GAS])
                            .SetDamageMagnetic(rjson.OriginalBaseDamage[$Classes.DamageType.MAGNETIC])
                            .SetDamageRadiation(rjson.OriginalBaseDamage[$Classes.DamageType.RADIATION])
                            .SetDamageViral(rjson.OriginalBaseDamage[$Classes.DamageType.VIRAL])
                            .SetPellets(rjson.Pellets)
                            .SetDuration(rjson.Duration)
                            .SetOverrideCriticalChance(rjson.OverrideCriticalChance)
                            .SetOverrideCriticalMultiplier(rjson.OverrideCriticalMultiplier)
                            .SetOverrideStatusChance(rjson.OverrideStatusChance);

                        firingMode.AddResidual(firingModeResidual);
                    }

                    weapon.AddFiringMode(firingMode);
                }

                weapon.SetFiringMode(0);

                //Weapons = []; //remove
                this.Weapons.push(weapon);
            }
        }

        AwaitEnemies(simulator) {
            this.$_AwaitingEnemies.push(simulator);
        }

        ClearSimulationData() {
            this.SimulationData = {};
            this.SimulationName = {};
            this.SimulationError = {};
            this.HasSimulationData = false;
        }
        
        DoHistoryUpdate(line) {
            var url = this.DoUrlUpdate(line, false);
            history.pushState(this.GetState(), this.ActiveWeapon.Name, url);

            console.log('Set state', line, history.state);
        }

        DoUrlUpdate(line, changeUrl = true) {
            var weaponUrlPath = this.ActiveWeapon.UrlPath.split('/')[0];
            var modUrlPath = this.ActiveWeapon.UrlPath.split('/')[1];
            var enemy1UrlPath = this.ActiveEnemy[0].UrlPath;
            var enemy2UrlPath = this.ActiveEnemy[1].UrlPath;
            var enemy3UrlPath = this.ActiveEnemy[2].UrlPath;
            var enemy4UrlPath = this.ActiveEnemy[3].UrlPath;

            var keys = Object.keys(this.AdditionalSettingsVariables);
            keys.sort();
            for (var k = 0; k < keys.length; k++)
            {
                var setting = keys[k];
                if (setting.charAt(0) != '_')
                    continue;

                if (setting.toLowerCase().includes('kuva') && this.AdditionalSettingsVariables._KuvaBonus == 0)
                    continue;

                var value = this.AdditionalSettingsVariables[setting];

                setting = setting.substring(1);

                if (value != undefined) {
                    weaponUrlPath += '+' + setting + ':' + value;
                }
            }

            var url = this.UrlPrefix + '/' + weaponUrlPath + '/' + modUrlPath + '/' + enemy1UrlPath + '/' + enemy2UrlPath + '/' + enemy3UrlPath + '/' + enemy4UrlPath;

            if (changeUrl) {
                history.replaceState(this.GetState(), this.ActiveWeapon.Name, url);
                console.log('Set url', line, history.state);
            }


            return url;
        }

        FinalizeLoading() {
            if (this.InitialState == undefined) {
                this.SetWeaponObject(this.Weapons[Math.floor(Math.random() * this.Weapons.length)], true);
                this.SetEnemyString('corrupted-heavy-gunner', 0, true);
                this.ActiveEnemy[0].SetLevel(100);
                this.SetEnemyString('bombard', 1, true);
                this.ActiveEnemy[1].SetLevel(100);
                this.SetEnemyString('corpus-tech', 2, true);
                this.ActiveEnemy[2].SetLevel(100);
                this.SetEnemyString('ancient-healer', 3, true);
                this.ActiveEnemy[3].SetLevel(100);

                this.DoUrlUpdate(447);
            } else {
                this.LoadState(this.InitialState);
            }
        }

        FinishAwaitingEnemies() {
            for (var a = 0; a < this.$_AwaitingEnemies.length; a++)
            {
                this.$_AwaitingEnemies[a].$_finalize();
            }
        }

        HandleAdditionalSettingsVariable(variableName, value) {
            switch (variableName) {
                case ('KuvaElement'):
                    this.AdditionalSettingsVariables.KuvaElement = $Classes.DamageType[value];
                    this.AdditionalSettingsVariables._KuvaElement = $Classes.DamageTypeName[this.AdditionalSettingsVariables.KuvaElement] ? $Classes.DamageTypeName[this.AdditionalSettingsVariables.KuvaElement].toUpperCase() : undefined;
                    break;

                case ('KuvaBonus'):
                    value = parseFloat(value);
                    if (value < 0) value = 0;
                    if (value > 60) value = 60;
                    if (value >= 10 && value < 25) value = 25;
                    this.AdditionalSettingsVariables._KuvaBonus = value;
                    this.AdditionalSettingsVariables.KuvaBonus = value;
                    this.AdditionalSettingsVariables.KuvaBonus = this.AdditionalSettingsVariables._KuvaBonus;
                    break;

                default:
                    throw new Error('Unimplemented settings variable!');
            }

            this.DoUrlUpdate(1845);
        }

        LoadState(state) {
            if (state == undefined)
                throw new Error('A simulator state cannot be undefined!');

            console.log('Loading state', state);
            
            this.SetWeaponString(state.Weapon, true);
            
            if (state.FiringMode != undefined)
            {
                this.SetFiringModeString(state.FiringMode, true);
            }
            
            for (var m = 0; m < state.Mods.length; m++)
            {
                this.SetModString(state.Mods[m], m, true);
            }

            for (var e = 0; e < state.Enemies.length; e++)
            {
                var enemy = state.Enemies[e];
                if (enemy != null) {
                    this.SetEnemyString(enemy.UrlName, e, true);
                    this.ActiveEnemy[e].SetLevel(enemy.Level);
                } else {
                    switch(e) {
                        case(0):
                            this.SetEnemyString('corrupted-heavy-gunner', e, true);
                            break;
                        case(1):
                            this.SetEnemyString('bombard', e, true);
                            break;
                        case(2):
                            this.SetEnemyString('corpus-tech', e, true);
                            break;
                        case(3):
                            this.SetEnemyString('ancient-healer', e, true);
                            break;
                    }
                    this.ActiveEnemy[e].SetLevel(100);
                }
            }

            if (state.AdditionalSettingsVariables) {
                for (var s = 0; s < state.AdditionalSettingsVariables.length; s++)
                {
                    var fullSetting = state.AdditionalSettingsVariables[s];
                    var setting = fullSetting.split(':')[0];
                    var value = fullSetting.split(':')[1];
                    this.HandleAdditionalSettingsVariable(setting, value);
                }

                this.ActiveWeapon.AddRelativeBaseDamage(this.AdditionalSettingsVariables.KuvaElement, this.AdditionalSettingsVariables.KuvaBonus/100);
            }
        }

        ReadState() {
            var url = window.location.href;
            var data = url.split('simulator');
            var initialState = undefined;
            if (data[1] != undefined && data[1] != '' && data[1] != '/')
            {
                var additionalSettingsVariables = data[1].split('/')[1].split('+');
                additionalSettingsVariables.shift();
                additionalSettingsVariables.shift();
    
                initialState = {
                    Weapon: data[1].split('/')[1].split('+')[0],
                    FiringMode: data[1].split('/')[1].split('+')[1],
                    AdditionalSettingsVariables: additionalSettingsVariables,
                    Mods: data[1].split('/')[2].split('+'),
                    Enemies: [
                        (data[1].split('/')[3] != undefined ? { UrlName: data[1].split('/')[3].split('+')[0], Level: data[1].split('/')[3].split('+')[1] } : null),
                        (data[1].split('/')[4] != undefined ? { UrlName: data[1].split('/')[4].split('+')[0], Level: data[1].split('/')[4].split('+')[1] } : null),
                        (data[1].split('/')[5] != undefined ? { UrlName: data[1].split('/')[5].split('+')[0], Level: data[1].split('/')[5].split('+')[1] } : null),
                        (data[1].split('/')[6] != undefined ? { UrlName: data[1].split('/')[6].split('+')[0], Level: data[1].split('/')[6].split('+')[1] } : null)
                    ]
                };
    
                for (var m = 0; m < initialState.Mods.length; m++)
                {
                    if (initialState.Mods[m] == 'empty')
                        initialState.Mods[m] = null;
                }
            }
            
            return initialState;
        }

        SetupOnHistoryChange() {
            var MAIN = this;
            window.addEventListener('popstate', function() {
                MAIN.$scope.$apply(() => {
                    MAIN.LoadState(history.state);
                });
            })
        }

        UpdateRivenModEffects() {
            this.Riven.$_Effects = {};
            this.Riven.$_EffectDescriptions = {};

            for (var e = 0; e < 4; e++)
            {
                var effect = this.RivenModEffects[e];
                if (effect == undefined)
                    continue;

                var power = this.RivenModEffectPower[e] || 0;

                this.Riven.AddEffect(effect, power/100, this.ModEffectDescriptions[effect]);
            }

            this.ActiveWeapon.ForceUpdate();
        }

        /**
         * 
         * @param {number} number 
         */
        $_formatNumber(number) {
            if (number == null || isNaN(number))
                return 'NaN';

            var changes = 0;
            while (number >= 1000) {
                number = number / 1000;
                changes++;
            }

            if (changes == 1 && number < 10) {
                number = number * 1000;
                changes--;
            }

            var changesTiers = {
                0: '',
                1: 'k',
                2: 'm',
                3: 'b',
                4: 't',
                5: 'qd',
                6: 'qt',
                7: 'sx',
                8: 'sp'
            }

            if (number == Math.round(number))
                return number + changesTiers[changes];

            return number.toPrecision(4) + changesTiers[changes];
        }

        /**
         * 
         * @param {import('./classes').SimulationError} error 
         */
        $_receiveSimulationError(error) {
            console.log('Simulation errored!', error);

            this.SimulationError[`Enemy${error.$_Id + 1}`] = error.Stack;
            this.SimulationName[`Enemy${error.$_Id + 1}`] = error.Enemy.Name;

            this.HasSimulationData = true;
        }

        /**
         * 
         * @param {import('./classes').SimulationProgress} content 
         */
        $_receiveSimulationProgress(content) {
            this.SimulationProgress = content.Progress;
        }

        /**
         * 
         * @param {import('./classes').Metrics} metrics 
         */
        $_receiveSimulationResults(metrics) {
            /** @type {import('./classes').ResultDisplay} */
            var resultDisplay = new $Classes.ResultDisplay();

            var icons = window.$Icons;

            resultDisplay
                .AddMainBubble()
                    .SetImage('/images/enemies/' + metrics.Enemy.Image)
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.SHIELD_HALF)
                        .SetValue(this.$_formatNumber(metrics.Enemy.TotalArmor))
                        .SetAltName('Armor')
                        .FinalizeSubBubble()
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.HEART_HALF)
                        .SetValue(this.$_formatNumber(metrics.Enemy.TotalHealth))
                        .SetAltName('Health')
                        .FinalizeSubBubble()
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.BATTERY_HALF)
                        .SetValue(this.$_formatNumber(metrics.Enemy.TotalShield))
                        .SetAltName('Shield')
                        .FinalizeSubBubble()
                    .AddSubBubble()
                        .SetSize('small')
                        .SetLocation(60)
                        .SetIcon(icons.ARROW_UP)
                        .SetValue(this.$_formatNumber(metrics.Enemy.Level))
                        .SetAltName('Level')
                        .FinalizeSubBubble()
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetLocation(300)
                        .SetIcon(icons.STOPWATCH)
                        .SetValue(this.$_formatNumber(metrics.KillTime) + 's')
                        .SetAltName('Kill Time')
                        .FinalizeSubBubble()
                    .FinalizeMainBubble();

            var statusBubble = resultDisplay
                .AddMainBubble()
                    .SetTitle('Status Effects')
                    .SetIcon(icons.LIGHTNING);

            var keys = Object.keys(metrics.Procs);
            for (var k = 0; k < keys.length; k++)
            {
                var key = parseInt(keys[k]);

                var statusSubBubble = statusBubble
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons[$Classes.DamageTypeName[key].toUpperCase()])
                        .SetValue(metrics.Procs[key].ProcCount)
                        .SetAltName($Classes.DamageTypeName[key]);

                if (metrics.Procs[key].CumulativeDamage != undefined && metrics.Procs[key].CumulativeDamage > 0) {
                    statusSubBubble
                        .ReplaceMainBubble(icons.ARROW_LEFT, 30)
                            .SetTitle($Classes.DamageTypeName[key] + ' Ticks')
                            .SetIcon(icons[$Classes.DamageTypeName[key].toUpperCase()])
                            .AddSubBubble()
                                .SetSize('medium')
                                .SetIcon(icons.RIBBON)
                                .SetValue(this.$_formatNumber(metrics.Procs[key].MaximumTickDamage))
                                .SetAltName('Max Tick')
                                .FinalizeSubBubble()
                            .AddSubBubble()
                                .SetSize('medium')
                                .SetIcon(icons.PLUS)
                                .SetValue(this.$_formatNumber(metrics.Procs[key].CumulativeDamage))
                                .SetAltName('Total')
                                .FinalizeSubBubble()
                            .AddSubBubble()
                                .SetSize('medium')
                                .SetIcon(icons.ARROW_RIGHT)
                                .SetValue(this.$_formatNumber(metrics.Procs[key].AverageTickDamage))
                                .SetAltName('Avg Tick')
                                .FinalizeSubBubble()
                            .AddSubBubble()
                                .SetSize('medium')
                                .SetIcon(icons.PIE_CHART)
                                .SetValue(this.$_formatNumber(100 * metrics.Procs[key].DamageProportion) + '%')
                                .SetAltName('% of Dmg')
                                .FinalizeSubBubble()
                            .FinalizeReplacementBubble()
                }

                statusSubBubble
                    .FinalizeSubBubble();
            }

            statusBubble
                    .FinalizeMainBubble()
                .AddMainBubble()
                    .SetTitle('Total Damage')
                    .SetIcon(icons.DIAMOND)
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.RIBBON)
                        .SetValue(this.$_formatNumber(metrics.MaximumTotalDamage))
                        .SetAltName('Maximum')
                        .FinalizeSubBubble()
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.PLUS)
                        .SetValue(this.$_formatNumber(metrics.CumulativeTotalDamage))
                        .SetAltName('Total')
                        .FinalizeSubBubble()
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.ARROW_RIGHT)
                        .SetValue(this.$_formatNumber(metrics.AverageTotalDamage))
                        .SetAltName('Average')
                        .FinalizeSubBubble()
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.STAR)
                        .SetValue(this.$_formatNumber(metrics.AverageTotalDPS))
                        .SetAltName('DPS')
                        .FinalizeSubBubble()
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.BULLSEYE)
                        .SetValue(this.$_formatNumber(metrics.ShotsFired))
                        .SetAltName('# of Shot')
                        .FinalizeSubBubble()
                    .FinalizeMainBubble()
                .AddMainBubble()
                    .SetTitle('Raw Damage')
                    .SetIcon(icons.DIAMOND_HALF)
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.RIBBON)
                        .SetValue(this.$_formatNumber(metrics.MaximumRawDamage))
                        .SetAltName('Maximum')
                        .FinalizeSubBubble()
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.PLUS)
                        .SetValue(this.$_formatNumber(metrics.CumulativeRawDamage))
                        .SetAltName('Total')
                        .FinalizeSubBubble()
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.ARROW_RIGHT)
                        .SetValue(this.$_formatNumber(metrics.AverageRawDamage))
                        .SetAltName('Average')
                        .FinalizeSubBubble()
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.STAR)
                        .SetValue(this.$_formatNumber(metrics.AverageRawDPS))
                        .SetAltName('DPS')
                        .FinalizeSubBubble()
                    .AddSubBubble()
                        .SetSize('medium')
                        .SetIcon(icons.PIE_CHART)
                        .SetValue(this.$_formatNumber(100 * metrics.RawDamageProportion) + '%')
                        .SetAltName('% of Dmg')
                        .FinalizeSubBubble()
                    .FinalizeMainBubble();

            resultDisplay
                .DefineRow(2, { 'mt': true, 'mb-medium': true })
                .DefineRow(2, { 'mt': true, 'mb-medium': true })
                ;

            this.SimulationData[`Enemy${metrics.$_Id + 1}`] = resultDisplay;
            this.SimulationName[`Enemy${metrics.$_Id + 1}`] = metrics.Enemy.Name;

            this.HasSimulationData = true;
        }

        get ModEffects() {
            return $Classes.ModEffectName;
        }

        get ValidAdditionalSettingsVariables() {
            var newSettings = {};
            var keys = Object.keys(this.AdditionalSettingsVariables);
            for (var a = 0; a < keys.length; a++) {
                var key = keys[a];
                if (this.GetAdditionalSettingsVariableIsValid(key)) {
                    newSettings[key] = this.AdditionalSettingsVariables[key];
                }
            }

            return newSettings;
        }
    }
    $AngularClasses.SimulationController = SimulationController;
    module.exports.SimulationController = SimulationController;

    class ModCardDirective {
        constructor() {
            this.restrict = 'E';
            this.scope = {
                mod: '=mod',
                onClick: '&onClick',
                onModRankClick: '&onModRankClick',
                displayText: '<displayText',
                showRanks: '<showRanks'
            };
            this.templateUrl = '/directives/mod-card.html';
        }
    }
    $AngularClasses.ModCardDirective = ModCardDirective;
    module.exports.ModCardDirective = ModCardDirective;

    function $DirectiveSimBindUnsafeHtml($compile) {
        return function ($scope, element, attributes) {
            $scope.$watch(
                function (scope) {
                    return $scope.$eval(attributes.simBindUnsafeHtml);
                },
                function (value) {
                    element.html(value);
                    $compile(element.contents())($scope);
                }
            );
        }
    }
    $DirectiveSimBindUnsafeHtml.$inject = [ '$compile' ];
    $AngularClasses.$DirectiveSimBindUnsafeHtml = $DirectiveSimBindUnsafeHtml;
    module.exports.$DirectiveSimBindUnsafeHtml = $DirectiveSimBindUnsafeHtml;
})(window);