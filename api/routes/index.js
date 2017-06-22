var express = require('express');
var router = express.Router();

var ctrlHotels = require('../controllers/hotels.controllers.js');
var ctrlReviews = require('../controllers/reviews.controllers.js');



router
	.route('/hotels')
	.get(ctrlHotels.hotelGetAll)
	.post(ctrlHotels.hotelsAddOne);

router
	.route('/hotels/:hotelId')
	.get(ctrlHotels.hotelGetOne)
	.put(ctrlHotels.hotelUpdateOne)
	.delete(ctrlHotels.hotelDeleteOne);




//Review routes
router
	.route('/hotels/:hotelId/reviews')
	.get(ctrlReviews.reviewsGetAll)
	.post(ctrlReviews.reviewsAddOne);

router
	.route('/hotels/:hotelId/reviews/:reviewId')
	.get(ctrlReviews.reviewGetOne)
	.put(ctrlReviews.reviewUpdateOne)
	.delete(ctrlReviews.reviewDeleteOne);



module.exports = router;