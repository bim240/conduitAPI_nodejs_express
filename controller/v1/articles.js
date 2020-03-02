var Article = require("../../models/article");

var User = require("../../models/users");
var auth = require("../../modules/auth");
var slug = require("slug");
var formatData = require("../../modules/formatData");

module.exports = {
  // create article
  createArticle: async (req, res, next) => {
    try {
      // console.log(req.body.article);
      var tagcollection = (req.body.article.author = req.user.userId);
      req.body.article.slug = slug(req.body.article.title);

      var newArticle = await Article.create(req.body.article);
      var xyz = await User.findByIdAndUpdate(req.user.userId, {
        $push: { articleId: newArticle.id }
      });
      newArticle = await Article.findById(newArticle.id).populate("author");
      var foramtedArticle = await formatData.singleArticleFormat([newArticle]);
      res.status(200).json({ article: foramtedArticle });
    } catch (error) {
      next(error);
    }
  },

  // get article
  getArticle: async (req, res, next) => {
    try {
      console.log("inside");
      var article = await Article.findOne({ slug: req.params.slug }).populate(
        "author"
      );
      // console.log(article);
      if (article) {
        var foramtedArticle = await formatData.singleArticleFormat([article]);
        res.status(200).json({ article: foramtedArticle });
      } else {
        res.status(404).json({ err: { body: ["Article doesn't exit"] } });
      }
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
        var foramtedArticle = await formatData.singleArticleFormat([
          updatedArticle
        ]);
        res.status(200).json({ article: foramtedArticle });
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
        res.status(400).json({
          err: { body: ["you are not authorised to delete this article"] }
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // get feed article
  getFeedArticle: async (req, res, next) => {
    try {
      // console.log("inside feed");
      var user = await User.findById(req.user.userId);
      // console.log(following);
      // var allArticle
      var feed = await Article.find({ author: { $in: user.following } })
        .populate("author")
        .sort({ updatedAt: 1 })
        .limit(20);
      console.log(feed);
      var foramtedArticle = await formatData.singleArticleFormat(feed);
      res.status(200).json({ articles: foramtedArticle });
    } catch (error) {
      next(error);
    }
  },
  // add to favorite
  addToFav: async (req, res, next) => {
    try {
      var article = await Article.findOne({ slug: req.params.slug }).populate(
        "author"
      );
      var updateuser = await User.findByIdAndUpdate(
        req.user.userId,
        {
          $push: { favArticle: article.id }
        },
        { new: true }
      );
      // console.log(updateuser);
      await Article.findByIdAndUpdate(article.id, {
        $push: { favoritedBy: updateuser.id }
      });
      var foramtedArticle = await formatData.singleArticleFormat([article]);
      res.status(200).json({ article: foramtedArticle });
    } catch (error) {
      next(error);
    }
  },
  // remove from favorite
  removeFromFav: async (req, res, next) => {
    try {
      var article = await Article.findOne({ slug: req.params.slug }).populate(
        "author"
      );
      if (article) {
        var updateuser = await User.findByIdAndUpdate(req.user.userId, {
          $pull: { favArticle: article.id }
        });
      }

      if (article && updateuser) {
        console.log("inside");
        await Article.findByIdAndUpdate(article.id, {
          $pull: { favoritedBy: updateuser.id }
        });
        var foramtedArticle = await formatData.singleArticleFormat([article]);
        res.status(200).json({ aricle: foramtedArticle });
      } else {
        res.status(404).json({
          err: { body: ["Invalid query.... Article doesn't exist"] }
        });
      }
    } catch (error) {
      next(error);
    }
  },
  // filter article
  filterArticles: async (req, res, next) => {
    try {
      // seach by author
      if (req.query.author) {
        var author = await User.findOne({ username: req.query.author })
          .sort({ updatedAt: 1 })
          .limit(20);
        if (author) {
          var articlesByAuthor = await Article.find({
            author: author.id
          }).populate("author");
          // console.log(articlesByAuthor);
          var foramtedArticle = await formatData.singleArticleFormat(
            articlesByAuthor
          );
          res.status(200).json({ aricles: foramtedArticle });
        } else {
          res.status(404).json({
            err: {
              body: [
                "No such author exist or  Please do a valid query with valid author"
              ]
            }
          });
        }
      }
      // search by tag
      if (req.query.tag) {
        var articlesByTag = await Article.find({
          tagList: req.query.tag
        })
          .populate("author")
          .sort({ updatedAt: 1 })
          .limit(20);
        console.log(articlesByTag);
        if (articlesByTag.length >= 1) {
          var foramtedArticle = await formatData.singleArticleFormat(
            articlesByTag
          );
          res.status(200).json({ aricles: foramtedArticle });
        } else {
          res.status(404).json({
            err: {
              body: [
                "No article with this tag or  Please do a valid query with valid tag"
              ]
            }
          });
        }
      }
      // search by favorite
      if (req.query.favorited && auth.userAuth) {
        console.log(req.query.favorited);
        var articlesByFavourite = await (
          await User.findOne(
            {
              username: req.query.favorited
            },
            "favArticle"
          )
        )
          .populate({
            path: "favArticle",
            populate: {
              path: "author",
              model: "User"
            }
          })
          .execPopulate();
        // .sort({ updatedAt: 1 })
        // .limit(20);
        console.log(articlesByFavourite);
        var foramtedArticle = await formatData.singleArticleFormat(
          articlesByFavourite.favArticle
        );
        res.status(200).json({ aricles: foramtedArticle });
      }
    } catch (error) {
      next(error);
    }
  }
};
