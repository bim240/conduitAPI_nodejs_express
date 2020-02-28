var express = require("express");
var router = express.Router();
var auth = require("../../modules/auth");
var articlesController = require("../../controller/v1/articles");

router.get("/", articlesController.filterArticles);
router.post("/", auth.userAuth, articlesController.createArticle);
router.put("/:slug", auth.userAuth, articlesController.updateArticle);
router.delete("/:slug", auth.userAuth, articlesController.deleteArticle);
router.get("/:slug", articlesController.getArticle);

module.exports = router;
