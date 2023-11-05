const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder based on file properties or request data
    let folder;
    if (file.fieldname === "avatar") {
      folder = "drinkMaster/avatar";
    } else if (file.fieldname === "drinkThumb") {
      folder = "drinkMaster/drink";
    } else {
      folder = "others";
    }
    return {
      folder: folder,
      allowed_formats: ["jpg", "png"], // Adjust the allowed formats as needed
      public_id: file.fieldname === "avatar" ? req.user.id : file.originalname,
      transformation: [
        { width: 350, height: 350 },
        { width: 700, height: 700 },
      ],
    };
  },
});

exports.uploadAvatar = multer({ storage }).single("avatar");
exports.uploadDrinkThumb = multer({ storage }).single("drinkThumb");
