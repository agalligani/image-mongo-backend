const express = require("express");
const router = express.Router();
const imagesController = require("../controllers/images");

router.route('/')
    .get(imagesController.getAllImages)
    .post(imagesController.postImages) //really just one image
    .delete(imagesController.deleteImage)

module.exports = router;