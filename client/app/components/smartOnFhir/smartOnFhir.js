import jQuery from 'jquery';

let _instance = null;

class smartOnFhir {

	constructor() {

	}

	static instance() {
		if(_instance == null) {
			_instance = new smartOnFhir();
		}
		return _instance;
	}

	run() {

		//this.clearAuthToken();
		var settings = this.getSettings();

		//console.log(settings);

		if(process.env.NODE_ENV == 'production') {
			// Production
			console.log("--Production settings--");
	        this.initialize({
	          client_id: "5HsYz3hbBWzcQZMhNXnrfrDCbp0a",
	          scope: "*",
	          secret: "0jBMCpnZAP5PiQfBAWD8d8Smfv4a" 
	        });
    	} else {
	        // Development
			console.log("--Development settings--");
	        this.initialize({
	        	client_id: "V50ow8oIgViCBsLW5gvvXyCDjBIa",
	        	scope: "*",
	        	secret: "EFdhhfiLum1hx9zNqD3HaPikmaQa"
	        });
    	}


		if (!this.hasAuthToken()) {
			console.log("OAuth2 token is not set.");
			if (this.urlParam("code")) {
				this.completeAuth();
			} else {
				console.log("Authorizing...");
				this.authorize();
			}
		} else {
			console.log("OAuth2 token is set.");
		}
	}

	urlParam(p) {
	  var query = location.search.substr(1);
	  var data = query.split("&");
	  var result = [];

	  for(var i=0; i<data.length; i++) {
	    var item = data[i].split("=");
	    if (item[0] === p) {
	      var res = item[1].replace(/\+/g, '%20');
	      result.push(decodeURIComponent(res));
	    }
	  }

	  if (result.length === 0){
	    return null;
	  }
	  return result[0];
	}

	getRedirectURI () {
	    return (window.location.protocol + "//" + window.location.host + window.location.pathname).match(/(.*\/)[^\/]*/)[1];
	}

	refreshApp () {
	    window.location.href = this.getRedirectURI();
	}

	initialize (settings) {

		var baseURL = window.location.protocol + "//" + window.location.host;

	    this.setSettings({
	        client_id: settings.client_id,
	        secret: settings.secret,
	        scope: settings.scope + " launch",
	        launch_id: this.urlParam("launch"),
	        api_server_uri: baseURL + "/fhir"
	    });
	}

	completeAuth () {
		var smartOnFhir = this;
	    FHIR.oauth2.ready(function(){
	       
	    });
	}

	writeData (key, data) {
	    sessionStorage[key] = JSON.stringify(data);
	}

	readData (key) {
	    var data = sessionStorage[key];
	    if (data) {
	        return JSON.parse(sessionStorage[key]);
	    } else {
	        return data;
	    }
	}

	clearData (key) {
	    delete sessionStorage[key];
	}

	hasAuthToken () {
	    return sessionStorage.tokenResponse !== undefined;
	}

	clearAuthToken () {
	    delete sessionStorage.tokenResponse;
	}

	getSettings () {
	    return this.readData("app-settings");
	}

	setSettings (data) {
	    this.writeData ("app-settings", data);
	}

	getSession (key) {
	    return this.readData(key);
	}

	setSession (data) {
	    var key = Math.round(Math.random()*100000000).toString();
	    this.writeData (key, data);
	    return key;
	}

	authorize () {
	    var settings = this.getSettings();

	    var baseURL = window.location.protocol + "//" + window.location.host;
	    
	    FHIR.oauth2.authorize({
	        client: {
	            client_id: settings.client_id,
	            scope:  settings.scope,
	            launch: settings.launch_id,
	            secret : settings.secret
	        },
            provider : {
            	oauth2 : {
	            	authorize_uri : baseURL + '/oauth2/authorize',
	            	token_uri : baseURL + '/oauth2/token'
	            }
            },
	        server: settings.api_server_uri
	    });
	}
};

export default smartOnFhir;
