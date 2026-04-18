const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

exports.upload = async (base64) => {
  const res = await cloudinary.uploader.upload(base64);
  return res.secure_url;
};