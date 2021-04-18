var express = require('express');
var router = express.Router();

var allData = require('../scripts/private/data/_all');
var indexData = require('../scripts/private/data/index');
var simulationData = require('../scripts/private/data/simulation');

var Properties = undefined;

/* GET home page. */
router.get('/alerts', async function(req, res, next) {
    var alerts = await allData.GetAlerts();
    res.json(alerts);
});

router.get('/news', async function(req, res, next) {
    var news = await indexData.GetNews();
    res.json(news);
});

router.get('/weapons', async function(req, res, next) {
    var weapons = await simulationData.GetWeapons();
    res.json(weapons);
});

router.get('/mods', async function(req, res, next) {
    var mods = await simulationData.GetMods();
    res.json(mods);
});

router.get('/mod-effects', async function(req, res, next) {
    var modEffects = await simulationData.GetModEffects();
    res.json(modEffects);
});

router.get('/enemies', async function(req, res, next) {
    var enemies = await simulationData.GetEnemies();
    res.json(enemies);
});

module.exports.Router = router;


function SetProperties(properties) {
    Properties = properties;
}
module.exports.SetProperties = SetProperties;