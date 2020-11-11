if (false) {
    /** @type {import('../class-definitions/angular')} */
    var $AngularClasses;
}

(function(window) {
    angular.module('IndexApp', ['ngSanitize'])
        .controller('News', $AngularClasses.NewsController)
        .controller('Survey', $AngularClasses.SurveyController)
        .provider('$AjaxLoader', $AngularClasses.AjaxLoader)
        .config($AngularClasses.AjaxLoader_Config_Index)
        .provider('$Index', $AngularClasses.Index)
        .filter('multiLine', $AngularClasses.$MultiLineFilter)
        ;
})(window);