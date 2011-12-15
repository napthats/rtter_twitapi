/*
 * Copyright (c) 2011 Otchy
 * This source file is subject to the MIT license.
 * http://www.otchy.net
 */
var TwitAPI = function(base, app) {
	// common values
	this.version = '0.2.0';
	this.base = !base ? 'http://taj-proxy.appspot.com' : base;
	this.app = !app ? 'twit-api-js' : app;
	this.w = window;
	this.d = document;
	this.cnt = 0;
	this.tk = false;
	this.ok = false;
	this.ag = false;
	this.ge = function(id){return this.d.getElementById(id);};
	this.ce = function(el){return this.d.createElement(el);};
	this.ac = function(e){this.d.body.appendChild(e);};
	this.rc = function(e){try{this.d.body.removeChild(e);}catch(e){}};
	this.fn = function(){return 'TwitApiFunc'+(++this.cnt);};
	
	// set styles
	var style = this.ce('style');
	this.d.getElementsByTagName('head')[0].appendChild(style);
	var ss = this.d.styleSheets[this.d.styleSheets.length - 1];
	ss.add = (function(){
		if (!!ss.addRule) {
			return ss.addRule;
		} else if (!!ss.insertRule) {
			return function(selector, style) {
				ss.insertRule(selector + '{' + style + '}', ss.cssRules.length);
			}
		}
	})();
	var body = /BackCompat/i.test(this.d.compatMode) ? this.d.body : this.d.documentElement;
	ss.add('div.twit-api-js',
		'margin: 0;' +
		'padding: 0;' +
		'border: 0;' +
		'color: #000;' +
		'font-size: 10pt;'
	);
	ss.add('div.twit-api-js button',
		'font-size: 10pt;' +
		'color: #fff;' +
		'border-radius: 10px;' +
		'-moz-border-radius: 10px;' +
		'-webkit-border-radius: 10px;' +
		'-o-border-radius: 10px;' +
		'-ms-border-radius: 10px;'
	);
	ss.add('#twit-api-js-bg',
		'position: absolute;' +
		'top: 0;' +
		'left: 0;' +
		'width: ' + body.scrollWidth + 'px;' +
		'height: ' + body.scrollHeight +'px;' +
		'background: #ccc;' +
		'opacity: 0.5;' +
		'filter: alpha(opacity=50);' +
		'z-index: 99998;' +
		'display: none;'
	);
	ss.add('#twit-api-js-pop',
		'position: fixed;' +
		'_position: absolute;' +
		'top: 200px;' +
		'left: 50%;' +
		'width: 500px;' +
		'margin: -80px 0 0 -250px;' +
		'z-index: 99999;' +
		'display: none;'
	);
	ss.add('#twit-api-js-cont',
		'padding: 10px;' +
		'border: solid 5px #3aa4c8;' +
		'border-radius: 10px;' +
		'-moz-border-radius: 10px;' +
		'-webkit-border-radius: 10px;' +
		'-o-border-radius: 10px;' +
		'-ms-border-radius: 10px;' +
		'background: #9ae4e8;' +
		'box-shadow: 5px 5px 10px #333;' +
		'-moz-box-shadow: 5px 5px 10px #333;' +
		'-webkit-box-shadow: 5px 5px 10px #333;' +
		'-o-box-shadow: 5px 5px 10px #333;' +
		'-ms-box-shadow: 5px 5px 10px #333;' +
		'filter:progid:DXImageTransform.Microsoft.Shadow(Color=#333333,Strength=10,Direction=135);zoom:1;'
	);
	ss.add('#twit-api-js-div1',
		'text-align: right;'
	);
	ss.add('#twit-api-js-cancel',
		'background: #f66;'
	);
	ss.add('#twit-api-js-div4',
		'text-align: center;'
	);
	ss.add('#twit-api-js-auth',
		'padding: 2px 30px;' +
		'background: #3aa4c8;'
	);
	ss.add('#twit-api-js-div5',
		'margin-top: 20px;'
	);
	ss.add('#twit-api-js-div6',
		'text-align: center;'
	);
	ss.add('#twit-api-js-continue',
		'padding: 2px 30px;' +
		'background: #3aa4c8;'
	);
	
	// append html
	var bg = this.ce('div');
	bg.className = 'twit-api-js';
	bg.id = 'twit-api-js-bg';
	this.ac(bg);
	var pop = this.ce('div');
	pop.className = 'twit-api-js';
	pop.id = 'twit-api-js-pop';
	pop.innerHTML = 
		'<div class="twit-api-js" id="twit-api-js-cont">' +
		'<div class="twit-api-js" id="twit-api-js-div1"><button id="twit-api-js-cancel">キャンセル</button></div>' +
			'<div id="twit-api-js-waiting">' +
			'<div class="twit-api-js" id="twit-api-js-div2">Twitter 認証代理サーバに接続中です。少々お待ち下さい <span id="twit-api-js-loading"></span></div>' +
			'</div>' +
			'<div id="twit-api-js-connected">' +
			'<div class="twit-api-js" id="twit-api-js-div3">「認証」ボタンを押して、Twitter の OAuth 認証画面を開いて下さい。</div>' +
			'<div class="twit-api-js" id="twit-api-js-div4"><button id="twit-api-js-auth">認証</button></div>' +
			'<div class="twit-api-js" id="twit-api-js-div5">認証を許可して「認証 OK」と表示されたら「継続」ボタンを押して下さい。</div>' +
			'<div class="twit-api-js" id="twit-api-js-div6"><button id="twit-api-js-continue">継続</button></div>' +
			'</div>' +
		'</div>';
	this.ac(pop);
	var wait = this.ge('twit-api-js-waiting');
	var conn = this.ge('twit-api-js-connected');
	var load = this.ge('twit-api-js-loading');
	var tid = 0;
	
	// append event
	var api = this;
	this.ge('twit-api-js-cancel').onclick = function() {
		bg.style.display = 'none';
		pop.style.display = 'none';
		api.ok = false;
		clearInterval(tid);
	};
	this.ge('twit-api-js-auth').onclick = function() {
		var popup = api.w.open(api.authUrl, null, 'width=850,height=450');
	};
	this.ge('twit-api-js-continue').onclick = function() {
		bg.style.display = 'none';
		pop.style.display = 'none';
		api.ok = true;
		if (api.ag) {
			api.call(api.ag.method, api.ag.path, api.ag.func, api.ag.params);
			api.ag = false;
		}
	};
	
	// methods
	this.login = function(func) {
		var api = this;
		wait.style.display = 'block';
		conn.style.display = 'none';
		bg.style.display = 'block';
		pop.style.display = 'block';
		tid = setInterval(function() {
			var len = (load.innerHTML.length % 5) + 1;
			var str = '';
			for (var i=0; i<len; i++) {
				str += '.';
			}
			load.innerHTML = str;
		}, 200);
		api._call('authorize', null, function(json) {
			clearInterval(tid);
			if (json.taj_status == 'authorize') {
				api.tk = json.taj_token;
				api.authorize(json.url);
				if (!!func){func();}
			} else {
				alert(json.message);
			}
		}, null);
	};
	this.authorize = function(url) {
		wait.style.display = 'none';
		conn.style.display = 'block';
		this.authUrl = url;
	}
	this.call = function(method, path, func, params) {
		var api = this;
		if (!api.ok) {
			api.ag = {'method': method, 'path': path, 'func': func, 'params': params};
			api.login();
			return;
		}
		api._call(method, path, func, params);
	};
	this._call = function(method, path, func, params) {
		var api = this;
		var s = api.ce('script');
		var fn = api.fn();
		api.w[fn] = function(json) {
			if (json.taj_status == 'error') {
				alert(json.message);
			} else if (!!json.error) {
				alert(json.error);
			} else if (!!func) {
				func(json);
			}
			setTimeout(function() {
				try{
					delete api.w[fn];
				} catch(e) {
					api.w[fn] = null;
				}
				try{
					api.rc(s);
				} catch(e) {}
			}, 100);
		}
		var src;
		if (method == 'jsonp') {
			src = 'https://api.twitter.com/' + path + '.json';
		} else {
			src = api.base + '/' + method + '/' + api.app + '/';
			if (!!path) {
				src += path;
			}
		}
		src += '?callback=' + fn;
		if (!!api.tk && method != 'jsonp') {
			src += '&taj_token=' + api.tk;
		}
		if (!!params) {
			if (params instanceof String || typeof(params) == 'string') {
				if (params.length > 0) {
					src += '&' + params;
				}
			} else {
				for (var key in params) {
					src += '&' + key + '=' + encodeURI(params[key]);
				}
			}
		}
		s.src = src;
		api.ac(s);
	};
};
