var Article = require("../../models/article");
var User = require("../../models/users");
var auth = require("../../modules/auth");
var slug = require("slug");

module.exports = {
  // create article
  createArticle: async (req, res, next) => {
    try {
      // console.log(req.body.article);
      req.body.article.author = req.user.userId;
      req.body.article.slug = slug(req.body.article.title);
      var newArticle = await Article.create(req.body.article);
      var xyz = await User.findByIdAndUpdate(req.user.userId, {
        $push: { articleId: newArticle.id }
      });
      newArticle = await Article.findById(newArticle.id).populate("author");
      res.status(200).json({ articles: newArticle });
    } catch (error) {
      next(error);
    }
  },

  // get article
  getArticle: async (req, res, next) => {
    try {
      var article = await Article.findOne({ slug: req.params.slug }).populate(
        "author"
      );
      res.status(200).json({ article: article });
    } catch (error) {
      next(err);
    }
  },
  // update article
  updateArticle: async (req, res, next) => {
    try {
      var article = await Article.findOne({ slug: req.params.slug });
      // var user = await User.findById(req.user.userId);
      // console.log(article);
      if (article && req.user.userId == article.author) {
        if (req.body && req.body.article && req.body.article.title) {
          req.body.article.slug = slug(req.body.article.title);
        }
        if (req.body && req.body.article) {
          var updatedArticle = await Article.findByIdAndUpdate(
            article.id,
            req.body.article
          );
        }
        var updatedArticle = await Article.findById(article.id).populate(
          "author"
        );
        res.status(200).json({ article: updatedArticle });
      } else {
        res.status(400).json({ err: "Article slug deosn't exist" });
      }
    } catch (error) {
      next(error);
    }
  },

  // delete article
  deleteArticle: async (req, res, next) => {
    try {
      var article = await Article.findOne({ slug: req.params.slug });
      if (req.user.userId == article.author) {
        await User.findByIdAndUpdate(req.user.userId, {
          $pull: { articleId: article.id }
        });
        await Article.findByIdAndDelete(article.id);
        res.status(200).json({ msg: "article deleted" });
      } else {
        res.status(400).json({ err: "you can't delete" });
      }
    } catch (error) {
      next(error);
    }
  },

  // get feed article
  getFeedArticle: async (req, res, next) => {
    try {
      var following = await User.find(req.user.userId, "following");
      var feed = following.reduce(async (acc, v) => {
        var singleFeed = await Article.find({ author: v }).populate("author");
        acc.push(dingleFedd);

        return acc;
      }, []);
      res.status(200).json({ aricles: feed });
    } catch (error) {
      next(error);
    }
  },
  // filter article
  filterArticles: async (req, res, next) => {
    try {
      // seach by author
      if (req.query.author) {
        var author = await User.findOne({ username: req.query.author });

        var articlesByAuthor = await Article.find({
          author: author.id
        }).populate("author");
        console.log(articlesByAuthor);
        res.status(200).json({ aricles: articlesByAuthor });
      }
      // search by tag
      if (req.query.tag) {
        var articlesByTag = await Article.find({
          tagList: req.query.tag
        }).populate("author");
        res.status(200).json({ aricles: articlesByTag });
      }
      if (req.query.favorited && auth.userAuth) {
        var articlesByFavourite = await User.findById(
          req.user.userId,
          "favArticle"
        )
          .populate("favArticle")
          .populate("author");
        res.status(200).json({ aricles: [articlesByFavourite[20]] });
      }
    } catch (error) {
      next(error);
    }
  }
};
