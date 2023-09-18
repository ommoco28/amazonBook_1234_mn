const errorHandler = (err, req, res, next) => {
  console.log(err);

  const error = { ...err };
  error.message = err.message;
  console.log("---------------------", error);

  if (err.name === "CastError") {
    error.message = "Буруу бүтэцтэй id байна";
    error.statusCode = 400;
  }
  if (err.code === 11000) {
    console.log("code check");
    error.message = "талбарын утга давхардсан байна";
    error.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: error,
  });
};

module.exports = errorHandler;
