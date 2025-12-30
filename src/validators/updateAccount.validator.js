import ApiError from "../utils/ApiError.js";
import normalizeEmail from "./rules/email.rule.js";

const validateUpdateAccount = ({ fullName, email }) => {
    
    // at least one field must be present
    if (fullName === undefined && email === undefined) {
        throw new ApiError(400, "At least one field is required to update");
    }

    const updateData = {};

    // fullName (optional)
    if (fullName !== undefined) {
        if (typeof fullName !== "string" || fullName.trim() === "") {
            throw new ApiError(400, "Full name must be a valid string");
        }
        updateData.fullName = fullName.trim();
    }

    // email (optional)
    if (email !== undefined) {
        const normalizedEmail = normalizeEmail(email);
        if (!normalizedEmail) {
            throw new ApiError(400, "Invalid email format");
        }
        updateData.email = normalizedEmail;
    }

    return updateData
}

export default validateUpdateAccount