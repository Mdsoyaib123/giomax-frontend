// src/redux/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { User, TAuth, LoginResponse } from "@/redux/types/auth.type";
import { authApi } from "./authApi";

interface DecodedToken {
  // be permissive - different backends use different claim names
  id?: string;
  sub?: string;
  userId?: string;
  email?: string;
  role?: string;
  name?: string;
  iat?: number;
  exp?: number;
  [k: string]: any;
}

const initialState: TAuth = {
  user: null,
  token: null,
};

const decodeToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const id = decoded.userId || decoded.id || decoded.sub || decoded._id || "";
    const user: User = {
      id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
    return user;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      Cookies.set("token", action.payload.token, { expires: 1 }); // 1 day
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove("token");
      localStorage.removeItem("user");
    },
    loadUserFromToken: (state) => {
      const token = Cookies.get("token");
      if (token) {
        const user = decodeToken(token);
        if (user) {
          state.user = user;
          state.token = token;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // When login mutation fulfills
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<LoginResponse>) => {
        const payload = action.payload;
        const token = payload.data?.accessToken;
        if (token) {
          const userFromToken = decodeToken(token);
          // fallback: backend may return user info in payload.data.user
          const userFromPayload = payload.data?.user;
          const user: User =
            userFromToken ||
            (userFromPayload
              ? {
                  id:
                    (userFromPayload as any).id ||
                    (userFromPayload as any)._id ||
                    payload.data.userId ||
                    "",
                  email: userFromPayload.email,
                  name: userFromPayload.name,
                  role: userFromPayload.role || payload.data.role,
                }
              : {
                  id: payload.data.userId || "",
                  role: payload.data.role,
                });

          state.user = user;
          state.token = token;
          Cookies.set("token", token, { expires: 1 });
          localStorage.setItem("user", JSON.stringify(user));
        }
      }
    );

    // register fulfillment (simple)
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.data;
      }
    );
  },
});

export const { setUser, logOut, loadUserFromToken } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { jwtDecode } from "jwt-decode";
// import Cookies from "js-cookie";
// import { User, TAuth, LoginResponse } from "@/redux/types/auth.type";
// import { authApi } from "./authApi";
// import { AppRootState } from "@/redux/store";

// interface DecodedToken {
//   id: string;
//   name: string;
//   email: string;
//   role: "admin" | "client" | "distributor" | "accountant";
//   exp: number;
//   iat: number;
// }

// const initialState: TAuth = {
//   user: null,
//   token: null,
// };

// const decodeToken = (token: string): User | null => {
//   try {
//     const decoded = jwtDecode<DecodedToken>(token);
//     return {
//       id: decoded.id,
//       name: decoded.name,
//       email: decoded.email,
//       role: decoded.role,
//     };
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     return null;
//   }
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       Cookies.set("token", action.payload.token, { expires: 1 });
//     },
//     logOut: (state) => {
//       state.user = null;
//       state.token = null;
//       Cookies.remove("token");
//       localStorage.removeItem("user");
//     },
//     loadUserFromToken: (state) => {
//       const token = Cookies.get("token");
//       if (token) {
//         const user = decodeToken(token);
//         if (user) {
//           state.user = user;
//           state.token = token;
//         }
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addMatcher(
//       authApi.endpoints.login.matchFulfilled,
//       (state, { payload }: PayloadAction<LoginResponse>) => {
//         const user = decodeToken(payload.data.accessToken);
//         if (user) {
//           state.user = user;
//           state.token = payload.data.accessToken;
//           Cookies.set("token", payload.data.accessToken, { expires: 1 });
//           localStorage.setItem("user", JSON.stringify(user));
//         }
//       }
//     );
//     builder.addMatcher(
//       authApi.endpoints.register.matchFulfilled,
//       (state, { payload }) => {
//         state.user = payload.data;
//       }
//     );
//   },
// });

// export const { setUser, logOut, loadUserFromToken } = authSlice.actions;
// export default authSlice.reducer;

// export const useCurrentToken = (state: AppRootState) => state.auth.token;
// export const useCurrentUser = (state: AppRootState) => state.auth.user;
