exports.userFormat = (user, token) => {
  let UserFormat = {
    user: {
      email: user.email,
      token: token,
      username: user.username,
      bio: user.bio,
      image: user.image
    }
  };
  return UserFormat;
};
exports.profileFormat = profile => {
  let ProfileFormat = {
    profile: {
      username: profile.username,
      bio: profile.bio,
      image: profile.image,
      following: profile.following
    }
  };
  return ProfileFormat;
};
exports.articleFormat = article => {
  let result = article.map(v => {
    article = {
      title: v.title,
      description: v.description,
      body: v.body,
      tagList: v.tagList
    };
    return article;
  });

  return result;
};
exports.singleArticleFormat = (article, userid = false) => {
  // console.log(article);

  let result = article.map(v => {
    if (v.favoritedBy.includes(userid)) {
      favorited = true;
    } else {
      favorited = false;
    }
    article = {
      slug: v.slug,
      title: v.title,
      description: v.description,
      body: v.body,
      tagList: v.tagList,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
      favorited: favorited,
      favoritesCount: v.favoritedBy.length,
      author: {
        username: v.author[0].username,
        bio: v.author[0].bio,
        image: v.author[0].image,
        following: false
      }
    };
    return article;
  });
  return result;
};
exports.commentFormat = comment => {
  let result = comment.map(v => {
    comments = {
      id: v.id,
      body: v.body,
      createdAt: v.createdAt,
      updatedAt: v.createdAt,
      author: {
        username: v.author.username,
        bio: v.author.bio,
        image: v.author.image,
        following: false
      }
    };
    return comments;
  });
  return result;
};
