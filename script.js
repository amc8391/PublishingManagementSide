var SERVER_ADDRESS = "http://52.25.95.1:8080/HttpServe/api/service/" 
	// create the module and name it bookApp
	var myApp = angular.module('myApp', ['ngRoute']);

	
	
	// configure our routes
	myApp.config(function($routeProvider) {
		$routeProvider.
			// route for the home page
			when('/', {
				templateUrl : 'Home.html',
				controller  : 'HomeController'
			}).
			when('/book', {
				templateUrl : 'BookView.html',
				controller  : 'BookController'
			}).
			when('/bookadd', {
				templateUrl : 'BookAdd.html',
				controller  : 'BookController'
			}).
			when('/bookupdate', {
				templateUrl : 'BookUpdate.html',
				controller  : 'BookController'
			}).
			when('/Buy', {
				templateUrl : 'Buy.html',
				controller  : 'buyController'
			}).
			when('/customer',{
				templateUrl : 'Customer.html',
				controller  : 'customerController'
			}).
            when('/warehouse', {
                templateUrl : 'WarehouseView.html',
                controller  : 'WarehouseController'
            }).
			when('/404',{
				templateUrl : '404.html',
				controller  : 'NotFoundController'
			}).
			when('/login',{
				templateUrl	: 'login.html',
				controller	: 'LoginController'
			}).
			otherwise({
				redirectTo  : '/404'
			});
	});


	// create the controllers and inject Angular's $scope

	myApp.controller('BookController', function($scope, $http) {
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

		book.getBookInfo = function (lookupID) {
			console.log("getBookInfo called");
			//        var req = {
			//            method: 'GET',
			//            url: "http://ec2-52-23-163-68.compute-1.amazonaws.com:8080/testingPublishing/service/book/getBook?bookID="+searchedID,
			//            headers: {
			//                'Accept': 'application/json',
			//                'Upgrade-Insecure-Requests' : 1,
			//                'Access-Control-Allow-Credentials': true,
			//                'Access-Control-Allow-Origin' : 'http://ec2-52-23-163-68.compute-1.amazonaws.com' //VERY BAD
			//            }
			//        }
			//        var info = JSON.parse($http(req).data);
			$http.get( SERVER_ADDRESS + "book/getBook?bookID=" + lookupID)
				.then(function(response) {
					console.log("SUCCESS");
					console.log(response.data);
					var info = response.data;
					book.id = info.id;
					book.title = info.title;
					book.isbn = info.isbn;
					book.authorID = info.authorID;
					book.author = info.author;
					book.title = info.title;
					book.count = info.count;
					book.price = info.price;
					book.rating = info.rating;
					book.genre = info.genre;
					console.log(book);
				}, function(response) {
					console.log("FAILURE");
					console.log(response);
					book.id 	= -1;
					book.title 	= "Error: Could not find book";
					book.isbn 	= "";
					book.authorID 	= -1;
					book.author 	= "";
					book.count 	= 0;
					book.price	= 0;
					book.rating 	= 0;
					book.genre 	= "";

				});
			//var info = JSON.parse('{"id":2,"isbn":"isbn1234","authorID":12,"author":null,"title":"testTitle","count":400,"price":12.5,"rating":0}');
		};

		book.addBook = function () {
			var url = SERVER_ADDRESS + "book/addBook?isbn=" + book.isbn + "&authorID=" + book.authorID + "&title=" + book.title + "&count=" + book.count + "&price=" + book.price + "&genre=" + book.genre;
			
			$http.get( url )
				.then(function(response) {
					console.log("SUCCESS");
					console.log(response);
				}, function(response) {
					console.log("FAILURE");
					console.log(response);
				});
		};

		book.updateCount = function (){

			var url = SERVER_ADDRESS + "book/updateCount?bookID=" + book.id + "&count=" + book.count;
			
			$http.get( url )
				.then(function(response) {
					console.log("SUCCESS");
					console.log(response);
				}, function(response) {
					console.log("FAILURE");
					console.log(response);
				});
		};
	});

	myApp.controller('buyController', function($scope) {
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
	
	myApp.controller('customerController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});
	
	myApp.controller('indexController', function($scope) {
		$scope.message = 'Look! I am the main page.';
	});
	
	myApp.controller('NotFoundController', function($scope) {
		console.log("using NotFoundController");
		$scope.message = '404: Page not found.';
	});

	myApp.controller('HomeController', function($scope) {
		$scope.message = 'Welcome to PMS.';
	});
	
	myApp.controller('WarehouseController', function($scope, $http) {
		$scope.message = 'Look! I am a warehouse page.';
		//TODO make this change for who's logged in
		$scope.uid = 1
		$scope.getWarehouse = function( uid ){
			var url = SERVER_ADDRESS + "book/warehouse?uid=" + uid;
			var userData = null;
			console.log("Making GET request to " + url);
			$http.get( url )
				.then(function(response) {
					console.log("SUCCESS");
					console.log(response);
					$scope.bookList = JSON.parse(response.data);
				}, function(response) {
					console.log("FAILURE");
					console.log(response);
					console.log(userData);
				});
		};
		//init page with this
		$scope.getWarehouse($scope.uid)
	});

	myApp.controller('LoginController', function($scope, $http) {
		$scope.message = 'Look! I am a Login page.';

		$scope.tryLogin = function(){
			//-1	fail case
			//UID	pass case
			var url = SERVER_ADDRESS + "login/attempt";
			var userData = null;
			console.log("Making POST request to " + url);
			$http.post( url, {"username":$scope.username, "password":$scope.password}, null)
				.then(function(response) {
					console.log("SUCCESS");
					console.log(response);
					userData = JSON.parse(response.data);
					if(userData.uid === -1){
						$scope.message = 'Invalid Login!!';
					}
					console.log(userData);
				}, function(response) {
					console.log("FAILURE");
					console.log(response);
					console.log(userData);
				});
		};
	});

    myApp.factory('loginService', function($http){
        var loginServiceInstance;

        loginServiceInstance.tryLogin = function(username, password){
			//-1	fail case
			//UID	pass case
			var url = SERVER_ADDRESS + "login/attempt";
			var userData = null;
			console.log("Making POST request to " + url);
			$http.post( url, {"username":username, "password":password}, null)
				.then(function(response) {
					console.log("SUCCESS");
					console.log(response);
					userData = JSON.parse(response.data);
					if(userData.uid === -1){
						$scope.message = 'Invalid Login!!';
                        return false;
					} else {
                        return true;
                    }
					console.log(userData);
				}, function(response) {
					console.log("FAILURE");
					console.log(response);
					console.log(userData);
                    return false;
				});
		};

        loginServiceInstance.currentUser = null;
        loginServiceInstance.authenticated = false;

        return loginServiceInstance;
    })
