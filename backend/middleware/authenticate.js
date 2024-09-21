import jwt from "jsonwebtoken";

import services from "../services/services.js";

const validateUser = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];
    const token = authorization && authorization.split(" ")[1];

    if (!token) {
      next(services.errorGenerator("Unauthorized/No token provided!", 401));
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;

    const expirationThreshold =
      process.env.REFRESH_THRESHOLD_IN_MIN * 60 * 1000;

    const currentTime = Date.now();

    if (decoded.exp * 1000 - currentTime <= expirationThreshold) {
      const refreshToken = jwt.sign(decoded, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });
      res.setHeader("x-refresh-token", refreshToken);
    }

    next();
  } catch (error) {
    return error.name === "TokenExpiredError"
      ? next(services.errorGenerator("Unauthorized/Token has expired!", 401))
      : next(services.errorGenerator("Unauthorized/Invalid token!", 401));
  }
};

export default { validateUser };
