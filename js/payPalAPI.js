/*jslint browser: true, devel: true, white: false, debug: false, forin: true, newcap: false, unparam: false, sloppy: true, todo: false, vars: true, maxlen: 80, maxerr: 0*/
var PayPalAPI = function (myApiKey) {
	this.BUSINESS_NAME = "tosh0204@gmail.com";
	this.DEFAULT_CURRENCY = "USD";
};

PayPalAPI.addToCart = function (itemName, price, currency_code) {
	currency_code = currency_code || PayPalAPI.DEFAULT_CURRENCY;
	var target = "paypal";
	var url = "https://www.sandbox.paypal.com/cgi-bin/webscr";
	var params = {
		// API Key/Business Info
		"business" : PayPalAPI.BUSINESS_NAME,
		// Shopping Cart Info
		"cmd" : "_cart",
		"add" : "1",
		// Purchasing Item Info
		"item_name" : itemName,
		"amount" : price,
		"currency_code" : currency_code
	};
};

PayPalAPI.viewCart = function () {

};
//    <form target="paypal" action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post">
//        <!-- Identify your business so that you can collect the payments. -->
//        <input type="hidden" name="business" value="tosh0204@gmail.com">
//        <!-- Specify a PayPal Shopping Cart Add to Cart button. -->
//        <input type="hidden" name="cmd" value="_cart">
//        <input type="hidden" name="add" value="1">
//        <!-- Specify details about the item that buyers will purchase. -->
//        <input type="hidden" name="item_name" value={{book.title}}>
//        <input type="hidden" name="amount" value={{book.price}}>
//        <input type="hidden" name="currency_code" value="USD">
//        <!-- Display the payment button. -->
//        <input type="image" name="submit" border="0" src="https://www.paypal.com/en_US/i/btn/btn_cart_LG.gif" alt="PayPal - The safer, easier way to pay online">
//        <img alt="" border="0" width="1" height="1" src="https://www.paypal.com/en_US/i/scr/pixel.gif">
//    </form>
