/*jslint browser: true, devel: true, white: false, debug: false, forin: true, newcap: false, unparam: false, sloppy: true, todo: false, vars: true, maxlen: 80*/
var PayPalAPI = function (myApiKey) {
	this.BUSINESS_NAME = "tosh0204@gmail.com";
	this.DEFAULT_CURRENCY = "USD";
	this.ENTRYPOINT = "https://api.sandbox.paypal.com/";
};

//PayPalAPI.addToCart = function (itemName, price, currency_code) {
//	currency_code = currency_code || PayPalAPI.DEFAULT_CURRENCY;
//	var target = "paypal";
//	var url = "https://www.sandbox.paypal.com/cgi-bin/webscr";
//	var params = {
//		// API Key/Business Info
//		"business" : PayPalAPI.BUSINESS_NAME,
//		// Shopping Cart Info
//		"cmd" : "_cart",
//		"add" : "1",
//		// Purchasing Item Info
//		"item_name" : itemName,
//		"amount" : price,
//		"currency_code" : currency_code
//	};
//};
//
//PayPalAPI.viewCart = function () {
//
//};
//


PayPalAPI.importPayments = function () {
	var path = "/v1/payments/payment/"
	var method = "GET"
	var getPayment = function (paymentID) {
	};

	var getPaymentList = function () {
		var params = {
			'count': 20, //max
		};
	};
};

