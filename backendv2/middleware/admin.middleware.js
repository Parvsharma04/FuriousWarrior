const adminMiddleware = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "ADMIN" || req.user.role === "MODERATOR")
  ) {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};
module.exports = adminMiddleware;
