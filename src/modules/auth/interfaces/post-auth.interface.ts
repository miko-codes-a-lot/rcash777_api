export interface IPostAuthLoginRequest {
  email: string;
  password: string;
}

export interface IPostAuthLoginResponse {
  access_token: string;
  refresh_token: string;
}
