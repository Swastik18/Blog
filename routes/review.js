const express = require('express')
const router = express.Router({mergeParams: true});
const Blog = require('../models/blogs')
const Review = require('../models/review');
const reviews = require('../controllers/reviews')
const {isLoggedIn, isReviewAuthor, validateReview} = require('../middleware')
const catchAysnc = require('../utils/catchAysnc');



router.post('/', isLoggedIn, validateReview, catchAysnc(reviews.createReview));


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAysnc(reviews.deleteReview));


module.exports = router;
