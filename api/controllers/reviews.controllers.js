var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(req, res){
	var hotelId = req.params.hotelId;
	console.log("Get hotelId ", hotelId);

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, doc){
			var response = {
				status : 200,
				message : doc
			};

			console.log(doc)
			if (err) {
				console.log("Error finding the Hotel");
				response.status = 500;
				response.message = err;
			}
			else if (!doc) {
				response.status = 404;
				response.message = {"message" : "Hotel not found"};
			}
			else if(!doc.reviews){
				//response.status = 404;
				response.message = {};
			}
			else{
				response.message = doc.reviews;
			}
			res
				.status(response.status)
				.json(response.message)
		});

};

module.exports.reviewGetOne = function(req, res){

	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;
	console.log("Get reviewId " + reviewId + "for hotelId "+hotelId);

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, hotel){
			var review = hotel.reviews.id(reviewId);
			var response = {
			status : 200,
			message : hotel
		};

		if (err) {
			console.log("Error finding the Hotel");
			response.status = 500;
			response.message = err;
		}
		else if (!hotel) {
			response.status = 404;
			response.message = {"message" : "Hotel not found"};
		}
		else if(!hotel.reviews){
			response.status = 404;
			response.message = {"message" : "No Reviews for this Hotel"};
		}
		else if(!review){
			response.status = 404;
			response.message ={"message" : "Review not found"};
		}
		else{
			response.message = review;
		}


		console.log("Return hotel", hotel);
		
		res
			.status(response.status)
			.json(response.message)
		});
};



var _addReview = function(req, res, hotel){

	hotel.reviews.push({
		name : req.body.name,
		rating : parseInt(req.body.rating, 10),
		review : req.body.review
	});

	hotel.save(function(err, hotelUpdated){
		if(err){
			res
				.status(500)
				.json(err);
		}else{
			res
				.status(201)
				.json(hotelUpdated.reviews[hotelUpdated.reviews.length -1]);
		}
	});
};

module.exports.reviewsAddOne = function(req, res){
	var hotelId = req.params.hotelId;
	console.log("Get hotelId ", hotelId);

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, doc){
			var response = {
				status : 200,
				message : doc
			};

			console.log(doc)
			if (err) {
				console.log("Error finding the Hotel");
				response.status = 500;
				response.message = err;
			}
			else if (!doc) {
				response.status = 404;
				response.message = {"message" : "Hotel not found"};
			}
			if (doc) {
				_addReview(req, res, doc);
			}else{
				res
				.status(response.status)
				.json(response.message)
			}
			
		});
};

module.exports.reviewUpdateOne = function(req, res){
	
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;
	console.log("Get reviewId " + reviewId + "for hotelId "+hotelId);

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, hotel){
			var reviewUpdated = hotel.reviews.id(reviewId);
			var response = {
			status : 200,
			message : hotel
		};

		if (err) {
			console.log("Error finding the Hotel");
			response.status = 500;
			response.message = err;
		}
		else if (!hotel) {
			response.status = 404;
			response.message = {"message" : "Hotel not found"};
		}
		else if(!hotel.reviews){
			response.status = 404;
			response.message = {"message" : "No Reviews for this Hotel"};
		}
		else if(!reviewUpdated){
			response.status = 404;
			response.message ={"message" : "Review not found"};
		}

		if (response.status != 200) {
			res
				.status(response.status)
				.json(response.message)
		}
		else{
			reviewUpdated.name = req.body.name;
			reviewUpdated.rating = parseInt(req.body.rating);
			reviewUpdated.review = req.body.review;

			hotel.review = reviewUpdated;

			hotel.save(function(err, hotelUpdated){
				if (err) {
					res
						.status(500)
						.json(err);
				}
				else{
					res
						.status(204)
						.json();
				}
			})
		}

		
		});
};


module.exports.reviewDeleteOne = function(req, res){

	
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;
	console.log("Get reviewId " + reviewId + "for hotelId "+hotelId);

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, hotel){
			var reviewUpdated = hotel.reviews.id(reviewId);
			var response = {
			status : 200,
			message : hotel
		};

		if (err) {
			console.log("Error finding the Hotel");
			response.status = 500;
			response.message = err;
		}
		else if (!hotel) {
			response.status = 404;
			response.message = {"message" : "Hotel not found"};
		}
		else if(!hotel.reviews){
			response.status = 404;
			response.message = {"message" : "No Reviews for this Hotel"};
		}
		else if(!reviewUpdated){
			response.status = 404;
			response.message ={"message" : "Review not found"};
		}

		if (response.status != 200) {
			res
				.status(response.status)
				.json(response.message)
		}
		else{
			
			hotel.reviews.id(reviewId).remove();

			hotel.save(function(err, hotelUpdated){
				if (err) {
					res
						.status(500)
						.json(err);
				}
				else{
					res
						.status(204)
						.json();
				}
			})
		}

		
		});
}