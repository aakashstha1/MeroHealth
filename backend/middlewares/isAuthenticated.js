import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated.",
        success: false,
      });
    }

    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      req.id = decode.userId;
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Token verification failed. Please log in again.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Authentication error:", error.message || error);
    res.status(500).json({
      message: "Authentication failed. Please try again.",
      success: false,
    });
  }
};

export default isAuthenticated;
