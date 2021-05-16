if (false) {
    /** @type {import('../class-definitions/angular')} */
    var $AngularClasses;
}

if (false) {
    /** @type {import('../class-definitions/classes')} */
    var $Classes
}

(function(window) {
    angular.module('ArsenalApp', [ 'ngSanitize' ])
        .controller('Weapons', $AngularClasses.ArsenalWeaponsController)
        .controller('Survey', $AngularClasses.SurveyController)
        .provider('$AjaxLoader', $AngularClasses.AjaxLoader)
        .config($AngularClasses.AjaxLoader_Config_Arsenal)
        .provider('$Arsenal', $AngularClasses.Arsenal)
        .directive('simBindUnsafeHtml', $AngularClasses.$DirectiveSimBindUnsafeHtml)
        .filter('multiLine', $AngularClasses.$MultiLineFilter)
        ;
})(window);