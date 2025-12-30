import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {

    const authHeader = req.header("Authorization") || req.header("authorization")

    const token = 
    req.cookies?.accessToken ||
    (authHeader?.toLowerCase().startsWith("bearer ") && authHeader.split(" ")[1])

    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid or expired access token")
    }

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(401, "Invalid access token")
    }

    // invalidate token if password changed
    if (
        user.passwordChangedAt &&
        decodedToken.iat * 1000 < user.passwordChangedAt.getTime()
    ) {
        throw new ApiError(401, "Access token expired due to password change");
    }

    req.user = user
    next()

})

export default verifyJWT