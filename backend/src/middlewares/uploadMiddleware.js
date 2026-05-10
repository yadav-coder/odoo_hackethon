const upload = require("../config/multer");

const uploadProfile = upload.single("profile");
const uploadTripImage = upload.single("tripImage");

module.exports = {
  uploadProfile,
  uploadTripImage
};

