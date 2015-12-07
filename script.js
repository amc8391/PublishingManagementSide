var SERVER_ADDRESS = "http://52.25.95.1:8080/HttpServe/api/service/";
    // create the module and name it bookApp
var myApp = angular.module('myApp', ['ngRoute']);



// configure our routes
myApp.config(function ($routeProvider) {
    $routeProvider.
        // route for the home page
        when('/', {
            templateUrl:	'Home.html',
            controller:		'HomeController'
        }).
		when('/book', {
			templateUrl:	'BookView.html',
			controller:		'BookController'
		}).
		when('/bookadd', {
			templateUrl:	'BookAdd.html',
			controller:		'BookController'
		}).
		when('/bookupdate', {
			templateUrl:	'BookUpdate.html',
			controller:		'BookController'
		}).
		when('/Buy', {
			templateUrl:	'Buy.html',
			controller:		'buyController'
		}).
		when('/customer', {
			templateUrl:	'Customer.html',
			controller:		'customerController'
		}).
		when('/warehouse', {
			templateUrl:	'WarehouseView.html',
			controller:		'WarehouseController'
		}).
		when('/404', {
			templateUrl:	'404.html',
			controller:		'NotFoundController'
		}).
		when('/uspsTest', {
			templateUrl:	'USPSTests.html',
			controller:		'USPSTestsController'
		}).
		when('/login', {
			templateUrl:	'login.html',
			controller:		'LoginController'
		}).
		otherwise({
			redirectTo:		'/404'
		});
});


// create the controllers and inject Angular's $scope

myApp.controller('BookController', function ($scope, $http, loginService) {
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
        console.log("getBookInfo called");
        $http.get(SERVER_ADDRESS + "book/getBook?bookID=" + lookupID)
            .then(function (response) {
                console.log("SUCCESS");
                console.log(response.data);
                var info = response.data;
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
                console.log(book);
            }, function (response) {
                console.log("FAILURE");
                console.log(response);
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
                    console.log("SUCCESS");
                    console.log(response);
                }, function (response) {
                    $scope.message = "Failure to add " + book.title;
                    console.log("FAILURE");
                    console.log(response);
                });
        } else {
            $scope.message = "Please log in before adding a book";
            console.log("must log in first");
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
    $scope.message = loginService.loginMessage;
});

myApp.controller('USPSTestsController', function ($scope, $http, loginService) {
	var uspsApiUserID = "714PERSO4882";
	UspsAPI.setApiId(uspsApiUserID)

	this.getEstimate = function () {
		var requestConfig = UspsAPI.RateCalculator.getRequestConfig($scope.weight, $scope.zipOrig, $scope.zipDest);
		$http(requestConfig).then(function (response) {
			console.log("SUCCESS");
			console.log(response);
			$scope.status = "SUCCESS";
			$scope.response = response;
		}, function (response) {
			console.log("FAILURE");
			console.log(response);
			$scope.response = "FAILURE";
		});
	};

	$scope.message = "Hey there; test out some USPS stuff";

	$scope.weight = 5.0;
	$scope.zipOrig = '07047';
	$scope.zipDest = '14623';
	this.getEstimate();
});

myApp.factory('loginService', function ($http) {
    var loginServiceInstance = {
        currentUser: null,
        authenticated: false,
        loginMessage: 'Please log in or sign up to use PMS',
        //            navbarText : function(){
        //                if(loginServiceInstance.authenticated){
        //                    return 'Please Log In';
        //                } else {
        //                    return 'Logged in as ' + currentUser.username;
        //                }
        //            },

        tryLogin: function (username, password) {
            //-1	fail case
            //UID	pass case
            var url = SERVER_ADDRESS + "login/attempt";
            var userData = null;
            console.log("Making POST request to " + url);
            $http.post(url, {
				"username": username,
				"password": password
			}, null)
                .then(function (response) {
                    console.log("SUCCESS");
                    console.log(response);
                    userData = response.data;
                    if (userData.uid !== -1) {
                        loginServiceInstance.authenticated = true;
                        loginServiceInstance.currentUser = userData;
                        loginServiceInstance.updateLoginMessage();
                    }
                    console.log(userData);
                }, function (response) {
                    loginServiceInstance.authenticated = false;
                    loginServiceInstance.currentUser = null;
                    loginServiceInstance.updateLoginMessage();
                    console.log("FAILURE");
                    console.log(response);
                    console.log(userData);
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
