if (false) {
    /** @type {import('../class-definitions/angular')} */
    var $AngularClasses;
}

if (false) {
    /** @type {import('../class-definitions/classes')} */
    var $Classes
}

(function(window) {
    angular.module('SimulatorApp', [ 'ngSanitize' ])
        .controller('Tabs', $AngularClasses.TabsController)
        .controller('Weapons', $AngularClasses.WeaponsController)
        .controller('Mods', $AngularClasses.ModsController)
        .controller('Enemies', $AngularClasses.EnemyController)
        .controller('Simulation', $AngularClasses.SimulationController)
        .controller('Survey', $AngularClasses.SurveyController)
        .provider('$AjaxLoader', $AngularClasses.AjaxLoader)
        .config($AngularClasses.AjaxLoader_Config_Simulator)
        .provider('$Simulator', $AngularClasses.Simulator)
        .directive('simBindUnsafeHtml', $AngularClasses.$DirectiveSimBindUnsafeHtml)
        .filter('multiLine', $AngularClasses.$MultiLineFilter)
        ;
})(window);