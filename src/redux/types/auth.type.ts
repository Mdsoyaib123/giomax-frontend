// src/redux/types/auth.type.ts
export type User = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  businessName?: string;
  address_Pickup_Location?: string;
  phone?: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refresh_token?: string;
    role?: string;
    userId?: string;
    // sometimes backend returns user object - keep flexible
    user?: Partial<User>;
  };
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: User;
};

export type TAuth = {
  user: User | null;
  token: string | null;
};

export type RegisterRequest = {
  name: string;
  businessName?: string;
  address_Pickup_Location?: string;
  phone?: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   role: "admin" | "client" | "distributor" | "accountant";
//   businessName?: string;
//   address_Pickup_Location?: string;
//   phone?: string;
// };

// export type LoginResponse = {
//   success: boolean;
//   message: string;
//   data: {
//     accessToken: string;
//     user: User;
//   };
// };

// export type RegisterResponse = {
//   success: boolean;
//   message: string;
//   data: User;
// };

// export type TAuth = {
//   user: User | null;
//   token: string | null;
// };

// export type RegisterRequest = {
//   name: string;
//   businessName: string;
//   address_Pickup_Location: string;
//   phone: string;
//   email: string;
//   password: string;
// };

// export type LoginRequest = {
//   email: string;
//   password: string;
// };
