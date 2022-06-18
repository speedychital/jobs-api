const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
    const query = { createdBy: req.user.userId };

    const jobs = await Job.find(query).sort("createdAt");

    res.status(StatusCodes.OK).json({ jobs, length: jobs.length });
};

const getJob = async (req, res) => {
    const jobId = req.params.id;
    const userId = req.user.userId;
    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId,
    });

    if (!job) {
        throw new NotFoundError("No job found");
    }
    res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ msg: "Job created", job });
};

const updateJob = async (req, res) => {
    const jobId = req.params.id;
    const userId = req.user.userId;

    const job = await Job.findOneAndUpdate(
        {
            _id: jobId,
            createdBy: userId,
        },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!job) {
        throw new NotFoundError("No job found");
    }
    res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
    const {
        params: { id: jobId },
        user: { userId },
    } = req;

    const job = await Job.findOneAndRemove({
        _id: jobId,
        createdBy: userId,
    });

    if (!job) {
        throw new NotFoundError("No job found");
    }
    res.status(StatusCodes.OK).json({ job });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
