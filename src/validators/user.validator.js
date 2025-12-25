import ApiError from "../utils/ApiError.js";

const validateRegisterUser = ({ fullName, email, username, password }) => {
    const requiredFields = { fullName, email, username, password };

    for (const [key, value] of Object.entries(requiredFields)) {
        if (typeof value !== "string") {
            throw new ApiError(400, `${key} is not valid`);
        }
        if (value.trim() === "") {
            throw new ApiError(400, `${key} is required`);
        }
    }

    // email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    // password length
    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }

    // username rules
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        throw new ApiError(
            400,
            "Username can contain only letters, numbers, and underscores"
        );
    }
};

export default validateRegisterUser;
