(function(window) {
    var AjaxUtils = {};
    window.$AjaxUtils = AjaxUtils;

    /**
     * @returns {XMLHttpRequest | ActiveXObject}
     */
    function $GetRequestObject() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            return new ActiveXObject('Microsoft.XMLHTTP');
        } else {
            global.alert('AJAX is not supported!');
            return null;
        }
    }

    function $HandleResponse(request, responseHandler) {
        if (request.readyState == 4 && request.status == 200) {
            responseHandler(request.responseText);
        }
    }

    AjaxUtils.SendGetRequest = function(requestURL, responseHandler) {
        var request = $GetRequestObject();
        request.onreadystatechange = function() {
            $HandleResponse(request, responseHandler);
        };
        request.open('GET', requestURL, true);
        request.send();
    }

    AjaxUtils.BodyLoadSnippet = function(requestURL) {
        AjaxUtils.SendGetRequest(requestURL, function(response, $apply) {
            console.log($apply);
            $('#body-content').html(response);
            $('body').removeClass('loading-snippet');

            if ($apply) { $apply(() => {}); }
            //$('#body')
        });
    }
})(window);