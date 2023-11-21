// const { ensureAuthenticated } = require("../middleware/checkAuth");
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();

router.get("/list", async (req, res) => {
  const subgroups = await database.getSubs();
  res.render("subs", { subgroups });
});

router.get("/show/:subname", async (req, res) => {
  const subname = req.params.subname;
  const posts = await database.getPosts(undefined, subname);
  res.render("sub", { posts, subname });
});

export default router;
