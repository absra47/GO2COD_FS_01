const express = require("express");
const router = express.Router();
const Post = require("../models/post");
//Routes

/**
 * GET /
 * HOME
 */

router.get("", async (req, res) => {
  const locals = {
    title: "NodeJs Blog",
    description: "Simple Blog created with NodeJs, Express & MongoDb.",
  };

  try {
    const data = await Post.find();
    res.render("index", { locals, data });
  } catch (error) {
    console.log(error);
  }
});
router.get("/about", (req, res) => {
  res.render("about");
});

/**
 * GET /
 * Post :id
 */
router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    res.render("post", {
      locals,
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
