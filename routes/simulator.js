var express = require('express');
var router = express.Router();

var Properties = undefined;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pages/simulator', Properties);
});

router.get('/:weapon', function(req, res, next) {
    res.render('pages/simulator', Properties);
});

router.get('/:weapon/:mods', function(req, res, next) {
    res.render('pages/simulator', Properties);
});

router.get('/:weapon/:mods/:enemy1/:enemy2/:enemy3/:enemy4', function(req, res, next) {
    res.render('pages/simulator', Properties);
});

module.exports.Router = router;


function SetProperties(properties) {
    Properties = properties;
}
module.exports.SetProperties = SetProperties;