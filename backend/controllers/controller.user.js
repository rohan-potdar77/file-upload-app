import bcrypt from "bcrypt";

import User from "../models/model.user.js";
import services from "../services/services.js";

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) next(services.errorGenerator("User not found!", 404));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(services.errorGenerator("Invalid password!", 401));
    }

    const token = await services.generateToken({ userId: user._id });
    return res.status(200).json(token);
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const savedUser = await User.create({ username, password: hash });

    if (savedUser) return res.status(201).json("Signup successful!");
  } catch (error) {
    return error.code === 11000 && error.keyPattern && error.keyPattern.username
      ? next(services.errorGenerator("Username already exists!", 400))
      : next(services.errorGenerator("Sign-up error!", 400));
  }
};

export default { login, register };
