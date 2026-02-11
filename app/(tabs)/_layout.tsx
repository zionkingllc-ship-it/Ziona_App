import { Tabs } from "expo-router";
import {
  Home,
  Network,
  Plus,
  Search,
  User,
  Share,
  Users,
} from "@tamagui/lucide-icons";
import { View } from "react-native";
import colors from "@/constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ focused }) => (
            <Home color={focused ? colors.primary : "#777"} size={23} />
          ),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ focused }) => (
            <Search color={focused ? colors.primary : "#777"} size={23} />
          ),
        }}
      />

      {/* CREATE (special handling later) */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => (
            <Plus color={focused ? colors.primary : "#777"} size={30} />
          ),
        }}
      />

      <Tabs.Screen
        name="circle"
        options={{
           title: "Circle",
          tabBarIcon: ({ focused }) => (
            <Network color={focused ? colors.primary : "#777"} size={23} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
           title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Users color={focused ? colors.primary : "#777"} size={23} />
          ),
        }}
      />
    </Tabs>
  );
}
