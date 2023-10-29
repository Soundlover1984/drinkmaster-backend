const multer = require("multer");
const path = require("path");
const uuid = require("uuid").v4;

// const tempDir = path.join(__dirname, "../", "tmp");

// const multerConfig = multer.diskStorage({
//   destination: tempDir,
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: multerConfig });

// module.exports = upload;

// == Multer config == //

const multerstorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/avatar");
  },
  filename: (req, file, callback) => {
    const extension = file.mimetype.split("/")[1];
    callback(null, `${req.user.id}-${uuid()}.${extension}`);
  },
});

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
  } else {
    callback(HttpError(400), "Images only!!!");
  }
};
const upload = multer({
  storage: multerstorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 mb
  },
}).single("avatar");

module.exports = upload;
