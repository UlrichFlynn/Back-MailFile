const jwt = require("jsonwebtoken");

exports.isAuth = (req, res, next) => {
    try {
      const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : "";
      if (!token) {
        return res.status(400).json({
            message: "A token is required for authentication"
        });
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken;
      return next();
    } catch (error) {
      res.status(401).json({
        message : 'Invalid Token',
        error: error.stack
      });
    }
};