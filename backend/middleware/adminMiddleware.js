const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Bạn không có quyền admin",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Lỗi kiểm tra quyền admin",
      error: error.message,
    });
  }
};

module.exports = adminMiddleware;