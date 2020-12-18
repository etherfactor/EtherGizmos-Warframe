var express = require('express');
var router = express.Router();

var Properties = undefined;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pages/arsenal', Properties);
});

router.get('/:weapon', function(req, res, next) {
    res.render('pages/arsenal', Properties);
});

module.exports.Router = router;


function SetProperties(properties) {
    Properties = properties;
}
module.exports.SetProperties = SetProperties;