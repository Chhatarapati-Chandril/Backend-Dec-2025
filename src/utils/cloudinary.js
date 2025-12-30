import { v2 as cloudinary } from "cloudinary"
import fs from "fs/promises"

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
)

const uploadOnCloudinary = async (localFilePath) => {

    if(!localFilePath)  return null

    try {
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // console.log("file is uploaded on cloudinary", response.public_id)
        // console.log(response);
        
        return response
    } catch (error) {
        console.error("Cloudinary upload failed:", error.message)
        return null
    } finally {
        // ALWAYS clean up local file if it exists
        try {
            await fs.unlink(localFilePath)
        } catch (error) {
            console.error("Failed to delete temp file:", error.message);
        }        
    }
}

export default uploadOnCloudinary