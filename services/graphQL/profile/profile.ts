import { graphqlRequest } from "../graphqlClient";
import { getToken } from "../actions/token";

/* =========================
   UPDATE PROFILE
========================= */

export async function updateProfile(input: {
  fullName?: string;
  bio?: string;
  location?: string;
}) {
  const token = getToken();

  const query = `
    mutation UpdateProfile($input: UpdateProfileInput!) {
      updateProfile(input: $input) {
        success
        user {
          id
          username
          fullName
          bio
          avatarUrl
          location
        }
        error { code message }
      }
    }
  `;

  const data = await graphqlRequest(query, { input }, token);

  const res = data?.updateProfile;

  if (!res?.success) {
    throw new Error(res?.error?.message || "Update failed");
  }

  return res.user;
}

/* =========================
   UPDATE AVATAR
========================= */

export async function updateAvatar(file: any) {
  const token = getToken();

  const query = `
    mutation UpdateAvatar($file: Upload!) {
      updateAvatar(file: $file) {
        success
        avatarUrl
        error { code message }
      }
    }
  `;

  const data = await graphqlRequest(query, { file }, token);

  const res = data?.updateAvatar;

  if (!res?.success) {
    throw new Error(res?.error?.message || "Avatar update failed");
  }

  return res.avatarUrl;
}