const formidable = require("formidable")
require('dotenv').config()
const path = require('path')
const fs = require('fs')
const Image = require('../models/Image')
const asyncHandler = require('express-async-handler')

const baseImageUrl = "images"

const isFileValid = (file) => {
  const type = file.mimetype.split("/").pop()
  const validTypes = ["jpg", "jpeg", "png", "pdf"]
  if (validTypes.indexOf(type) === -1) {
    return false
  }
  return true
}

//Get unfiltered unordered images
const getAllImages = async (req, res) => {
  const images = await Image.find().lean()
  if (!images.length) {return res.status(400).json({ message: 'No images found'})}
  res.json(images)
}

//POST an image @TODO: accomodate multple images
const postImages = (req, res) => {
  const uploadFolder = path.join(__dirname, "..", "public", baseImageUrl)
  const form = new formidable.IncomingForm()
  form.multiples = true
  form.maxFileSize = 50 * 1024 * 1024; // 5MB
  form.uploadDir = uploadFolder
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log("Error parsing the files")
      return res.status(400).json({
        status: "Fail",
        message: "There was an error parsing the files",
        error: err,
      })
    }
    // Check if multiple files or a single file
    if (!files.myFile.length) {
      const file = files.myFile
      const isValid = isFileValid(file)

      // creates a valid name by removing spaces
      const fileName = encodeURIComponent(file.newFilename.replace(/\s/g, "-"));

    if (!isValid) {
      return res.status(400).json({message: "The file type is not a valid type"})
    }

    // rename the file in the directory
    try {
      const originalFilenameURLfriendly = file.originalFilename.replace(/\s+/g, '-').toLowerCase();
      fs.renameSync(file.filepath, `${uploadFolder}/${originalFilenameURLfriendly}`)
    } catch (error) {
      console.log(error);
    }

    // stores the image data in the database

      try {
        const dbfn = file.originalFilename.replace(/\s+/g, '-').toLowerCase()
        const newImage = await Image.create({
          name: `${dbfn}`,
          url: `${baseImageUrl}/${dbfn}`
        })
        return res.status(200).json({message: "File created successfully"})
      } catch (error) {
        res.json({error,});
      }
    } else {
    // Multiple files
    }
  })
}

// @desc Delete an image
// @route DELETE /images
// @access Private??
const deleteImage = asyncHandler(async (req, res) => {
  const { id } = req.body
  // Confirm data
  if (!id) {
      return res.status(400).json({ message: 'Image ID required' })
  }

  // Confirm image exists to delete 
  const image = await Image.findById(id).exec()

  if (!image) {
      return res.status(400).json({ message: 'Image not found' })
  }

  const result = await image.deleteOne()

  const reply = `Image '${result.url}' with ID ${result._id} deleted`

  res.json(reply)
})

module.exports = {
  getAllImages,
  postImages,
  deleteImage
}
