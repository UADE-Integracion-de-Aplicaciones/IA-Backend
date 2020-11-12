const jwt = require("jsonwebtoken");

const checkJwtBuilder = (req, res, next) => {
  const tokenName = "x-access-token";
  const token = req.headers[tokenName];
  const secret = process.env.APP_SECRET;
  const jwtExpiration = process.env.JWT_EXPIRATION;

  if (!token) {
    res.status(500).json({ auth: false, message: "no token provided" });
    res.end();
  }

  let jwtPayload;

  try {
    jwtPayload = jwt.verify(token, secret);
    res.locals.jwtPayload = jwtPayload;
  } catch {
    res
      .status(401)
      .json({ auth: false, message: "token authentication failed" });
    res.end();
  }

  const { user_id } = jwtPayload;
  const newToken = jwt.sign({ user_id }, secret, {
    expiresIn: jwtExpiration,
  });
  res.append(tokenName, newToken);
  next();
};

module.exports = {
  checkJwtBuilder
}