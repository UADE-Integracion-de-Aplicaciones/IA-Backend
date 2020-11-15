const jwt = require("jsonwebtoken");
const { withMiddleware } = require("express-kun");

const jwtAuthMiddleware = (
  secretKey,
  getToken,
  preCheckFun,
  errorHandler,
  verifyOptions
) => {
  return async function middleware(req, res, next) {
    try {
      const token = await getToken(req);
      if (preCheckFun) {
        preCheckFun(req, res);
      }
      await jwt.verify(token, secretKey, verifyOptions);
      res.locals.token = token;
      res.locals.decoded = jwt.decode(token);
      next();
    } catch (e) {
      if (errorHandler) {
        errorHandler(e, req, res, next);
        return;
      }
      if (e instanceof jwt.JsonWebTokenError || e instanceof TokenError) {
        res.status(401).json({
          message: "Invalid Token",
          error: e.message,
        });
        return;
      }
      res.status(500).json({
        message: "Internal server Error",
        error: e.message,
        stack: e.stack,
      });
    }
  };
};

const getTokenFromBearer = (req) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new TokenError("No Authorization Header");
  }
  try {
    const token = authorization.split("Bearer ")[1];
    return token;
  } catch {
    throw new TokenError("Invalid Token Format");
  }
};

const withJWTAuthMiddleware = (
  router,
  secretKey,
  getToken = getTokenFromBearer,
  preCheckFun,
  errorHandler,
  verifyOptions
) => {
  return withMiddleware(
    router,
    jwtAuthMiddleware(
      secretKey,
      getToken,
      preCheckFun,
      errorHandler,
      verifyOptions
    )
  );
};

module.exports = {
  withJWTAuthMiddleware,
};
