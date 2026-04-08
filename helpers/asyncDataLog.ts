import AsyncStorage from "@react-native-async-storage/async-storage";

export const debugAuthStorage = async () => {
  try {
    console.log("[AUTH][DEBUG] 🚀 Reading AsyncStorage");

    const value = await AsyncStorage.getItem("auth-storage");

    if (!value) {
      console.warn("[AUTH][DEBUG] ⚠️ No auth-storage found");
      return;
    }

    console.log("[AUTH][DEBUG] 📦 Raw storage", value);

    let parsed: any;

    try {
      parsed = JSON.parse(value);
    } catch (err) {
      console.error("[AUTH][DEBUG] ❌ JSON parse failed", err);
      return;
    }

    console.log("[AUTH][DEBUG] 🧩 Parsed storage", parsed);

    const state = parsed?.state;

    if (!state) {
      console.warn("[AUTH][DEBUG] ⚠️ Missing state object");
      return;
    }

    const user = state.user;
    const tokens = state.tokens;

    console.log("[AUTH][DEBUG] 🔍 Structure", {
      hasUser: !!user,
      hasTokens: !!tokens,
      isAuthenticated: state.isAuthenticated,
      mode: state.mode,
    });

    if (!user) {
      console.warn(
        "[AUTH][DEBUG] ⚠️ user is null → either not logged in OR store was reset"
      );
      return;
    }

    console.log("[AUTH][DEBUG] ✅ USER OBJECT", user);

    if ((user as any).data) {
      console.error(
        "[AUTH][DEBUG] ❌ INVALID SHAPE: user still wrapped in .data",
        user
      );
    }
  } catch (err) {
    console.error("[AUTH][DEBUG] ❌ AsyncStorage read error", err);
  }
};