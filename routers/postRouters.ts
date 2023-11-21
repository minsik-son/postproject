// @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";

router.get("/", async (req, res) => {
  const posts = await database.getPosts(20);
  const user = req.user;
  res.render("posts", { posts: posts, user: user });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts");
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  const { title, link, description, subgroup } = await req.body;

  try {
    const creator = await req.user;
    const newPost = await database.createPost({
      title,
      link,
      description,
      creator,
      subgroup,
    });
    res.redirect(`/posts/show/${newPost.id}`);
  } 
  catch (error) {
    res.status(400).send(error);
  }
});

router.get("/show/:postid", async (req, res) => {
  const postId = req.params.postid;
  const user = await req.user;
  const post = await database.getOnePost(postId);
  const upvotes = post.votes.filter((vote) => vote.value === 1).length;
  const downvotes = post.votes.filter((vote) => vote.value === -1).length;
  const updatedPost = {
    ...post,
    upvotesCount: upvotes,
    downvotesCount: downvotes,
  };
  conlose.log("check")
  res.render("individualPost", { post: updatedPost, user: user });
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  const postId = req.params.postid;
  const user = await req.user;
  const post = await database.getOnePost(postId);
  if (post.creator.id !== user.id) {
    return res.status(403).send("Unauthorized action");
  }
  res.render("editPost", { post });
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  const post_id = req.params.postid;
  const { title, link, description, subgroup } = req.body;
  try {
    await database.editPost(post_id, { title, link, description, subgroup });
    res.redirect(`/posts/show/${post_id}`);
  } 
  catch (error) {
    res.status(400).send(error);
  }
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  const postId = req.params.postid;
  const user = await req.user;
  const post = await database.getOnePost(postId);
  const upvotes = post.votes.filter((vote) => vote.value === 1).length;
  const downvotes = post.votes.filter((vote) => vote.value === -1).length;
  const updatedPost = {
    ...post,
    upvotesCount: upvotes,
    downvotesCount: downvotes,
  };
  if (post.creator.id !== user.id) {
    return res.status(403).send("Unauthorized action");
  }
  res.render("deletePost", { post: updatedPost, user: user });
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  const post_id = req.params.postid;
  const user = await req.user;
  const post = await database.getOnePost(post_id);
  if (post.creator.id !== user.id) {
    return res.status(403).send("Unauthorized action");
  }
  try {
    await database.deletePost(post_id);
    res.redirect("/");
  } 
  catch (error) {
    res.status(400).send(error);
  }
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    const post_id = req.params.postid;
    const creator = await req.user;
    const post = await database.getOnePost(post_id);
    const { comment } = await req.body;
    const description = comment;
    try {
      const newComment = await database.addComment(
        post_id,
        creator.id,
        description
      );
      res.redirect(`/posts/show/${post_id}`);
    } 
    catch (error) {
      res.status(400).send(error);
    }
  }
);

//delete comment 
router.post(
  "/delete-comment/:commentid",
  ensureAuthenticated,
  async (req, res) => {
    const comment_id = req.params.commentid;
    const user = await req.user;
    try {
      const comment = await database.getComment(comment_id);
      if (!comment) {
        return res.status(404).send("Comment not found");
      }
      if (comment.creator.id !== user.id) {
        return res.status(403).send("Unauthorized action");
      }
      await database.deleteComment(comment_id);
      res.redirect(`/posts/show/${comment.post_id}`);
    } 
    catch (error) {
      res.status(400).send(error);
    }
  }
);

//vote function
router.post("/vote/:postid/:action", ensureAuthenticated, async (req, res) => {
  const postId = req.params.postid;
  const action = req.params.action;
  const user = await req.user;
  try {
    const result = await database.votePost(postId, action, user);
    res.json(result);
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error });
  }
});

export default router;
