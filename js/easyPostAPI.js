//https://github.com/vickyteke/easypost_parse/blob/master/easypostapi.js
var EasyPostRequestor = function (myApiKey) {
	this.apiKey = myApiKey || apiKey;
	this.queryParams = {};

};

EasyPostRequestor.prototype.request = function () {

};

EasyPostRequestor.prototype.request = function(method, path, params, callback, parent) {
	var promise_ = new Parse.Promise();
	delete params.apiKey;
	this.encodeParams(params);
	var requestData = querystring.stringify(this.queryParams);

	path = '/v2' + path;
	var auth = 'Basic ' + new Buffer(apiKey + ":").toString('base64');

	var request_options = {
		host: 'api.easypost.com',
		port: '443',
		// host: 'localhost',
		// port: '5000',
		path: path,
		method: method,
		headers: {
			'Authorization': auth,
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': requestData.length
		}
	};

	Parse.Cloud.httpRequest({
		method: method,
		headers: {
			'Authorization': auth,
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		url: 'https://api.easypost.com:443' + path,
		body: params,
		success: function(httpResponse) {
			var body = httpResponse.data;
			var parsedResponse = responseToResource(body);
			console.log(JSON.stringify(body));
			if (parent !== undefined && parent !== null) {
				for (var attr in parsedResponse) {
					if (attr === 'cls') {
						continue;
					}
					parent[attr] = parsedResponse[attr];
				}
				callback(null, parent);
				promise_.resolve(parent);
			} else {
				callback(null, parsedResponse);
				promise_.resolve(parsedResponse);
			}
		},
		error: function(httpResponse) {
			console.log('Request failed with response code ' + JSON.stringify(httpResponse));

			callback(httpResponse);
			promise_.reject();
		}
	});

	return promise_;
}
EasyPostRequestor.prototype.encodeParams = function(params, prefix) {
	if (typeof params !== 'object') {
		return params;
	}

	var newParams = [];

	Object.keys(params).forEach(function(key) {
		if (params[key] === null) {
			return;
		}

		var newKey = key;
		if (prefix && key) {
			var newKey = prefix + '[' + key + ']';
		}

		if (params[key] instanceof easypost.Resource) {
			params[key] = {
				id: params[key].id
			};
		}

		if (typeof params[key] === 'object') {
			newParams.push(this.encodeParams(params[key], newKey));
		} else {
			this.queryParams[newKey] = params[key];
		}

	}, this);

	return newParams;
}
