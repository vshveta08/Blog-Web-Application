const connectDB = require("../config/connectDb");
const checkAuth = require("../middlewares/auth");
const errorHandler = require("../middlewares/errorHandler");
const Comment = require("../models/comment");

const createCommentPost = async (req, res) => {
  const { comment, postId } = req.body;
  console.log("comment: ", comment);
  console.log("postid: ", postId);

  if (!comment) {
    return errorHandler(res, 400, "Please write your comment.");
  }

  try {
    await connectDB();

    const user = await checkAuth(req, res);

    // console.log("user: ", user);

    // const comments = await Comment.create({
    //   comment,
    //   userId: user._id,
    //   userName: user.name,
    //   postId,
    // });

    let commentPost = await Comment.findOne({ postId: postId });
    console.log("commentPost1: ", commentPost);

    if (commentPost) {
      commentPost.comments.push({
        userComment: comment,
        userId: user._id,
        userName: user.name,
      });
      await commentPost.save();
    } else {
      commentPost = await Comment.create({
        comments: [
          {
            userComment: comment,
            userId: user._id,
            userName: user.name,
          },
        ],

        postId,
      });
    }

    console.log("commentPost2: ", commentPost);

    res.status(200).json({
      commentPost,
      success: true,
      msg: "comment posted successfully",
    });
  } catch (err) {
    console.log(err);
    return errorHandler(res);
  }
};

const getAllCommentsPost = async (req, res) => {
  const { id } = req.params;
  console.log("id: ", id);

  try {
    await connectDB();

    let comments = await Comment.findOne({ postId: id }).select("comments");
    comments.comments.sort((a, b) => b.createdAt - a.createdAt); //sort comment in ascending order

    res.status(200).json({
      comments,
      success: true,
      msg: "fetched all comments.",
    });
  } catch (err) {
    console.log("error: ", err);
    return errorHandler(res);
  }
};

module.exports = { createCommentPost, getAllCommentsPost };
