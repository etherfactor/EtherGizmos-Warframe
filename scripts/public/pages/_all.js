if (false) {
    /** @type {import('../class-definitions/classes')} */
    var $Classes;
}

(function(window) {
    angular.module('NavApp', ['ngSanitize'])
        .controller('Survey', $SurveyController)
        .provider('$AjaxLoader', $AjaxLoader)
        .config($AjaxLoaderConfig)
        .service('$Nav', $Nav)
        ;

    $SurveyController.$inject = [ '$scope', '$http', '$AjaxLoader', '$Nav' ];
    function $SurveyController($scope, $http, $AjaxLoader, $Nav) {
        var ajaxIdentifierSurveys = 'surveys';
        $AjaxLoader.StartWaiting(ajaxIdentifierSurveys);
        $http.get('/data/surveys').then(function(response) {
            var data = response.data;
            $Nav.AddSurveys(data);
            $scope.Surveys = $Nav.Surveys;

            $AjaxLoader.FinishWaiting(ajaxIdentifierSurveys, {});
        });
    }

    function $AjaxLoader() {
        var provider = this;

        provider.config = {
            callback: function() {
                throw new Error('$AjaxLoader must be configured with a callback!');
            }
        };

        provider.$get = function() {
            return new $AjaxLoaderService(provider.config);
        }
    }

    function $AjaxLoaderService(config) {
        var service = this;

        var waiting = {};

        function values(object) {
            var output = [];

            var keys = Object.keys(object);
            for (var k = 0; k < keys.length; k++)
            {
                output.push(object[keys[k]]);
            }

            return output;
        }

        service.StartWaiting = function(identifier, checkUnique = true) {
            if (waiting[identifier] != undefined)
            {
                if (checkUnique)
                    throw new Error('$AjaxLoader identifier is not unique!');
                else
                    return false;
            }

            waiting[identifier] = 1;
            return true;
        }

        service.FinishWaiting = function(identifier, data) {
            if (waiting[identifier] == undefined)
                throw new Error('$AjaxLoader identifier cannot be found!');

            waiting[identifier] = 0;

            if (Math.max(...values(waiting)) == 0)
            {
                config.callback(data);
            }
        }
    }

    $AjaxLoaderConfig.$inject = [ '$AjaxLoaderProvider' ]
    function $AjaxLoaderConfig($AjaxLoader) {
        $AjaxLoader.config.callback = function(data) {
            $('body').removeClass('loading-data');
        };
    }

    function $Nav() {
        var provider = this;

        provider.config = {};

        provider.$get = function() {
            return new NavService(provider.config);
        }
    }

    function NavService(config) {
        var service = this;

        service.Surveys = [];

        service.AddSurveys = function(data) {
            var surveyCollection = $Classes.SurveyCollection.FromObject(data);
            surveyCollection.ForEach(function(survey) {
                service.Surveys.push(survey);
                console.log(survey);
            });
        }
    }
})(window);