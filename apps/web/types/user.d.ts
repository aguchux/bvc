type MoodleUserType = {
  id: number;
  username: string;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  profileimageurl?: string | null;
  profileImageUrl?: string | null;
  moodleid?: number;
};

type AuthUserResponse = {
  user?: MoodleUserType | null;
  moodleToken?: string;
};

type AuthCredentials = {
  identifier: string;
  password: string;
};

type RegisterPayload = {
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
};

type UserFieldQuery = {
  field: "username" | "email" | "id";
  value: string;
};

type AuthUserProfile = {
  openId: string;
  username?: string;
  name?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  photoUrl?: string;
  role?: string;
  moodleToken?: string;
  profileImageUrl?: string;
  profileimageurl?: string;
};
