var bookApp = angular.module('bookApp', [])
	.controller('BookController', function ($http) {
		
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
			var info = JSON.parse('{"id":2,"isbn":"isbn1234","authorID":12,"author":null,"title":"testTitle","count":400,"price":12.5,"rating":0}');
			book.id = info.id;
			book.title = "asdf";
			book.isbn = info.isbn;
			book.authorID = info.authorID;
			book.author = info.author;
			book.title = info.title;
			book.count = info.count;
			book.price = info.price;
			book.rating = info.rating;
		};
	});