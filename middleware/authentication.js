const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authentication = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new UnauthenticatedError("Please login to view data");
    }
    // console.log(`AuthHeader good`);
    const token = authHeader.split(" ")[1];
    // console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        throw new UnauthenticatedError("Invalid credentials");
    }
};

module.exports = authentication;
