require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// Configure Yandex SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp.yandex.com",
  port: 465, // SSL
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API endpoint
app.post("/send-email", async (req, res) => {
  const { to, subject, text, } = req.body;

  if (!to || !subject || !text ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const info = await transporter.sendMail({
      from: `"DG-art notification" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    res.json({ success: true, message: "Email sent via Yandex!", info });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 4067;
app.listen(PORT, () => {
    console.log(`🚀 Test server running on http://localhost:${PORT}`);
  });