var express = require("express");
var router = express.Router();
var auth = require("../../modules/auth");
var articlesController = require("../../controller/v1/articles");
var commentController = require("../../controller/v1/comments");

router.get("/", articlesController.filterArticles);
router.post("/", auth.userAuth, articlesController.createArticle);
router.put("/:slug", auth.userAuth, articlesController.updateArticle);
router.delete("/:slug", auth.userAuth, articlesController.deleteArticle);
router.get("/:slug", articlesController.getArticle);
router.get("/feed", auth.userAuth, articlesController.getFeedArticle);
router.post("/:slug/comments", auth.userAuth, commentController.createComment);
router.get("/:slug/comments", commentController.getAllComments);
router.delete(
  "/:slug/comments/:id",
  auth.userAuth,
  commentController.deleteComment
);
module.exports = router;
