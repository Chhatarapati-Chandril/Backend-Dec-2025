import multer from "multer"
import path from "path"
import fs from "fs"
import crypto from "crypto"
import ApiError from "../utils/ApiError"

const uploadDir = path.resolve("public/temp")

// if "uploadDir" not exist then create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir)
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname)
        const baseName = path
        .basename(file.originalname, ext)
        .replace(/\s+/g, "_")

        const uniqueName = `${baseName}-${crypto.randomUUID()}${ext}`
        cb(null, uniqueName)
    }
})

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter(req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
          cb(null, true)
        } else {
          cb(new ApiError("Only image files are allowed"), false)
        }
    }
})

export default upload