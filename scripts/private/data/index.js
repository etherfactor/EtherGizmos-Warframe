var async = require('async');

var conn = require('../sql/connection');

var $Classes = require('../../public/class-definitions/classes');

var LastUpdated = new Date(0);
var IsUpdating = false;
var UpdatePromise = null;

var News = null;

function TryUpdateData() {
    if (!IsUpdating) {
        UpdatePromise = new Promise(function (resolve, reject) {
            if ((new Date().getTime() - LastUpdated.getTime()) > 3600000) {
                IsUpdating = true;
                UpdateData().then(() => {
                    IsUpdating = false;
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    return UpdatePromise;
}

function UpdateData() {
    return new Promise(function (resolve, reject) {
        var newPromise = UpdateNews();

        Promise.all([newPromise]).then(() => {
            LastUpdated = new Date();
            resolve();
        });
    });
}

function UpdateNews() {
    return new Promise(function (resolve, reject) {
        var news = [];

        async.parallel([
            function(callback) {
                conn.query(
                    `SELECT * FROM news ORDER BY id DESC;`,
                    function(err, results) {
                        if (err)
                        {
                            console.log(err);
                            return;
                        }

                        for (var r = 0; r < results.length; r++)
                        {
                            var rn = results[r];
                            var newsMessage = new $Classes.NewsMessage()
                                .SetTitle(rn.title)
                                .SetBody(rn.body)
                                .SetTimestamp(rn.timestamp);

                            news.push(newsMessage);
                        }

                        callback(null, 1);
                    }
                );
            }
        ],
        function(err, results) {
            News = news;
            console.log(`Updated news as of ${new Date().toString()}`,);
            resolve();
        });
    });
}


async function GetNews() {
    await TryUpdateData();
    return News;
}
module.exports.GetNews = GetNews;