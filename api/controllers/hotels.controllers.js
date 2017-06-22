//**This is mongos native driver.**
//**Replaced it with mongoose environment.**
//var hotelData = require('../data/hotel-data.json');
// var dbconn = require('../data/dbconnection.js');
// var ObjectID = require('mongodb').ObjectID;

var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');


var runGeoQuery = function(req, res){
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);

	//A geoJSON point
	var point = {
		type : "Point",
		coordinates : [lng, lat]
	};

	var geoOptions = {
		spherical : true,
		maxDistance : 2000,
		num : 5
	};

	Hotel
		.geoNear(point, geoOptions, function(err, results, stats){
			console.log("Geo results", results);
			console.log("Geo stats", stats);
			res
				.status(200)
				.json(results);
		});

};


module.exports.hotelGetAll = function(req, res){

	var offset = 0;
	var count = 5;
	var maxcount = 10;

	if(req.query && req.query.lat && req.query.lng){
		runGeoQuery(req, res);
		return;
	}


	if(req.query && req.query.offset){
		offset = parseInt(req.query.offset, 10);
	}

	if(req.query && req.query.count){
		count = parseInt(req.query.count, 10);
	}

	if( isNaN(offset) || isNaN(count)){
		res
			.status(400)
			.json( {"message" : "Offset and Count should be numbers"});
			return;
	}

	if (count > maxcount) {
		res
			.status(400)
			.json( {"message" : "Count limit of " + maxcount+" exceeded"});
		return;
	}

	Hotel
		.find()
		.skip(offset)
		.limit(count)
		.exec(function(err, hotels){
			if (err) {
				console.log("Error finding the Hotels");
				res
					.status(500)
					.json(err)
			}
			else {
				console.log("Found Hotels ", hotels.length);
				res
					.json(hotels);
				}
		});


	//*******//
	// var db = dbconn.get();
	// var collection = db.collection('hotels');

	// collection
	// 	.find()
	// 	.skip(offset)
	// 	.limit(count)
	// 	.toArray(function(err, docs){
	// 		if(err){
	// 			console.log("Error finding all the Hotels");
	// 		}
	// 		console.log("Found hotels", docs);
	// 		res
	// 			.status(200)
	// 			.json(docs);

	// 	});


	
};	

module.exports.hotelGetOne = function(req, res){

	var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);	

	Hotel
		.findById(hotelId)
		.exec(function(err, doc){
			var response ={
				status :200,
				message : doc
			};

			if (err) {
				console.log("Error finding the Hotel");
				response.status =500;
				response.message = err;
			}
			else if (!doc){
				response.status = 404;
				response.message = {"message" : "Hotel not found"};
			}
			res
				.status(response.status)
				.json(response.message)
				
		});

	// var db = dbconn.get();
	// var collection = db.collection('hotels');

	// console.log("Data for one hotel");
	// var hotelId = req.params.hotelId;
	// console.log("GET hotelId", hotelId);

	// collection
	// 	.findOne({
	// 		_id : ObjectID(hotelId)
	// 	}, function(err, doc){
	// 		res
	// 			.status(200)
	// 			.json( doc );
	// 	});
	
};


var _splitArray = function(input){
	var output;
	if (input && input.length >0) {
		output = input.split(";");
	}
	else{
		output =[];
	}
	return output;
};


module.exports.hotelsAddOne = function(req, res){
	

	Hotel
		.create({
			name : req.body.name,
			description : req.body.description,
			stars : parseInt(req.body.stars, 10),
			services : _splitArray(req.body.services),
			photos : _splitArray(req.body.photos),
			currency : req.body.currency,
			location : {
				address : req.body.address,
				coordinates : [
				parseFloat(req.body.lng),
				parseFloat(req.body.lat)
				]
			}

		}, function(err, hotel){
			if (err) {
				console.log("Error creating Hotel");
				res
					.status(400)
					.json(err)
			}
			else {
				console.log("Hotel created", hotel);
				res
					.status (201)
					.json(hotel)
			}
		});




	//**Native Mongo route**

	// var db = dbconn.get();
	// var collection = db.collection('hotels');
	// var newHotel;

	// console.log("Adding a new hotel");

	// if (req.body && req.body.name && req.body.stars) {

	// 	newHotel = req.body;
	// 	newHotel.stars = parseInt(req.body.stars, 10);

	// 	collection.insertOne(newHotel, function(err, response){
	// 		console.log(response.ops);
	// 		res
	// 			.status(201)
	// 			.json(response.ops);
	// 	});		
	// }
	// else{
	// 	console.log("Data missing from body");
	// 	res
	// 		.status(400)
	// 		.json( {message: "Required data missing from body"});
	// }
};


module.exports.hotelUpdateOne = function(req, res){


var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);	

	Hotel
		.findById(hotelId)
		.select("-reviews -rooms")
		.exec( function(err, doc){
			var response ={
				status :200,
				message : doc
			};

			if (err) {
				console.log("Error finding the Hotel");
				response.status =500;
				response.message = err;
			}
			else if (!doc){
				response.status = 404;
				response.message = {"message" : "Hotel not found"};
			}
			if (response.status != 200) {
				res
				.status(response.status)
				.json(response.message)	
			}
			else{
				doc.name = req.body.name;
				doc.description = req.body.description;
				doc.stars = parseInt(req.body.stars, 10);
				doc.services = _splitArray(req.body.services);
				doc.photos = _splitArray(req.body.photos);
				doc.currency = req.body.currency;
				doc.location = {
					address : req.body.address,
					coordinates : [
					parseFloat(req.body.lng),
					parseFloat(req.body.lat)
					]
				};

				doc.save(function(err, hotelUpdated){
					if(err){
						res
							.status(500)
							.json(err);
					}
					else{
						res
							.status(204)
							.json()
					}
				})

			}
		});


};

module.exports.hotelDeleteOne = function(req, res){

	var hotelId = req.params.hotelId;

	Hotel
		.findByIdAndRemove(hotelId)
		.exec(function(err, hotel){
			if (err) {
				res
					.status(404)
					.json(err);
			}
			else{
				console.log("Hotel deleted id: ", hotelId);
				res
					.status(204)
					.json();
			}
		})
};