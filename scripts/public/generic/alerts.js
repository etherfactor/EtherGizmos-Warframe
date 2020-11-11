//Hack to let 'module' exist in front-end
if (typeof module == 'undefined') {
    module = { exports: {} }
}

(function(window) {
    var $Alerts = {};
    window.$Alerts = $Alerts;

    var alertsKeyword = 'Alerts';

    var hiddenAlerts = JSON.parse(localStorage.getItem(alertsKeyword)) || [];

    $Alerts.SetHidden = function(identifier) {
        if (hiddenAlerts.indexOf(identifier) < 0) {
            hiddenAlerts.push(identifier);
            localStorage.setItem(alertsKeyword, JSON.stringify(hiddenAlerts));
        }

        console.log(hiddenAlerts);
    }

    $Alerts.GetHidden = function(identifier) {
        var result = hiddenAlerts.indexOf(identifier) >= 0;
        return result;
    }
})(window);