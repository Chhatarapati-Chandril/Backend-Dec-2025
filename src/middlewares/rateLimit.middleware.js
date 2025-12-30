import rateLimit from "express-rate-limit"
import ApiError from "../utils/ApiError.js"

const changePasswordLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5,                // STRICT: 5 attempts only
    standardHeaders: "draft-8",
    legacyHeaders: false,

    handler: (req, res, next) => {
        next(
            new ApiError(429, "Too many password change attempts. Try again later.")
        )
    }

})

export default changePasswordLimit