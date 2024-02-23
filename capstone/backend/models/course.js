// models/course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    isAccessGranted: Boolean,
    image: String
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
