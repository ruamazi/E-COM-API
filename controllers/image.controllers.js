import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";

cloudinary.config({
 cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadImage = async (req, res) => {
 try {
  if (!req.file) {
   return res.status(400).json({ error: "No file uploaded" });
  } else {
   const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
     const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) return reject(error);
      resolve(result);
     });
     streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
   };
   const result = await streamUpload(req);
   res.json({ imageUrl: result.secure_url });
  }
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to upload image" });
 }
};
