const Blog = require('../models/blogs')


module.exports.index = async(req, res) =>{
    const blogs = await Blog.find({}).sort({ createdAt: 'desc' });
    res.render('blogs/index', {blogs})
}

module.exports.renderNewForm = (req, res) =>{
    res.render('blogs/new');
}

module.exports.createBlog = async(req, res) =>{
    const blog = new Blog(req.body.blog);
    blog.author = req.user._id;
    await blog.save();
    req.flash('success', 'Successfully made a new blog');
    res.redirect(`/blogs/${blog._id}`); 
}

module.exports.showBlog = async(req, res) =>{
    const blog = await Blog.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!blog) {
        req.flash('error', 'Cannot find that Blog');
        return res.redirect('/blogs');
    }
    res.render('blogs/show', { blog })
}


module.exports.renderEditForm = async(req, res) =>{
    const {id} = req.params;
    const blog = await Blog.findById(id)
    if(!blog) {
        req.flash('error', 'Cannot find that Blog');
        return res.redirect('/blogs');
    }   
    res.render('blogs/edit', { blog })
}

module.exports.updateblog = async(req, res) =>{
    const {id} = req.params;
    const blog = await Blog.findByIdAndUpdate(id, {...req.body.blog});
    await blog.save();
    req.flash('success', 'Successfully Updated Blog')
    res.redirect(`/blogs/${blog._id}`);
}


module.exports.deleteblog = async(req, res) =>{
    const {id} = req.params;
    await Blog.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Blog')
    res.redirect('/blogs');
}