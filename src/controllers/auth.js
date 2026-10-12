import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { User } from "../models/user.js";

let refreshTokens = [];

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Validate input
    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. Find user by email
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+passwordHash");

    // 3. Check user and password
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Generate JWT
    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN,
        algorithm: "HS256",
      },
    );
    const refreshToken = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      env.JWT_SECRET,
      {
        algorithm: "HS256",
      },
    );
    refreshTokens.push(refreshToken);

    // 5. Send token and safe user details
    return res.status(200).json({
      message: "Login successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: user,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong during login",
    });
  }
};

export const refreshToken = (req, res) => {
  const token = req.body.token;
  if (token == null) return res.sendStatus(401);

  if (!refreshTokens.includes(token)) return res.sendStatus(403);

  jwt.verify(token, env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN,
        algorithm: "HS256",
      },
    );

    res.status(200).json({ accessToken });
  });
};

export const logout = (req, res) => {
  const token = req.body.token;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.sendStatus(204);
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validate required fields
    if (!name?.trim() || !email?.trim() || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    // 2. Validate role
    if (!["founder", "investor"].includes(role)) {
      return res.status(400).json({
        message: "Role must be founder or investor",
      });
    }

    // 3. Basic password validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 4. Check whether the email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    // 6. Hash the password
    const passwordHash = await bcrypt.hash(password, env.saltRounds);

    // 7. Create the user
    const userData = {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
    };

    const user = await User.create(userData);

    // 8. Return safe user data only
    return res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    // Handle duplicate email if concurrent requests race
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Something went wrong during registration",
    });
  }
};
