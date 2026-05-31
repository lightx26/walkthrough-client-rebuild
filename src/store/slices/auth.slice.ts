import type { User } from '@/types/auth';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  // true while the initial session restore (GET /auth/me) is in flight.
  // AuthGuard waits for this to be false before deciding to redirect.
  isLoading: boolean;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  } as AuthState,
  reducers: {
    setCredentials(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
