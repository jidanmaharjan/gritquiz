const Auth = require("../models/authModel");
const Otp = require("../models/otpModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const isRegistered = await Auth.findOne({ email: email });
    if (!isRegistered) {
      await Auth.create({ email });
    }
    //Generate otp
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    //Mail details or header
    const details = {
      from: "GritQuiz 📧gritquiz@gmail.com",
      to: email,
      subject: "User Verification",
      text: `Code: ${otp}`,
      html: `<img style="width: 150px" src='https://cdn-icons-png.flaticon.com/512/6193/6193558.png' /><br/><p>Enter code <strong>${otp}</strong> to login at GritQuiz. <br/>This code will expire in 2 minutes. </p>`,
    };
    //Hash otp and save to db
    const salt = await bcrypt.genSalt();
    const hashedotp = await bcrypt.hash(otp, salt);
    await Otp.create({
      email: email,
      otp: hashedotp,
    });
    //Send mail to user
    await mailTransporter.sendMail(details, (err) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: err.message,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Verification Code has been sent to your email",
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    } else {
      const foundOtp = await Otp.find({ email });
      if (foundOtp.length < 1) {
        res.status(400).json({
          success: false,
          message: "OTP has expired",
        });
      } else {
        const hashedOtp = foundOtp[foundOtp.length - 1].otp;
        const isValid = await bcrypt.compare(String(otp), hashedOtp);
        if (!isValid) {
          res.status(400).json({
            success: false,
            message: "Invalid otp entered. Check your inbox and try again",
          });
        } else {
          const accessT = jwt.sign(
            { email: email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
          );
          const refreshT = jwt.sign(
            { email: email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
          );
          await Otp.deleteMany({ email });
          res.status(200).json({
            success: true,
            message: "Login successful",
            accessT,
            refreshT,
          });
        }
      }
    }
  } catch (error) {
    res.send(error.message);
  }
};

exports.getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.refreshToken = async (req, res) => {
  const refToken = req.body.token;
  if (!refToken) {
    return res.status(400).json({
      success: false,
      message: "Invalid Token",
    });
  }
  try {
    jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Please login again",
        });
      } else {
        const token = jwt.sign(
          { email: payload.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
        );
        res.status(200).json({
          success: true,
          token: token,
        });
      }
    });
  } catch (error) {
    res.send(error.message);
  }
};
