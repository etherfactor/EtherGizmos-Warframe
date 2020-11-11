var express = require('express');
var router = express.Router();

const Sql = require('../scripts/private/sql/connection');

//Called upon receiving a survey
/* POST survey */
router.post('/survey', function(req, res, next) {
    var submitTimestamp = new Date();

    //Create a response object
    Sql.query(
        `CALL CreateSurveyResponse( ?, ?, @L_SurveyResponseId );`,
        [
            req.body.id,
            submitTimestamp
        ],
        function(err, results) {
            if (err)
            {
                console.log(21, err);
                return;
            }

            //Get the id of the object for later inserts
            var responseId = results[0][0].result;

            var questionCount = parseInt(req.body.count);
            for (var q = 0; q < questionCount; q++)
            {
                var questionId = `q${q+1}`;
                var questionAnswer = req.body[questionId];

                //Assume string
                var trueQuestionAnswer = questionAnswer;

                //Test it for being int
                var questionAnswerInt = parseInt(questionAnswer);
                if (!isNaN(questionAnswerInt)) {
                    trueQuestionAnswer = questionAnswerInt;
                }

                //Test it for being float
                var questionAnswerFloat = parseFloat(questionAnswer);
                if (!isNaN(questionAnswerFloat)) {
                    trueQuestionAnswer = questionAnswerFloat;
                }

                //If empty, it is null
                if (trueQuestionAnswer == '') {
                    trueQuestionAnswer = null;
                }
                
                //If it's text, it's free response and needs an extra step to store
                if (typeof(trueQuestionAnswer) == 'string') {
                    //Create a free response object
                    Sql.query(
                        `CALL CreateSurveyResponseAnswerFreeText( ?, @L_SurveyResponseAnswerFreeTextId );`,
                        [
                            trueQuestionAnswer
                        ],
                        function(err, results) {
                            if (err)
                            {
                                console.log(53, err);
                                return;
                            }

                            //Get that object's id
                            var textId = results[0][0].result;

                            //Store the answer to this question with a free response id, and no specific answer
                            $_storeQuestionAnswer(null, textId);
                        }
                    );
                } else {
                    //Store the answer to this question with a specific answer, and no free response
                    $_storeQuestionAnswer(trueQuestionAnswer, null);
                }

                /**
                 * Stores this survey answer; call with either argument, but not both
                 * @param {number} answerId 
                 * @param {number} textId 
                 */
                function $_storeQuestionAnswer(answerId, textId) {
                    //Store the answer
                    Sql.query(
                        `CALL CreateSurveyResponseAnswer( ?, ?, ?, ? );`,
                        [
                            responseId,
                            q+1, //id is 0-indexed in JS, but is 1-indexed in SQL
                            answerId,
                            textId
                        ],
                        function(err, results) {
                            if (err)
                            {
                                console.log(76, err);
                                return;
                            }
                        }
                    )
                }
            }
        }
    );

    //Send something back so the client knows its answer was received
    res.send('Survey received');
});

module.exports = router;