const express = require("express");
const router = express.Router();
const { protect } =  require("../middleware/authorization")

const {
  adddoc,
  updateDocument,
  getDocumentById,
  getdocument,
  deleteDocument,
} = require("../controllers/documentController");

//documents

//@route  POST api/document
//@desc   add document record
router.post("/add",protect, adddoc);

//@route  GET api/document
//@desc   get document by Id
router.get("/:id", getDocumentById);

//@route  DELETE api/document
//@desc   delete document
router.delete("/:id", deleteDocument);

//@route  GET api/document/all
//@desc   get all document
router.get("/", getdocument);

//@route  PUT api/document
//@desc   update document record
router.put("/:id", updateDocument);

module.exports = router;
