// What the app is allowed to hold in memory. Never includes the password.
export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: "CUSTOMER" | "ADMIN";
}

// What the (fake) database stores. Only the service layer should ever see this.
export interface StoredUser extends User {
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}
