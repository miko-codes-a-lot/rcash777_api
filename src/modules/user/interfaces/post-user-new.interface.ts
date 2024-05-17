export interface IPostUserNewRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
}

export interface IPostUserNewResponse {
  token: string;
}
