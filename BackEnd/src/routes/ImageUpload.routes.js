// s3Upload.js
import AWS from "aws-sdk";
import multer from "multer";
import express from "express";
import { updateProfilePicture } from "../services/profileService.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const upload = multer();

router.post(
    "/upload-image",
    upload.single("image"),
    async (req, res) => {
        try {
            console.log(req.body)
            // Ensure user is authenticated and userId is available
            const {userId} = req.body; // Adjust according to your auth setup

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `profile-pictures/${userId}_${Date.now()}_${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };

            // Upload to S3
            const s3Upload = await s3.upload(params).promise();

            // Update Firebase with the new profile picture URL
            await updateProfilePicture(userId, s3Upload.Location);

            res.status(200).json({
                success: true,
                url: s3Upload.Location,
            });
        } catch (error) {
            console.error("Error in profile picture upload:", error);
            res.status(500).json({
                success: false,
                error: "Failed to upload profile picture",
            });
        }
    }
);

export default router;
