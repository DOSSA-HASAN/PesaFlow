import jwt from "jsonwebtoken"
import "dotenv/config.js"

// accessToken gen
export const generateAccessToken = (payload) => {
    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_SECRET,
        {expiresIn: "1h"}
    )
    return accessToken
}

// refreshToken gen
export const generateRefreshToken = (payload) => {
    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_SECRET,
        {expiresIn: "2d"}
    )
    return refreshToken
}