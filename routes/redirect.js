var express = require('express');
var router = express.Router();

var Properties = undefined;

router.get('/:redirectUrl', function(req, res, next) {
    console.log(`redirecting ${req.protocol} ${req.url} to ${req.params.redirectUrl}`);
    res.redirect(`${req.protocol}://${req.params.redirectUrl}`);
});

module.exports.Router = router;


function SetProperties(properties) {
    Properties = properties;
}
module.exports.SetProperties = SetProperties;