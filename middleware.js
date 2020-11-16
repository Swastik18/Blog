const Blog = require('./models/blogs');
const {blogSchema, reviewSchema} = require('./Schema')
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next();
}

module.exports.validateBlog = (req, res, next) =>{
    const {error} = blogSchema.validate(req.body);

    if(error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    } else{
        next();
    }
};



module.exports.isAuthor = async(req, res, next) =>{
    const {id} = req.params;
    const blog = await Blog.findById(id)
    if(!blog.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/blogs/${id}`);
    }
    next();
}


module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}


module.exports.isReviewAuthor = async(req, res, next) =>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/blogs/${id}`);
    }
    next();
}