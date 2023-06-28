const Document = require("../models/Document.model");
const User = require("../models/User.model")

//add document record
const adddoc = async (req, res) => {
  //catching data from front end to these attributes
  const { 
    docName, 
    category, 
    date, 
    description, 
  } = req.body;

  createdEmp = (req.user.id),
  empTitle = (req.user.id)

  //create a object to store saved data to save in the mongo db database
  const document = new Document({
    docName,
    category,
    date,
    description,
    createdEmp,
    empTitle,
  });


  //sending created document object to the database
  await document
    .save()
    .then(() => res.json("Document record added"))
    .catch((err) => res.status(400).json("Error : " + err));
};

//Update Exsisting document record
const updateDocument = async (req, res) => {
  Document.findByIdAndUpdate(req.params.id)
    .then((exsistingDocument) => {
      exsistingDocument.docName = req.body.docName;
      exsistingDocument.category = req.body.category;
      exsistingDocument.date = Date.parse(req.body.date);
      exsistingDocument.description = req.body.description;
      //exsistingDocument.createdEmp = req.body.createdEmp;
      //exsistingDocument.empTitle = req.body.empTitle;
      exsistingDocument
        .save()
        .then((updateDocument) => res.json(updateDocument))
        .catch((error) => res.status(400).json("Error: " + error));
    })
    .catch((error) => res.status(400).json("Error: 1" + error));
};

//Delete Document record
const deleteDocument = async (req, res) => {
  console.log(req.params.id);
  Document.findByIdAndDelete(req.params.id)
    .then(() => res.json("Document record deleted"))
    .catch((err) => res.status(400).json("Error : " + err));
};

//get document info by id
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (document) res.json(document);
    else {
      res.json("No document record in the database!");
    }
  } catch (error) {
    res.status(500).send("Server Error" + error);
  }
};

//get all document records
const getdocument = async (req, res) => {
  try {
    const document = await Document.find();
    res.json(document);
  } catch (error) {
    res.status(500).send("Server Error : " + error);
  }
};

//export
module.exports = {
  adddoc,
  updateDocument,
  getDocumentById,
  getdocument,
  deleteDocument,
};
