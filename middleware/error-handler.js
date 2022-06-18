const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    let customErr = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong, please try again later",
    };

    if (err.code && err.code === 110000) {
        customErr.statusCode = 400;
        customErr.msg = `${Object.keys(err.keyPattern)} entered already exists`;
    }

    if (err.name && err.name === "ValidationError") {
        customErr.statusCode = 400;
        customErr.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(", ");
    }

    if (err.name === "CastError") {
        customErr.msg = `No item found with id: ${err.value}`;
        customErr.statusCode = 404;
    }

    // return res.status(500).json(err);
    return res.status(customErr.statusCode).json({ msg: customErr.msg });
};

module.exports = errorHandlerMiddleware;
