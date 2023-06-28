const mongoose = require("mongoose")

const Schema = mongoose.Schema

const newTeam = new Schema(

    {
        teamName:{
            type:String,
            required: true,
        },

        description:{
            type:String,
            required:true,
        },

       members:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    },

     { timestamps: true }
)

const Team = mongoose.model("Team", newTeam);
module.exports = Team;