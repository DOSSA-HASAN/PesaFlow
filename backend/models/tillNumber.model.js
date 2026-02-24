import mongoose from "mongoose";

const tillModel = new mongoose.Schema({
    tillNumber: {type:String, unique, required},
    branchName: {type:String, required}
})

const Till = mongoose.model("Till", tillModel)

export default Till