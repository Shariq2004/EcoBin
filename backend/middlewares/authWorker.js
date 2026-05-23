const jwt = require("jsonwebtoken");

//worker authentication middleware
const authWorker = async (req, res, next) => {
  try {
    const wtoken = req.headers.token;

    if (!wtoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(wtoken, process.env.JWT_SECRET);

    req.workerId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = authWorker;
