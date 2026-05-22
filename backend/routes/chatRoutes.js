const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Thiếu message" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content:
              "Bạn là AI fitness coach. Trả lời ngắn gọn bằng tiếng Việt.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      reply: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.log("AI ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "Lỗi AI",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;