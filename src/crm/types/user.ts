export interface UserLogin {
  uuid: string;
  username: string;
  password: string;
}

export interface UserName {
  title: string;
  first: string;
  last: string;
}

export interface UserStreet {
  number: number;
  name: string;
}

export interface UserCoordinates {
  latitude: number;
  longitude: number;
}

export interface UserTimezone {
  offset: string;
  description: string;
}

export interface UserLocation {
  street: UserStreet;
  city: string;
  state: string;
  country: string;
  postcode: string;
  coordinates: UserCoordinates;
  timezone: UserTimezone;
}

export interface UserDob {
  date: string;
  age: number;
}

export interface UserRegistered {
  date: string;
  age: number;
}

export interface UserPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface User {
  login: UserLogin;
  name: UserName;
  gender: string;
  location: UserLocation;
  email: string;
  dob: UserDob;
  registered: UserRegistered;
  phone: string;
  cell: string;
  picture: UserPicture;
  nat: string;
}

export interface UsersApiResponse {
  page: number;
  perPage: number;
  total: number;
  span: string;
  effectivePage: number;
  data: User[];
}

export interface UserUpdateRequest {
  email?: string;
  login?: Partial<UserLogin>;
  name?: Partial<UserName>;
  gender?: string;
  location?: Partial<UserLocation>;
  phone?: string;
  cell?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  uuid?: string;
}
