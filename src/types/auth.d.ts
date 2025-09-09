export interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
}
  
export interface UserSession {
    name: string;
    email: string;
    // Add other user properties as needed
}
