var express = require("express");
var router = express.Router();
var Article = require("../../models/article");

router.get("/", async (req, res, next) => {
  try {
    // var tags = await Article.distinct("tagList");
    // var tags = await Article.find({}, "tagList").console.log(tags);
    var tags = await Article.distinct("tagList", function(err, result) {
      if (err) return handleError(err);
      return result;
    });
    res.status(200).json({ tags: tags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
