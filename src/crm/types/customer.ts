export interface CustomerName {
  title: string;
  first: string;
  last: string;
}

export interface CustomerLocation {
  street: {
    number: number;
    name: string;
  };
  city: string;
  state: string;
  country: string;
  postcode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timezone?: {
    offset: string;
    description: string;
  };
}

export interface CustomerDateOfBirth {
  date: string;
  age: number;
}

export interface CustomerRegistered {
  date: string;
  age: number;
}

export interface CustomerPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface CustomerLogin {
  uuid: string;
  username: string;
  password?: string;
}

export interface Customer {
  login: CustomerLogin;
  name: CustomerName;
  gender: string;
  location: CustomerLocation;
  email: string;
  dob: CustomerDateOfBirth;
  registered: CustomerRegistered;
  phone: string;
  cell: string;
  picture: CustomerPicture;
  nat: string;
}

export interface CustomersResponse {
  page: number;
  perPage: number;
  total: number;
  span: string;
  effectivePage: number;
  data: Customer[];
}

export interface CreateCustomerRequest {
  email: string;
  login: {
    username: string;
    password: string;
  };
  name: {
    first: string;
    last: string;
    title: string;
  };
  gender: string;
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
  phone?: string;
  cell?: string;
}

export interface UpdateCustomerRequest {
  name?: Partial<CustomerName>;
  location?: Partial<CustomerLocation>;
  email?: string;
  phone?: string;
  cell?: string;
}
