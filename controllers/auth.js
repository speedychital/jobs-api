const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
    const newUser = await User.create({ ...req.body });
    const token = newUser.createJWT();

    res.status(StatusCodes.CREATED).send({
        msg: "Succesfully registered",
        user: { name: newUser.name },
        token,
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Email doesn't exist");
    }
    if (!(await user.comparePassword(password))) {
        throw new UnauthenticatedError("Invalid credentials");
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).send({
        msg: "Successful login",
        user: { name: user.name },
        token,
    });
};

module.exports = {
    register,
    login,
};
