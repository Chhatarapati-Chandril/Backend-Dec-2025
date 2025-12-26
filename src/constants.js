export const DB_NAME = "videotube"
export const JSON_LIMIT = "64kb"

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
}  