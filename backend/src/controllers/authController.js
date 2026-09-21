const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sendUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  companyName: user.companyName,
  skills: user.skills,
});

// @desc    Register a new user (jobseeker or employer)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const user = await User.create({
      name,
      email,
      password,
      role: role === "employer" ? "employer" : "jobseeker",
      companyName: companyName || "",
    });
    const token = signToken(user._id);
    res.status(201).json({ token, user: sendUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login and receive a JWT
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken(user._id);
    res.json({ token, user: sendUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get the currently logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.json({ user: sendUser(req.user) });
};
