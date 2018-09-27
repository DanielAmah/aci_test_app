/* ----------------------------------------------------------------------------------------------------------------------
* © Copyright 2018 Visa. All Rights Reserved.
*
* NOTICE: The software and accompanying information and documentation (together, the “Software”) remain the property of
* and are proprietary to Visa and its suppliers and affiliates. The Software remains protected by intellectual property
* rights and may be covered by U.S. and foreign patents or patent applications. The Software is licensed and not sold.
*
* By accessing the Software you are agreeing to Visa's terms of use (developer.visa.com/terms) and privacy policy
* (developer.visa.com/privacy). In addition, all permissible uses of the Software must be in support of Visa products,
* programs and services provided through the Visa Developer Program (VDP) platform only (developer.visa.com).
* THE SOFTWARE AND ANY ASSOCIATED INFORMATION OR DOCUMENTATION IS PROVIDED ON AN “AS IS,” “AS AVAILABLE,” “WITH ALL
* FAULTS” BASIS WITHOUT WARRANTY OR CONDITION OF ANY KIND. YOUR USE IS AT YOUR OWN RISK.
---------------------------------------------------------------------------------------------------------------------- */

/*jshint -W069 */
/**
 * 
 * @class vpa_102
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var vpa_102 = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');
    var randomstring = require('randomstring');
    var expect = require('chai').expect;
    var req = request.defaults();
    var fs = require('fs');

    function vpa_102(options) {

        if (typeof options !== 'object') {
            throw new Error('"authCredientials" object is missing. Constructor should be called with a json object');
        }

        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : 'https://sandbox.api.visa.com';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }

        var missingValues = [];

        if (options.userId) {
            this.userId = options.userId;
        } else {
            missingValues.push('userId');
        }

        if (options.userId) {
            this.password = options.password;
        } else {
            missingValues.push('password');
        }

        if (options.key) {
            this.keyFile = options.key;
        } else {
            missingValues.push('key');
        }

        if (options.cert) {
            this.certificateFile = options.cert;
        } else {
            missingValues.push('cert');
        }

        if (missingValues.length > 0) {
            var errorString = missingValues.join(", ");
            if (missingValues.length === 1) {
                throw new Error(errorString + " is missing in authCredientials.");
            } else {
                throw new Error(errorString + " are missing in authCredientials.");
            }
        }
    }

    /**
     * Process Payments
     * @method
     * @name vpa_102#processPayments
     * @param {string} xClientTransactionId - 
     * @param {} processPaymentsPOSTPayload - Resource body for Process Payments
     *
     */
    vpa_102.prototype.processPayments = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/vpa/v1/payment/ProcessPayments';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }
        if (parameters['x-client-transaction-id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter from header parameters: x-client-transaction-id'));
            return deferred.promise;
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            key: fs.readFileSync(this.keyFile),
            cert: fs.readFileSync(this.certificateFile),
            headers: headers,
            body: body
        };

        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            console.log("response" + JSON.stringify(response));
            if (error) {
                console.log("error " + JSON.stringify(error));
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get Payment Detail URL
     * @method
     * @name vpa_102#getpaymentUrl
     * @param {string} xClientTransactionId - 
     * @param {} getpaymentUrlPOSTPayload - Resource body for Get Payment Detail URL
     *
     */
    vpa_102.prototype.getpaymentUrl = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/vpa/v1/payment/GetPaymentDetailURL';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }
        if (parameters['x-client-transaction-id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter from header parameters: x-client-transaction-id'));
            return deferred.promise;
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            key: fs.readFileSync(this.keyFile),
            cert: fs.readFileSync(this.certificateFile),
            headers: headers,
            body: body
        };

        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            console.log("response" + JSON.stringify(response));
            if (error) {
                console.log("error " + JSON.stringify(error));
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Resend Payment
     * @method
     * @name vpa_102#resendPayment
     * @param {string} xClientTransactionId - 
     * @param {} resendPaymentPOSTPayload - Resource body for Resend Payment
     *
     */
    vpa_102.prototype.resendPayment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/vpa/v1/payment/ResendPayment';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }
        if (parameters['x-client-transaction-id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter from header parameters: x-client-transaction-id'));
            return deferred.promise;
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            key: fs.readFileSync(this.keyFile),
            cert: fs.readFileSync(this.certificateFile),
            headers: headers,
            body: body
        };

        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            console.log("response" + JSON.stringify(response));
            if (error) {
                console.log("error " + JSON.stringify(error));
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get Payment Details
     * @method
     * @name vpa_102#getpaymentDetails
     * @param {string} xClientTransactionId - 
     * @param {} getpaymentDetailsPOSTPayload - Resource body for Get Payment Details
     *
     */
    vpa_102.prototype.getpaymentDetails = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/vpa/v1/payment/GetPaymentDetails';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }
        if (parameters['x-client-transaction-id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter from header parameters: x-client-transaction-id'));
            return deferred.promise;
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            key: fs.readFileSync(this.keyFile),
            cert: fs.readFileSync(this.certificateFile),
            headers: headers,
            body: body
        };

        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            console.log("response" + JSON.stringify(response));
            if (error) {
                console.log("error " + JSON.stringify(error));
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Cancel Payment
     * @method
     * @name vpa_102#cancelPayment
     * @param {string} xClientTransactionId - 
     * @param {} cancelPaymentPOSTPayload - Resource body for Cancel Payment
     *
     */
    vpa_102.prototype.cancelPayment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/vpa/v1/payment/CancelPayment';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }
        if (parameters['x-client-transaction-id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter from header parameters: x-client-transaction-id'));
            return deferred.promise;
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            key: fs.readFileSync(this.keyFile),
            cert: fs.readFileSync(this.certificateFile),
            headers: headers,
            body: body
        };

        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            console.log("response" + JSON.stringify(response));
            if (error) {
                console.log("error " + JSON.stringify(error));
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };

    return vpa_102;
})();

exports.vpa_102 = vpa_102;