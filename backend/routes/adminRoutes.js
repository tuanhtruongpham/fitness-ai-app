const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Lấy danh sách user
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      message: "Lấy danh sách user thành công",
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Tạo user mới
router.post("/users", async (req, res) => {
  try {
    const { fullName, phone, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập fullName, email và password",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email hoặc số điện thoại đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
      role: role || "user",
    });

    const userWithoutPassword = await User.findById(user._id).select("-password");

    res.status(201).json({
      message: "Tạo user thành công",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Sửa user
router.put("/users/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json({
      message: "Cập nhật user thành công",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Xoá user
router.delete("/users/:id", async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        message: "Admin không thể tự xoá chính mình",
      });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json({
      message: "Xoá user thành công",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;