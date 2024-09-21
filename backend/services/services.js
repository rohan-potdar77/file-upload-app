import jwt from "jsonwebtoken";

const corsOptions = () => {
  const whitelist = ["http://localhost:5173"];

  const options = {
    origin: (origin, callback) =>
      whitelist.indexOf(origin) !== -1
        ? callback(null, true)
        : callback(new Error("Access denied! Blocked by 'CORS' policy!")),
  };

  return options;
};

const errorGenerator = (message, code) => {
  const error = new Error(message);
  error.statusCode = code;
  return error;
};

const generateToken = async (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
};

export default {
  corsOptions,
  errorGenerator,
  generateToken,
};
