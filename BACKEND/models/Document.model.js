const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema(
  {
    docName: { 
        type: String, 
        required: true 
    },

    category: { 
        type: String, 
        required: true 
    },

    date: { 
        type: Date, 
        required: true 
    },

    description: { 
        type: String, 
        required: true 
    },

    createdEmp: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },

    empTitle: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" 
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = Document = mongoose.model("DocumentManage", documentSchema);
