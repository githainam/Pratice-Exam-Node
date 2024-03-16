const express = require('express');
const bodyParser = require('body-parser');

const Video = require('../models/video')
var authenticate = require('../authenticate');


const videoRoute = express.Router();
videoRoute.use(bodyParser.json());

videoRoute.route('/')
    .get((req, res, next) => {
        Video.find({})
            // .populate('question')
            .then((video) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(video);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser,  (req, res, next) => {
        // req.body.author = req.user._id;
        Video.create(req.body)
            .then((video) => {
                console.log('Video Created: ', video);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(video);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyOrdinaryUser,  (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /video');
    })
    .delete(authenticate.verifyOrdinaryUser,  (req, res, next) => {
        Video.deleteMany()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

    videoRoute.route('/:videoId')
    .get((req, res, next) => {
        Video.findById(req.params.quizId )
            .then((video) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(video);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, (req, res, next) => {
        res.end("POST operation not supported on /video/" + req.params.videoId );
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Video.findByIdAndUpdate(req.params.videoId , {$set: req.body}, {new: true})
            .then((video) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(video);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Video.findByIdAndRemove(req.params.videoId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

    videoRoute.route("/:videoId/populate")
    .get(async (req, res, next) => {
        try {
          const videoId = req.params.videoId;
          const quiz = await Video.findById(videoId).populate({
            path: "comments",
            model: "Comment",
            select: "text options correctAnswerIndex",
            match: { text: { $regex: /good/i } },
            match: { text: { $regex: /great/i } }, // Match questions containing the word "Who"
          });
          if (!video) {
            return res.status(404).json({ error: "Quiz not found" });
          }
          res.json(video);
        } catch (err) {
          console.error("Error finding video:", err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });

    

module.exports = videoRoute;