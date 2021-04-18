const superconsole = require('../../../../../scripts/logging/superconsole');

var async = require('async');

var conn = require('../sql/connection');

var $Classes = require('../../public/class-definitions/classes');

var LastUpdated = new Date(0);
var IsUpdating = false;
var UpdatePromise = null;

var Alerts = null;

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
        var newPromise = UpdateAlerts();

        Promise.all([newPromise]).then(() => {
            LastUpdated = new Date();
            resolve();
        });
    });
}

function UpdateAlerts() {
    return new Promise(function (resolve, reject) {
        /**
         * @type {import('../../public/class-definitions/classes').Alert[]}
         */
        var alerts = {};
        /**
         * @type {import('../../public/class-definitions/classes').Survey[]}
         */
        var surveys = {};

        /**
         * @type {import('../../public/class-definitions/classes').SurveyQuestion[]}
         */
        var surveyQuestions = {};

        async.parallel([
            function(callback) {
                conn.query(
                    `SELECT a.*
                    FROM alerts a
                    WHERE a.start_time <= CURRENT_TIMESTAMP
                      AND (
                        a.end_time < CURRENT_TIMESTAMP
                        OR a.end_time IS NULL
                      );`,
                    function(err, results) {
                        if (err)
                        {
                            superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, `$red:Encountered an error: $white,bright{${err}}`);
                            return;
                        }

                        for (var r = 0; r < results.length; r++)
                        {
                            var rs = results[r];
                            if (alerts[rs.id] == undefined)
                            {
                                var alert = new $Classes.Alert();
                                
                                alerts[rs.id] = alert;
                            }

                            alerts[rs.id]
                                .SetId(rs.id)
                                .SetStartTime(rs.start_time)
                                .SetEndTime(rs.end_time)
                                .SetText(rs.text)
                                .SetRedirectUrl(rs.text);
                        }

                        callback(null, 1);
                    }
                );
            },
            function(callback) {
                conn.query(
                    `SELECT a.id 'alert_id',
                    s.*
                    FROM alerts a
                      INNER JOIN surveys s
                        ON s.id = a.survey_id
                    WHERE a.start_time <= CURRENT_TIMESTAMP
                      AND (
                        a.end_time < CURRENT_TIMESTAMP
                        OR a.end_time IS NULL
                      );`,
                    function(err, results) {
                        if (err)
                        {
                            superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, `$red:Encountered an error: $white,bright{${err}}`);
                            return;
                        }

                        for (var r = 0; r < results.length; r++)
                        {
                            var rs = results[r];
                            if (alerts[rs.alert_id] == undefined)
                            {
                                var alert = new $Classes.Alert();

                                alerts[rs.alert_id] = alert;
                            }

                            if (surveys[rs.id] == undefined)
                            {
                                var survey = new $Classes.Survey();
                                
                                surveys[rs.id] = survey;
                            }

                            surveys[rs.id]
                                .SetId(rs.id)
                                .SetModalPrompt(rs.modal_prompt);

                            alerts[rs.alert_id].SetSurvey(survey);
                        }

                        callback(null, 1);
                    }
                );
            },
            function(callback) {
                conn.query(
                    `SELECT s.id 'survey_id',
                    sq.*
                    FROM alerts a
                      INNER JOIN surveys s
                        ON s.id = a.survey_id
                      INNER JOIN survey_question_groups sqg
                        ON sqg.id = s.id
                      INNER JOIN survey_questions sq
                        ON sq.id = sqg.question_id
                    WHERE a.start_time <= CURRENT_TIMESTAMP
                      AND (
                        a.end_time < CURRENT_TIMESTAMP
                        OR a.end_time IS NULL
                      );`,
                    function(err, results) {
                        if (err)
                        {
                            superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, `$red:Encountered an error: $white,bright{${err}}`);
                            return;
                        }

                        for (var r = 0; r < results.length; r++)
                        {
                            var rs = results[r];
                            if (surveys[rs.survey_id] == undefined)
                            {
                                var survey = new $Classes.Survey();
                                
                                surveys[rs.survey_id] = survey;
                            }

                            if (surveyQuestions[rs.id] == undefined)
                            {
                                var surveyQuestion = new $Classes.SurveyQuestion();

                                surveyQuestions[rs.id] = surveyQuestion;
                                surveys[rs.survey_id].AddQuestion(surveyQuestion);
                            }

                            surveyQuestions[rs.id]
                                .SetQuestionText(rs.question_text)
                                .SetResponseType(rs.response_type)
                                .SetIncludeOther(rs.include_other.readUIntBE(0, 1) == 1 ? true : false)
                                .SetAllowEmpty(rs.allow_empty.readUIntBE(0, 1) == 1 ? true : false);
                        }

                        callback(null, 1);
                    }
                );
            },
            function(callback) {
                conn.query(
                    `SELECT s.id 'survey_id',
                    sqo.*
                    FROM alerts a
                      INNER JOIN surveys s
                        ON s.id = a.survey_id
                      INNER JOIN survey_question_groups sqg
                        ON sqg.id = s.id
                      INNER JOIN survey_questions sq
                        ON sq.id = sqg.question_id
                      INNER JOIN survey_question_options sqo
                        ON sqo.id = sq.id
                    WHERE a.start_time <= CURRENT_TIMESTAMP
                      AND (
                        a.end_time < CURRENT_TIMESTAMP
                        OR a.end_time IS NULL
                      );`,
                    function(err, results) {
                        if (err)
                        {
                            superconsole.log(superconsole.MessageLevel.ERROR_DEBUG, `$red:Encountered an error: $white,bright{${err}}`);
                            return;
                        }

                        for (var r = 0; r < results.length; r++)
                        {
                            var rs = results[r];
                            if (surveys[rs.survey_id] == undefined)
                            {
                                var survey = new $Classes.Survey();
                                
                                surveys[rs.survey_id] = survey;
                            }

                            if (surveyQuestions[rs.id] == undefined)
                            {
                                var surveyQuestion = new $Classes.SurveyQuestion();

                                surveyQuestions[rs.id] = surveyQuestion;
                                surveys[rs.survey_id].AddQuestion(surveyQuestion);
                            }

                            var surveyQuestionOption = new $Classes.SurveyQuestionOption()
                                .SetValue(rs.line)
                                .SetDisplayText(rs.response_text);

                            surveyQuestions[rs.id]
                                .AddOption(surveyQuestionOption);
                        }

                        callback(null, 1);
                    }
                );
            }
        ],
        function(err, results) {
            var alertCollection = new $Classes.AlertCollection();

            var keys = Object.keys(alerts);
            for (var s = 0; s < keys.length; s++)
            {
                var key = keys[s];
                var alert = alerts[key];

                alertCollection.AddAlert(alert);
            }

            Alerts = alertCollection.ToObject();
            superconsole.log(superconsole.MessageLevel.INFORMATION, `$blue:Updated alerts as of $white,bright{${new Date().toString()}}`,);
            resolve();
        });
    });
}


async function GetAlerts() {
    await TryUpdateData();
    return Alerts;
}
module.exports.GetAlerts = GetAlerts;