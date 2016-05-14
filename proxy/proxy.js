export default function() {

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	var express  = require('express');
	var app      = express();
	var httpProxy = require('http-proxy');
	var apiProxy = httpProxy.createProxyServer({
			ws:             true,
			secure:         false,
			changeOrigin:   true,
			prependPath:    false
	});

	apiProxy.on('proxyReq', function (proxyReq, req, res) {
  		//console.log('RAW Request to the target');
  		//console.log(proxyReq);
	});

	//
	// Listen for the `error` event on `proxy`.
	apiProxy.on('error', function (err, req, res) {
	  res.writeHead(500, {
	    'Content-Type': 'text/plain'
	  });

	  res.end('Something went wrong. And we are reporting a custom error message.');
	});

	var serverAngularJS = 'http://localhost:3000',
	    serverFHIR = 'https://hackday28apr2016.healthforge.io/fhir/',
	    serverOAuth2 = 'https://hackday28apr2016.healthforge.io/oauth2/',
	    serverAuth = 'https://hackday28apr2016.healthforge.io/authenticationendpoint/';

	app.all("/fhir/*", function(req, res) {
	    apiProxy.web(req, res, {target: serverFHIR});
	});

	app.all("/oauth2/*", function(req, res) {
	    apiProxy.web(req, res, {target: serverOAuth2});
	});

	app.all("/authenticationendpoint/*", function(req, res) {
	    apiProxy.web(req, res, {target: serverAuth});
	});

	app.all("/*", function(req, res) {
	    apiProxy.web(req, res, {target: serverAngularJS});
	});

	console.log("Proxy ready (Ctrl+C to terminate)...");

	app.listen(4000);
}