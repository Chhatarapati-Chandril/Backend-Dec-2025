import ApiError from "../utils/ApiError.js";
import normalizeEmail from "./rules/email.rule.js";
import isValidPassword from "./rules/password.rule.js";
import normalizeUsername from "./rules/username.rule.js"

const validateRegisterUser = ({ fullName, email, username, password }) => {

    if (!fullName || !email || !username || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
        throw new ApiError(400, "Invalid email format");
    }

    if (!isValidPassword(password)) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }

    const normalizedUsername = normalizeUsername(username);
    if (!normalizedUsername) {
        throw new ApiError(400, "Invalid username");
    }

    return {
        fullName: fullName.trim(),
        email: normalizedEmail,
        username: normalizedUsername,
        password
    }

    // const requiredFields = { fullName, normalizedEmail, normalizedUsername, password };

    // for (const [key, value] of Object.entries(requiredFields)) {
    //     if (typeof value !== "string") {
    //         throw new ApiError(400, `${key} is not valid`);
    //     }
    //     if (value.trim() === "") {
    //         throw new ApiError(400, `${key} is required`);
    //     }
    // }

}

export default validateRegisterUser;