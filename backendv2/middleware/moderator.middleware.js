const moderatorMiddleware = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "MODERATOR" || req.user.role === "ADMIN")
  ) {
    next();
  } else {
    res.status(403).json({ message: "Moderator access required" });
  }
};

module.exports = moderatorMiddleware;
