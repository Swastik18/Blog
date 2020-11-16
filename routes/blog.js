const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, validateBlog } = require('../middleware');
const blogs = require('../controllers/blogs')
const catchAysnc = require('../utils/catchAysnc');

const Blog = require('../models/blogs');


router.get('/', catchAysnc(blogs.index));

router.get('/new', isLoggedIn, blogs.renderNewForm);

router.post('/', isLoggedIn, validateBlog, catchAysnc(blogs.createBlog));



router.get('/:id', catchAysnc(blogs.showBlog));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAysnc(blogs.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateBlog, catchAysnc(blogs.updateblog))

router.delete('/:id', isLoggedIn, isAuthor, catchAysnc(blogs.deleteblog))


module.exports = router;