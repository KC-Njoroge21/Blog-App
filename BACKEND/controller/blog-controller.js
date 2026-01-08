const mongoose = require('mongoose');
const Blog = require('../model/Blog');

//fetch list of Blogs
// add new Blog
// update Blog
// delete Blog

const fetchListOfBlogs = async (req, res) => {
  let blogList;
  try {
    blogList = await Blog.find();
  } catch (e) {
    console.log(e);
  }

  if (!blogList) {
    return res.status(404).json({ message: 'No Blogs found' });
  }
  return res.status(200).json({ blogList });
}

const addNewBlog = async (req, res) => {
  const { title, description } = req.body;
  const currentBlog = new Date();

  const newlyCreatedBlog = new Blog({
    title,
    description,
    date: currentBlog
  });

  try {
    await newlyCreatedBlog.save();
  } catch (e) {
    console.log(e);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newlyCreatedBlog.save(session);
    session.commitTransaction();
  } catch (e) {
    return res.status(500).json({ message: 'Unable to add blog' });
  }

  return res.status(200).json({ newlyCreatedBlog });
}

const deleteBlog = async (req, res) => {
  const id = req.params.id;

  try {
    const findCurrentBlog = await Blog.findByIdAndDelete(id);
    if (!findCurrentBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Unable to delete blog! Please try again.' });
  }
}

const updateBlog = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  let currentBlogToUpdate

  try {
    currentBlogToUpdate =  await Blog.findByIdAndUpdate(id, {
      title,
      description
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Unable to update blog. Please try again.'});
  }
    if (!currentBlogToUpdate) {
      return res.status(500).json({ message: 'Blog not found' });
    }

    return res.status(200).json({ currentBlogToUpdate });
}

module.exports = {
  fetchListOfBlogs,
  addNewBlog,
  deleteBlog,
  updateBlog
}