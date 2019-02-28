const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const ValidatePostInput = require('../../validation/post');


/*
======================================
PRIVATE ROUTES
======================================
*/


// @route   POST /api/posts
// @desc    Logged-in user creates a new post
// @access  Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = ValidatePostInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  let newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  });
  newPost.save()
    .then(post => res.json(post))
    .catch(err => res.status(400).json(err));
});



// @route   DELETE /api/posts/:id
// @desc    Logged-in user can delete a specific post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => Post.findById(req.params.id))
    .then(post => {
      if (post.user.toString() !== req.user.id) {
        res.status(401).json({
          notauthorized: 'User not authorized.'
        });
      }
      post.remove().then(() => res.json({
        success: true
      }));
    })
    .catch(err => res.status(404).json({
      nopost: 'No post found.'
    }))
});



// @route   POST /api/posts/like/:id
// @desc    Logged-in user can toggle a like on a given post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  let liked = true;
  Post.findById(req.params.id)
    .then(post => {
      if (!post) return res.status(404).json({
        nopost: 'No post found.'
      });
      let likesToString = post.likes.map((item) => item.user.toString());
      if (likesToString.includes(req.user.id)) {
        liked = false;
        post.likes = likesToString.filter(item => item !== req.user.id);
      } else {
        post.likes.unshift({
          user: req.user.id
        })
      }

      post.save().then(post => res.status(200).json({
        liked
      }));
    })
    .catch(err => res.status(500).json(err));
});



// @route POST api/posts/comment/:commentID
// @desc Add comment to post
// @access Private
router.post('/comment/:postId', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = ValidatePostInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  Post.findById(req.params.postId)
    .then((post) => {
      let comment = {
        user: req.user._id,
        text: req.body.text,
        name: req.user.name,
        avatar: req.user.avatar
      };
      post.comments.push(comment);
      post.save().then(post => res.json(post))
    }).catch(err => res.status(500).json(err));
});



// @route   DELETE   api/posts/comment/:commentID/:postId
// @desc    Delete a comment from a post
// @access  Private
router.delete('/comment/:postId/:commentId', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Post.findById(req.params.postId)
    .then((post) => {
      const commentIds = post.comments.map(comment => comment._id.toString());
      if (!commentIds.includes(req.params.commentId)) return res.status(404).json({
        notfound: 'Comment does not exist.'
      });
      post.comments = post.comments.filter((comment) => {
        return comment._id.toString() !== req.params.commentId;
      })
      post.save().then(post => res.json(post))
    }).catch(err => res.status(500).json(err));
});

/*
======================================
PUBLIC ROUTES
======================================
*/

// @route   GET /api/posts
// @desc    Get a list of all posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({
      date: -1
    })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({
      nopost: 'No posts found.'
    }));
})


// @route   GET /api/posts/:id
// @desc    Get a specific post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({
      nopost: "No post found."
    }));
})


module.exports = router;