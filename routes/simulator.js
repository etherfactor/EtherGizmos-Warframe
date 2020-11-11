var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pages/simulator', { App: '@warframe' });
});

router.get('/:weapon', function(req, res, next) {
    res.render('pages/simulator', { App: '@warframe' });
});

router.get('/:weapon/:mods', function(req, res, next) {
    res.render('pages/simulator', { App: '@warframe' });
});

router.get('/:weapon/:mods/:enemy1/:enemy2/:enemy3/:enemy4', function(req, res, next) {
    res.render('pages/simulator', { App: '@warframe' });
});

module.exports = router;