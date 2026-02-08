"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { setMoodleToken } from "store/slices/app.slice";
import { useCurrentUserQuery } from "store/apis/auth.api";
import { getSessionToken } from "lib/auth/session";

const STORAGE_KEY = "mvc_user_profile";

const AuthContext = createContext<AuthContextValue | null>(null);

const asString = (value?: unknown) =>
    typeof value === "string" && value.trim() ? value.trim() : undefined;

function tryParseProfile(payload: unknown): AuthUserProfile | null {
    if (!payload || typeof payload !== "object") {
        return null;
    }
    const user = payload as Record<string, unknown>;
    const username = asString(
        user["username"] ?? user["userName"] ?? user["user_id"],
    );
    const email = asString(user["email"]);
    const openId = asString(user["openId"]) || username || email;
    if (!openId) {
        return null;
    }
    const firstname = asString(user["firstname"] ?? user["firstName"]);
    const lastname = asString(user["lastname"] ?? user["lastName"]);
    const nameFromParts = [firstname, lastname].filter(Boolean).join(" ").trim();
    const name =
        asString(user["name"]) ||
        (nameFromParts ? nameFromParts : undefined) ||
        username ||
        openId;
    const photoUrl =
        asString(user["photoUrl"]) ||
        asString(user["profileimageurl"]) ||
        asString(user["profileImageUrl"]) ||
        asString(user["picture"]);

    return {
        openId,
        username,
        name,
        firstname,
        lastname,
        email,
        photoUrl,
        role: asString(user["role"]),
        moodleToken: asString(user["moodleToken"]),
    };
}

export function normalizeUserProfile(
    payload?: { user?: unknown; moodleToken?: string },
    fallback?: Partial<AuthUserProfile>,
): AuthUserProfile | null {
    const candidate = payload?.user ?? fallback;
    const parsed = tryParseProfile(candidate ?? {});
    if (!parsed) {
        if (fallback && fallback.openId) {
            return {
                openId: fallback.openId,
                username: fallback.username ?? fallback.openId,
                name: fallback.name ?? fallback.openId,
                firstname: fallback.firstname,
                lastname: fallback.lastname,
                email: fallback.email,
                photoUrl: fallback.photoUrl,
                role: fallback.role,
                moodleToken: payload?.moodleToken ?? fallback.moodleToken,
            };
        }
        return null;
    }
    if (payload?.moodleToken) {
        parsed.moodleToken = parsed.moodleToken ?? payload.moodleToken;
    }
    return parsed;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<AuthUserProfile | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const dispatch = useAppDispatch();
    const persistedToken = useAppSelector((state) => state.app.moodleToken);
    const cookieToken = getSessionToken();
    const queryToken = persistedToken ?? cookieToken;
    const shouldFetchCurrentUser = Boolean(queryToken);

    useEffect(() => {
        if (typeof window === "undefined") {
            setHydrated(true);
            return;
        }
        const stored = window.localStorage.getItem(STORAGE_KEY);
        // alert(stored);
        if (stored) {
            try {
                setUserState(JSON.parse(stored));
            } catch (error) {
                console.warn("Failed to parse stored auth profile", error);
            }
        }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (cookieToken && cookieToken !== persistedToken) {
            dispatch(setMoodleToken(cookieToken));
            return;
        }
        if (!cookieToken && persistedToken !== null) {
            dispatch(setMoodleToken(null));
        }
    }, [cookieToken, persistedToken, dispatch]);

    const setUser = useCallback((next: AuthUserProfile | null) => {
        setUserState(next);
        if (typeof window === "undefined") {
            return;
        }
        if (next) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } else {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const clearUser = useCallback(() => {
        setUser(null);
        dispatch(setMoodleToken(null));
    }, [setUser, dispatch]);

    const {
        data: currentUserData,
        isFetching: isFetchingCurrentUser,
        isLoading: isLoadingCurrentUser,
    } = useCurrentUserQuery(queryToken ? { moodleToken: queryToken } : {}, {
        skip: !shouldFetchCurrentUser,
    });

    useEffect(() => {
        if (!shouldFetchCurrentUser) {
            return;
        }
        if (currentUserData?.user) {
            const profile = normalizeUserProfile({
                user: currentUserData.user,
                moodleToken: queryToken ?? undefined,
            });
            setUser(profile ?? null);
            return;
        }
        if (!isFetchingCurrentUser && !currentUserData) {
            setUser(null);
        }
    }, [
        currentUserData,
        isFetchingCurrentUser,
        queryToken,
        shouldFetchCurrentUser,
        setUser,
    ]);

    const isCurrentUserRequesting =
        shouldFetchCurrentUser && (isLoadingCurrentUser || isFetchingCurrentUser);

    const value = useMemo(
        () => ({
            user,
            loading: !hydrated || isCurrentUserRequesting,
            isAuthenticated: !!user,
            setUser,
            clearUser,
        }),
        [user, hydrated, setUser, clearUser, isCurrentUserRequesting],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const useUserProfile = () => useAuth().user;

export default AuthProvider;
