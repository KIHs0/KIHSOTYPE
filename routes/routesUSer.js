const express = require("express");
const router = express.Router();
const userSchmea = require("../models/userSchema");
const passport = require("passport");
const { Session } = require("express-session");
router.get("/signup", (req, res) => {
  res.render("./mainEjs/signup.ejs");
});
router.post("/signup", async (req, res) => {
  let { email, username, password } = req.body;
  let user = new userSchmea({ email, username });
  let nw = await userSchmea.register(user, password);
  req.login(nw, (err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", `welcome ${username}`);
      res.redirect("/");
    }
  });
  res.cookie(username, password, {
    signed: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    sameSite: "strict",
  });
});
router.get("/login", (req, res) => {
  res.render("./mainEjs/login.ejs");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    let { username, password } = req.user;
    res.cookie(username, password, {
      signed: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      sameSite: "strict",
    });
    req.flash("success", `welcome ${username}`);
    res.redirect("/");
  }
);
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("success", "some err ");
      next(err);
    }
    req.flash("success", "you are looged out 🫡");
    res.redirect("/");
  });
});
module.exports = router;
