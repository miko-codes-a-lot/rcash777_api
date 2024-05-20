export interface IPostRefreshTokenRequest {
  refresh_token: string;
}

export interface PostRefreshTokenResponse {
  access_token: string;
}
