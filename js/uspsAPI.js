var UspsAPI = function () {
};

UspsAPI.API_USER_ID = "";

UspsAPI.setApiId = function (userID) {
	UspsAPI.API_USER_ID = userID;
};

UspsAPI.AddressLookup = {
	"API_NAME" : "Verify",
	"getAddressXML" : function () {
		var xml = "";
		return xml;
	},
	"getRequestConfig" : function () {
		var getAddressXML = function () {

		};
		return {
			method:	'POST',
			url:	"http://production.shippingapis.com/ShippingAPI.dll",
			params:	{
				"XML" : getAddressXML(),
				"API" : API_Name
			}
		};
	}
};

UspsAPI.TrackAndConfirm = {
	"API_NAME" : "TrackV2",
	"getRequestConfig" : function (trackID) {
		var xml = '<?xml version="1.0" encoding="UTF-8" ?><TrackRequest USERID=”' + UspsAPI.API_USER_ID + '”><TrackID ID="' + trackID + '"></TrackID></TrackRequest>'

		return {
			method:	'POST',
			url:	"http://production.shippingapis.com/ShippingAPI.dll",
			params:	{
				"XML" : xml,
				"API" : UspsAPI.TrackAndConfirm.API_NAME
			}
		};
	}
};

UspsAPI.RateCalculator = {
	"API_NAME" : "RateV4",
	"lbsToLbsOunces" : function (lbs) {//gets float weight in pounds and translates to lbs and ounces
		var totalPounds = Number(lbs);
		var totalOunces = totalPounds * 16;
		var remainderOunces = totalOunces % 16;

		return {
			"pounds" :	Math.floor(totalPounds),
			"ounces" :	Math.ceil(remainderOunces)
		};
	},
	"getRequestConfig" : function (weight, zipOrig, zipDest) {
		var lbsToLbsOunces = function (lbs) {//gets float weight in pounds and translates to lbs and ounces
			var totalPounds = Number(lbs);
			var totalOunces = totalPounds * 16;
			var remainderOunces = totalOunces % 16;

			return {
				"pounds" :	Math.floor(totalPounds),
				"ounces" :	Math.ceil(remainderOunces)
			};
		};

		var getEstimateXML = function (weight, zipOrig, zipDest) {
			var xml = '<RateV4Request USERID="' + UspsAPI.API_USER_ID + '"><Revision>2</Revision>';
			xml += '<Package ID="Estimate"><Service>MEDIA</Service><ZipOrigination>' + zipOrig + '</ZipOrigination><ZipDestination>' + zipDest + '</ZipDestination><Pounds>' + lbsToLbsOunces(weight).pounds  + '</Pounds><Ounces>' + lbsToLbsOunces(weight).ounces + '</Ounces><Container/><Size>REGULAR</Size></Package>';
			xml += '</RateV4Request>';
			return xml;
		};
		return {
			method:	'POST',
			url:	"http://production.shippingapis.com/ShippingAPI.dll",
			params:	{
				"XML" : getEstimateXML(weight, zipOrig, zipDest),
				"API" : UspsAPI.RateCalculator.API_NAME
			}
		};
	}
};
