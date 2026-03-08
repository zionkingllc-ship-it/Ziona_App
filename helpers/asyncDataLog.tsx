import AsyncStorage from "@react-native-async-storage/async-storage"

export const debugAuthStorage = async () => {
  try {
    const value = await AsyncStorage.getItem("auth-storage")

    console.log("🔵 ASYNC STORAGE AUTH DATA:")
    console.log(JSON.parse(value || "{}"))
  } catch (err) {
    console.log("AsyncStorage read error", err)
  }
}