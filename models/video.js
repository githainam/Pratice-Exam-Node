const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var commentSchema = new Schema(
    {
      text: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
    });

const videoSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    url: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Question",
        type: String,
    },
    duration:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    comments:[commentSchema],
},
{
    timestamps: true,
}
);
const Video = mongoose.model('Video', videoSchema);
module.exports = Video;