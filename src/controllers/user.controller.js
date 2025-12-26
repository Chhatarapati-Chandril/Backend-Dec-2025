import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import validateRegisterUser from "../validators/user.validator.js";
import jwt from "jsonwebtoken";
import generateAccessAndRefreshToken from "../services/auth.service.js";
import { cookieOptions } from "../constants.js";


// ******************* register user *******************

const registerUser = asyncHandler(async (req, res) => {

    // 1. Extract user data from request body
    const { fullName, email, username, password } = req.body;

    // 2. Validate required fields
    validateRegisterUser({ fullName, email, username, password })

    const normalizedUserName = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    // 3. Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username: normalizedUserName }, { email: normalizedEmail }],
    });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // 4. Check for avatar in request
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // 5. Upload images to Cloudinary (after validation)
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    let coverImage;
    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
    }

    // 6. Hash password - already done in user.model.js

    // 7. Create user document in database
    if (!normalizedUserName || !normalizedEmail) {
        throw new ApiError(500, "Invalid normalized data")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email: normalizedEmail,
        password,
        username: normalizedUserName,
    });

    // 8. Remove sensitive fields (password, refreshToken)
    // const createdUser = await User.findById(user._id).select(
    //     "-password -refreshToken"
    // )
    const createdUser = user.toObject()
    delete createdUser.password;
    delete createdUser.refreshToken;

    // 9. Send response
    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        )
    }

    const response = new ApiResponse(
        201,
        createdUser,
        "User registered successfully"
    );
    return res.status(201).json({ ...response })
})


// ******************* login user *******************

const loginUser = asyncHandler(async (req, res) => {

    const {email, username, password} = req.body
    
    // 1. Required fields
    if ((!username && !email) || !password) {
        throw new ApiError(400, "username or email and password is required")
    }

    // 2. Normalize
    const normalizedEmail = email?.toLowerCase()
    const normalizedUsername = username?.toLowerCase()

    // 3. Build safe query for finding user
    const query = []
    if(normalizedEmail) query.push({ email: normalizedEmail })
    if(normalizedUsername) query.push({ username: normalizedUsername })

    const user = await User.findOne({ $or: query })
    
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    // 4. Password check
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    // 5. Generating tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;      
    
    // 6. Sending cookies
    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200, 
            {   user: loggedInUser },
            "User logged in successfully"
        )
    )

})


// ******************* logout user *******************

const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized")
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: true }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out"))
})


// ******************* refreshing access token *******************
const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    let decodedToken
    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token")
    }

    const user = await User.findById(decodedToken?._id)
    if (!user) {
        throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200, 
            {   accessToken, refreshToken },
            "Access token refreshed successfully"
        )
    )

})

export {
    registerUser, 
    loginUser,
    logoutUser,
    refreshAccessToken
}