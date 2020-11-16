const Blog = require('../models/blogs')
const Review = require('../models/review');

module.exports.createReview = async(req, res) =>{
    const blog = await Blog.findById(req.params.id);
    const review  = new Review(req.body.review);
    review.author = req.user._id;
    blog.reviews.push(review);
    await blog.save()
    await review.save();
    req.flash('success', 'Successfully Created New Review');
    res.redirect(`/blogs/${blog._id}`);
}


module.exports.deleteReview = async(req, res) =>{
    const {id, reviewId} = req.params; 
    await Blog.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted New Review');
    res.redirect(`/blogs/${id}`);
}