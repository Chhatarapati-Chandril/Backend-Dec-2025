import ApiError from "../utils/ApiError.js";
import isValidPassword from "./rules/password.rule.js";

const validateResetPassword = (password) => {
    if (!isValidPassword(password)) {
        throw new ApiError(400, "Password must be at least 8 characters long")
    }
}

export default validateResetPassword