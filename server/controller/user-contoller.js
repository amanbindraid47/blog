const User = require("../model/User");
const bcrypt = require("bcryptjs");

// ✅ Get All Users
const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }
    return res.status(200).json({ users, message: "Users fetched successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while fetching users" });
  }
};

// ✅ Signup
const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      blogs: []
    });

    await user.save();
    return res.status(201).json({ user, message: "User registered successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error while signing up" });
  }
};

// ✅ Login
const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    return res.status(200).json({ user: existingUser, message: "Login successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while logging in" });
  }
};

module.exports = { getAllUser, signUp, logIn };
