export interface AuthCredential {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    credential: AuthCredential;
}

export interface AuthMessageResponse {
    message: string;
}
