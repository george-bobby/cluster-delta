import express from "express";
import imagekit from "../config/imagekit.js";
import multer from "multer";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

const configureImageKitRoutes = (app) => {
  const router = express.Router();

  // Authentication endpoint for client-side uploads
  router.get("/auth", (req, res) => {
    try {
      const authenticationParameters = imagekit.getAuthenticationParameters();
      res.send(authenticationParameters);
    } catch (error) {
      console.error("Error generating authentication parameters:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Server-side image upload endpoint
  router.post("/upload-image", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Read the file
      const fileBuffer = fs.readFileSync(req.file.path);
      
      // Upload to ImageKit
      const result = await imagekit.upload({
        file: fileBuffer,
        fileName: req.file.originalname || `image_${Date.now()}`,
        folder: "/posts"
      });

      // Clean up temporary file
      fs.unlinkSync(req.file.path);

      res.status(200).json({ 
        secure_url: result.url,
        fileId: result.fileId,
        name: result.name
      });
    } catch (error) {
      console.error("Error uploading image to ImageKit:", error);
      
      // Clean up temporary file if it exists
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error("Error cleaning up temporary file:", cleanupError);
        }
      }
      
      res.status(500).json({ message: "Image upload failed" });
    }
  });

  app.use("/imagekit", router);
};

export { configureImageKitRoutes };
