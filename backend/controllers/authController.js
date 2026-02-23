const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

///////////////Register ////////////////

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    //check if user exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    // Prevent self-registration as admin
    if (role === "admin") {
      return res.status(403).json({
        message: "Cannot register as admin. Contact system administrator.",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // generate token

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log("User registered:", user, token);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//////////////Login///////////////

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // generate token

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log("user logged in:", user, token);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during login",
    });
  }
};
module.exports = { register, login };
