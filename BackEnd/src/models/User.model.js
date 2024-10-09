import jwt from 'jsonwebtoken';

export class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.refreshToken = null; 
    }
    
    // Add methods for user-specific logic if needed

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            refreshToken: this.refreshToken
        };
    }

    generateAccessToken() {
        return jwt.sign(
            { id: this.id, name: this.name, email: this.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );
    }

    generateRefreshToken() {
        return jwt.sign(
            { id: this.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );
    }
}
