declare namespace Express {
    interface Request {
        user?: {
            name: string
            picture: string
            email: string
            email_verified: string
            auth_time: string
            user_id: string,
            admin: boolean,
            firebase: {
                identities: any
                sign_in_provider: string
            }
            iat: string
            exp: string
            aud: string
            iss: string
            sub: string
            uid: string
        },
        files?: any
    }
}