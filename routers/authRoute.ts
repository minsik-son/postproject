import express from "express";
import passport from "../middleware/passport";
const router = express.Router();
import * as database from "../controller/authController";
router.get("/login", async (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
});

//auth: sign up
router.get("/signup", async (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { uname, password } = req.body;
  try {
    const newUser = await database.createUser(uname, password);
    res.redirect("login");
  } catch (error) {
    console.error(error);
    res.render("signup");
  }
});

export default router;
