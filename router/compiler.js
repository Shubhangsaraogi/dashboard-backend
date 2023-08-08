
const express = require('express');
const router = express.Router();
var request = require('request');

// Route 3 to fetch the user
// define access parameters
var accessToken = '04461dbabb1d0b123f5ffce3bfaa3bcd';
var endpoint = '9f1e5743.compilers.sphere-engine.com';

router.get('/createSubmission', async (req, res) => {
    try {
        const { language, source_code } = req.body;
        let lang = language.toLowerCase();
        let compiler_id;
        switch (lang) {
            case 'c':
                compiler_id = 11;
                break;
            case 'c++':
                compiler_id = 1;
                break;
            case 'python':
                compiler_id = 99;
                break;
            case 'java':
                compiler_id = 10;
                break;
            case 'javascript':
                compiler_id = 35;
                break;
            case 'ruby':
                compiler_id = 17;
                break;
            case 'c#':
                compiler_id = 17;
                break;

            default:
                break;
        }
        var submissionData = {
            compilerId: compiler_id,
            source: source_code
        };

        request({
            url: 'https://' + endpoint + '/api/v4/submissions?access_token=' + accessToken,
            method: 'POST',
            form: submissionData
        }, async function (error, response, body) {

            if (error) {
                console.log('Connection problem');
                return res.status(500).send("connection problem");
            }
            if (response) {
                if (response.statusCode === 201) {
                    console.log(JSON.parse(response.body)); // submission data in JSON
                    let result = await response.body;
                    if (result.body) {
                        let submissionsIds = "583946602";
                        request({
                            url: 'https://' + endpoint + '/api/v4/submissions?ids=' + submissionsIds.join() + '&access_token=' + accessToken,
                            method: 'GET'
                        }, function (err, res, body) {

                            if (err) {
                                console.log('Connection problem');
                                return res.status(500).send("connection problem",err);
                            }

                            // process response
                            if (res) {
                                if (res.statusCode === 200) {
                                    return res.status(200).send(JSON.parse(res.body));
                                } else {
                                    if (res.statusCode === 401) {
                                        return res.send("invalid access token");
                                    } else if (res.statusCode === 400) {
                                        var body = JSON.parse(res.body);
                                        console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
                                    }
                                }
                            }
                        });
                    }

                } else {
                    if (response.statusCode === 401) {
                        return res.send("invalid access token");
                    } else if (response.statusCode === 402) {
                        return res.send("Unable to create submission");
                    } else if (response.statusCode === 400) {
                        var body = JSON.parse(response.body);
                        console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
                    }
                }
            }
            // process response
            if (response) {
                if (response.statusCode === 200) {
                    console.log(JSON.parse(response.body)); // list of compilers in JSON
                } else {
                    if (response.statusCode === 401) {
                        console.log('Invalid access token');
                    }
                }
            }
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Intenal Server Error");
    }

})

module.exports = router;
