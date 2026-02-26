import mongoose from "mongoose";

const tillModel = new mongoose.Schema({
    tillNumber: {type: String, unique: true, required: true},
    branchName: {type: String, required: true}
})

const Till = mongoose.model("Till", tillModel)

export default Till