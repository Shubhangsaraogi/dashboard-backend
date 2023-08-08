const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const fetch_id = require('../middleware/fetch_id');
const request = require('request');
const accessToken = '04461dbabb1d0b123f5ffce3bfaa3bcd';
const endpoint = '9f1e5743.problems.sphere-engine.com';

// Route 3 to fetch the user
router.post('/submission', async (req, res) => {

    var request = require('request');

    // define request parameters
    var submissionData = {
        compilerId: 11,
        source: req.body.code,
    };

    // send request
    request({
        url: 'https://' + endpoint + '/api/v4/submissions?access_token=' + accessToken,
        method: 'POST',
        form: submissionData
    }, async function (error, response, body) {

        if (error) {
            console.log('Connection problem');
        }

        // process response
        await sleep(3000);
        if (response) {
            if (response.statusCode === 201) {
                console.log(JSON.parse(response.body)); // submission data in JSON

                // define request parameters
                var submissionsIds = response.body.id;

                // send request
                request({
                    url: 'https://' + endpoint + '/api/v4/submissions?ids=' + submissionsIds.join() + '&access_token=' + accessToken,
                    method: 'GET'
                }, function (error, response, body) {

                    if (error) {
                        console.log('Connection problem');
                    }

                    // process response
                    if (response) {
                        if (response.statusCode === 200) {
                            console.log(JSON.parse(response.body)); // list of submissions in JSON
                        } else {
                            if (response.statusCode === 401) {
                                console.log('Invalid access token');
                            } else if (response.statusCode === 400) {
                                var body = JSON.parse(response.body);
                                console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
                            }
                        }
                    }
                });
            } else {
                if (response.statusCode === 401) {
                    console.log('Invalid access token');
                } else if (response.statusCode === 402) {
                    console.log('Unable to create submission');
                } else if (response.statusCode === 400) {
                    var body = JSON.parse(response.body);
                    console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
                }
            }
        }
    });


})

module.exports = router;