import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://reqres.in/api";
const headers = {
  "x-api-key": "reqres-free-v1",
  "Content-Type": "application/json",
};

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    registerSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.token = action.payload.token;
    },
    
    setUser: (state, action) => {
      state.user = action.payload;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  registerSuccess,
  loginSuccess,
  setUser,
  logout,
} = authSlice.actions;

export const register = (userData) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${API_URL}/register`, userData, { headers });
      dispatch(registerSuccess());
      return response.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.error || error.message));
      throw error;
    }
  };
};

export const login = (userData) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${API_URL}/login`, userData, { headers });
      console.log('user login', response);
      dispatch(loginSuccess({ token: response.data.token }));
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.error || error.message));
      throw error;
    }
  };
};

export const fetchUser = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/users/2`, { headers });
      console.log('fetchUser', response);
      dispatch(setUser(response.data.data));
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  };
};

export default authSlice.reducer;