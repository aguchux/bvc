interface AppState {
  isBusy: boolean;
  moodleToken: string | null;
}

interface AuthContextValue {
  user: AuthUserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (next: AuthUserProfile | null) => void;
  clearUser: () => void;
}
