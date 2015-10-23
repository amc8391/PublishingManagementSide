	// create the module and name it bookApp
	var myApp = angular.module('myApp', ['ngRoute']);

	
	
	// configure our routes
	myApp.config(function($routeProvider) {
		$routeProvider.
			/*/ route for the home page
			.when('/', {
				templateUrl : 'home.html',
				controller  : 'mainController'
			})*/
			// route for the book page
			when('/book', {
				templateUrl : 'BookView.html',
				controller  : 'bookController'
			}).
			// route for the settings page
			when('/search', {
				templateUrl : 'search.html',
				controller  : 'searchController'
			}).
			when('/customer',{
				templateUrl : 'customer.html',
				controller  : 'customerController'
			}).
			otherwise({
				redirectTo  : '/search'
			});
	});

	// create the controller and inject Angular's $scope
	

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

		book.getBookInfo = function () {
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
			$http.get("http://52.25.95.1:8080/testingPublishing/service/book/getBook?bookID=3")
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
					console.log(book);
				}, function(response) {
					console.log("FAILURE");
					console.log(response);
				});
			//var info = JSON.parse('{"id":2,"isbn":"isbn1234","authorID":12,"author":null,"title":"testTitle","count":400,"price":12.5,"rating":0}');
		};
	});

	myApp.controller('searchController', function($scope) {
		$scope.message = 'I am the search page.';
	});
	
	myApp.controller('customerController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});
	
	
