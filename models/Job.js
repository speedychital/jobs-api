const mongoose = require("mongoose");

const JobSchema = mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, "Please provide company name"],
            maxlength: 20,
        },
        position: {
            type: String,
            required: [true, "Please provide your role/position "],
            maxlength: 50,
        },
        status: {
            type: String,
            enum: ["interview", "declined", "pending"],
            default: "pending",
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user details"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Job", JobSchema);
