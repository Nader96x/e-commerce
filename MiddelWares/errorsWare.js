module.exports._500 = (err, req, res, next) => {
  // if (err?.keyPattern?.email) err.message = "Email already exists";
  console.log(err);
  if (err.name === "ValidationError") {
    // console.log("ValidationError");
    err.message = {};
    Object.values(err.errors).forEach((e) => {
      err.message[e.path] = e.message;
    });
    err.statusCode = 422;
  } else if (err.name === "CastError") {
    // console.log("CastError");
    err.message = `Invalid ${err.path}: ${err.value}`;
    err.statusCode = 422;
  } else if (err.name === "MongoError" && err.code === 11000) {
    // console.log("MongoError", Object.keys(err.keyPattern));
    err.message = {};
    Object.keys(err.keyPattern).forEach((key) => {
      err.message[key] = `${key} already exists`;
    });
    // console.log(err.message);
    // err.message = `${Object.keys(err.keyPattern)} already exists`;
    err.statusCode = 422;
  } else if (err.name === "TokenExpiredError") {
    err.message = "Session has expired, Please Login Again";
    err.statusCode = 401;
  } else {
    console.log("err");
  }

  const statusCode = err.statusCode || 500;
  res
    .status(statusCode)
    .json({ status: "fail", error: err.message, stack: err.stack });
};

module.exports._404 = (req, res, next) => {
  res.status(404).json({ status: "fail", error: "Page not found." });
};
