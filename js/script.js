/*jslint browser: true, devel: true, bitwise: false, debug: false, eqeq: false, forin: true, unparam: false, sloppy: true, vars: true*/
var SERVER_ADDRESS = "http://52.25.95.1:8080/HttpServe/api/service/";
    // create the module and name it bookApp
var myApp = angular.module('myApp', ['ngRoute']);



// configure our routes
myApp.config(function ($routeProvider) {
    $routeProvider.
        // route for the home page
        when('/', {
            templateUrl:	'html/Home.html',
            controller:		'HomeController'
        }).
		when('/book', {
			templateUrl:	'html/BookView.html',
			controller:		'BookController'
		}).
		when('/bookadd', {
			templateUrl:	'html/BookAdd.html',
			controller:		'BookController'
		}).
		when('/bookupdate', {
			templateUrl:	'html/BookUpdate.html',
			controller:		'BookController'
		}).
		when('/Buy', {
			templateUrl:	'html/Buy.html',
			controller:		'buyController'
		}).
		when('/customer', {
			templateUrl:	'html/Customer.html',
			controller:		'customerController'
		}).
		when('/warehouse', {
			templateUrl:	'html/WarehouseView.html',
			controller:		'WarehouseController'
		}).
		when('/404', {
			templateUrl:	'html/404.html',
			controller:		'NotFoundController'
		}).
		when('/alerts', {
			templateUrl:	'html/Alerts.html',
			controller:		'AlertsController'
		}).
		when('/easyposttests', {
			templateUrl:	'html/EasyPostTests.html',
			controller:		'EasyPostTestsController'
		}).
		when('/login', {
			templateUrl:	'html/login.html',
			controller:		'LoginController'
		}).
		otherwise({
			redirectTo:		'/404'
		});
});


// create the controllers and inject Angular's $scope

myApp.controller('BookController', function ($scope, $http, $routeParams, loginService, pmsPrototypes) {
    var book = this;
    //to be eliminated once I figure out how to do this correctly
    book.id = "";
    book.isbn = "";
    book.authorID = "";
    book.author = "";
    book.title = "";
    book.count = "";
    book.price = "";
    book.rating = "";
	book.genre = "";
	book.weight = 0.0;
    $scope.message = "Book Operations";

    book.getBookInfo = function (lookupID) {
        $http.get(SERVER_ADDRESS + "book/getBook?bookID=" + lookupID)
            .then(function (response) {
                var info = response.data;
				b = new pmsPrototypes.book();

                book.id = info.id;
                book.title = info.title;
                book.isbn = info.isbn;
                book.authorID = info.authorID;
                book.author = info.author;
                book.count = info.count;
                book.price = info.price;
                book.rating = info.rating;
                book.genre = info.genre;
				book.weight = info.weight;
            }, function (response) {
                book.id = -1;
                book.title = "Error: Could not find book";
                book.isbn = "";
                book.authorID = -1;
                book.author = "";
                book.count = 0;
                book.price = 0;
                book.rating = 0;
                book.genre = "";

            });
        //var info = JSON.parse('{"id":2,"isbn":"isbn1234","authorID":12,"author":null,"title":"testTitle","count":400,"price":12.5,"rating":0}');
    };

    book.addBook = function () {
        if (loginService.authenticated) {
            var url = SERVER_ADDRESS + "book/addBook?isbn=" + book.isbn + "&authorID=" + book.authorID + "&title=" + book.title + "&count=" + book.count + "&price=" + book.price + "&genre=" + book.genre;

            $http.get(url)
                .then(function (response) {
                    $scope.message = "Successfully added " + book.title;
                }, function (response) {
                    $scope.message = "Failure to add " + book.title;
                });
        } else {
            $scope.message = "Please log in before adding a book";
        }
    };

    book.updateCount = function () {
        if (loginService.authenticated) {
            var url = SERVER_ADDRESS + "book/updateCount?bookID=" + book.id + "&count=" + book.count;

            $http.get(url)
                .then(function (response) {
                    console.log("SUCCESS");
                    console.log(response);
                }, function (response) {
                    console.log("FAILURE");
                    console.log(response);
                });
        } else {
            $scope.message = "Please log in before attempting to update a book's information";
        }
    };

	if ($routeParams.bookID !== null) {
		book.getBookInfo($routeParams.bookID);
	}
});

myApp.controller('buyController', function ($scope) {
    var book = this;
    //to be eliminated once I figure out how to do this correctly
    book.id = "";
    book.isbn = "";
    book.authorID = "";
    book.author = "";
    book.title = "";
    book.count = "";
    book.price = "";
    book.rating = "";
});

myApp.controller('customerController', function ($scope) {
    $scope.message = 'Look! I am an about page.';
});

myApp.controller('indexController', function ($scope) {
    $scope.message = 'Look! I am the main page.';
});

myApp.controller('NotFoundController', function ($scope) {
    console.log("using NotFoundController");
    $scope.message = '404: Page not found.';
});

myApp.controller('HomeController', function ($scope) {
    $scope.message = 'Welcome to PMS.';
});

myApp.controller('WarehouseController', function ($scope, $http, loginService) {
    if (loginService.authenticated) {
        $scope.message = 'Welcome, ' + loginService.currentUser.uid;
        $scope.getWarehouse = function (uid) {
            var url = SERVER_ADDRESS + "book/warehouse?uid=" + loginService.currentUser.uid;
            var userData = null;
            console.log("Making GET request to " + url);
            $http.get(url)
                .then(function (response) {
                    console.log("SUCCESS");
                    console.log(response);
                    $scope.bookList = response.data;
                }, function (response) {
                    console.log("FAILURE");
                    console.log(response);
                    console.log(userData);
                });
        };

    } else {
        $scope.message = 'Please log in to PMS to use the Warehouse feature';
        $scope.getWarehouse = function (uid) {
            $scope.bookList = null;
        };
    }
    //init page with this
    $scope.getWarehouse($scope.uid);
});

myApp.controller('LoginController', function ($scope, $http, loginService) {
    $scope.tryLogin = function () {
        loginService.tryLogin($scope.username, $scope.password);
        $scope.message = loginService.loginMessage;
    };
    $scope.loginService = loginService;
	$scope.loginButton = '<button type="button" class="btn btn-danger">' + $scope.message + '</button>';
    $scope.message = loginService.loginMessage;
});

myApp.controller('EasyPostTestsController', function ($scope, $http, $filter, loginService, pmsPrototypes) {
	var easyPostApiKey = "AamsQ2dRs4aBuMwgewqPaA";
	var epr = new EasyPostRequestor(easyPostApiKey);
	$scope.message = "Welcome to the easy posts test page";

	$scope.testPurchaseCreation = function () {
		var dateFormat = "MM-dd-yyyy";
		var EST = "-0500";
		var dateString = $filter('date')(Date.now(), dateFormat, EST);
		var testPurch = JSON.stringify(new pmsPrototypes.purchase(dateString, 12.50, 2, 2, null, "testPaypalID"));
		var url = SERVER_ADDRESS + "transaction/newPurchase";
		$http({
			'method' : 'POST',
			'url' : url,
			'data' : testPurch
		}).then(function (response) {
			console.log("SUCCESS");
			console.log(response);
		}, function (response) {
			console.log("FAILURE");
			console.log(response);
		});
	};

	$scope.testShipmentCreation = function () {

	};
});

myApp.controller('AlertsController', function ($scope, $http, loginService) {
	if (loginService.authenticated) {
		var url = SERVER_ADDRESS + "alerts/getAlerts?uid=" + loginService.currentUser.uid;
		$http.get(url)
			.then(function (response) {
				console.log("SUCCESS");
				console.log(response);
				$scope.alertList = response.data;
			}, function (response) {
				console.log("FAILURE");
				console.log(response);
			});
	} else {
		$scope.message = "Please log in to view your alerts";
	}
});

myApp.factory('pmsPrototypes', function () {
	var pmsPrototypesInstance = {
		'book' : function (t, aID, invCount, p, rat, is, gen, userID, lbs) {
			this.id = null;
			this.title = t;
			this.authorID = aID;
			this.inventoryCount = invCount;
			this.price = p;
			this.rating = rat;
			this.isbn = is;
			this.genre = gen;
			this.uid = userID;
			this.Weight = lbs;
		},
		'author' : function (n) {
			this.id = null;
			this.name = n;
		},
		'purchase' : function (d, tot, uID, bID, shipID, ppID) {
			this.id = null;
			this.date = d;
			this.total = tot;
			this.userID = uID;
			this.bookID = bID;
			this.shipmentID = shipID;
			this.paypalID = ppID;
		},
		'shipment' : function (sd, dd, stat, purID, uID, lbs, tID) {
			this.id = null;
			this.sendDate = sd;
			this.status = stat;
			this.purchaseID = purID;
			this.userID = uID;
			this.weight = lbs;
			this.trackingID = tID;
		},
		'user' : function (uname, pass) {
			this.id = null;
			this.username = uname;
			this.password = pass;
		},
		'alert' : function (mess, bID) {
			this.message = mess;
			this.bookID = bID;
		}
	};

	return pmsPrototypesInstance;
});

myApp.factory('loginService', function ($http) {
    var loginServiceInstance = {
        currentUser : null,
        authenticated : false,
        loginMessage : 'Please log in to use PMS',
        tryLogin : function (username, password) {
            //-1	fail case
            //UID	pass case
            var url = SERVER_ADDRESS + "login/attempt";
            var userData = null;
            $http.post(url, {
				"username": username,
				"password": password
			}, null)
                .then(function (response) {
                    userData = response.data;
                    if (userData.uid !== -1) {
                        loginServiceInstance.authenticated = true;
                        loginServiceInstance.currentUser = userData;
                        loginServiceInstance.updateLoginMessage();
                    }
                }, function (response) {
                    loginServiceInstance.authenticated = false;
                    loginServiceInstance.currentUser = null;
                    loginServiceInstance.updateLoginMessage();
                });
        },

        updateLoginMessage: function () {
            if (loginServiceInstance.authenticated) {
                loginServiceInstance.loginMessage = 'Logged in as ' + loginServiceInstance.currentUser.username;
            } else {
                loginServiceInstance.loginMessage = 'Please log in or sign up to use PMS';
            }
        }

    };
    return loginServiceInstance;
});
