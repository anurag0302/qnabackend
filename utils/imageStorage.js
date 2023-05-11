const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${uuidv4()}${path.extname(
        file.originalname.toLowerCase()
      )}`
    );
  },
});
const upload = multer({ storage: storage }).array("images");

module.exports = {
  upload,
};
