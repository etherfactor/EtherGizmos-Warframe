var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pages/index', { App: '@warframe' });
});

router.get('/discord', function(req, res, next) {
    res.redirect('https://discord.gg/DaVR72X');
});

module.exports = router;