const express = require('express');
const bodyParser = require('body-parser');

const Comment = require('../models/video');
var authenticate = require('../authenticate');


const commentRoute = express.Router();
commentRoute.use(bodyParser.json());

commentRoute.route('/')
.get((req, res, next) => {
    Video.find({})
        // .populate('question')
        .then((comment) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyOrdinaryUser,  (req, res, next) => {
    // req.body.author = req.user._id;
    Video.create(req.body)
        .then((comment) => {
            console.log('Comment Created: ', comment);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /comment');
})
.delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Video.deleteMany()
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

commentRoute.route('/:commentId')
.get((req, res, next) => {
    Video.findById(req.params.commentId )
        .then((comment) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyOrdinaryUser, (req, res, next) => {
    res.end("POST operation not supported on /comment/" + req.params.commentId );
})
.put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Video.findByIdAndUpdate(req.params.commentId , {$set: req.body}, {new: true})
        .then((comment) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Video.findByIdAndRemove(req.params.commentId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});
module.exports = commentRoute;