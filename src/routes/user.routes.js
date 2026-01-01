import { Router } from "express"
import upload from "../middlewares/multer.middleware.js"
import verifyJWT from "../middlewares/auth.middleware.js"
import changePasswordLimit from "../middlewares/rateLimit.middleware.js"
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";


const userRouter = Router()

userRouter.route("/register")
    .post(
        upload.fields([
            { name: "avatar", maxCount: 1 },
            { name: "coverImage", maxCount: 1 }
        ]),
        registerUser
    )

// auth
userRouter.route("/login")
    .post(loginUser)

userRouter.route("/logout")
    .post(verifyJWT, logoutUser)

userRouter.route("/refresh-token")
    .post(refreshAccessToken)

// user
userRouter.route("/current-user")
    .get(verifyJWT, getCurrentUser)

userRouter.route("/update-account")
    .patch(verifyJWT, updateAccountDetails)

userRouter.route("/update-avatar")
    .patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

userRouter.route("/update-cover-image")
    .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

userRouter.route("/channel/:username")
    .get(verifyJWT, getUserChannelProfile)

userRouter.route("/history")
    .get(verifyJWT, getWatchHistory)

// security
userRouter.route("/change-password")
    .patch(verifyJWT, changePasswordLimit, changeCurrentPassword)


export default userRouter