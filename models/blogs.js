const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')


const BlogSchema = new Schema({
    title: String,
    description: String,
    markdown: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review'
      }
    ]
})


BlogSchema.post('findOneAndDelete', async function(doc) {
  if(doc) {
    await Review.remove({
      //there "_id" is in the doc inside of reviews array
      _id: {
        $in: doc.reviews
      }
    })
  }
})


module.exports = mongoose.model('Blog', BlogSchema)
