import { Home, Plus, Search, User, Users } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          height: 64,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ focused }) => (
            <Home color={focused ? "white" : "gray"} />
          ),
        }}
      />

      <Tabs.Screen
        name="circles"
        options={{
          tabBarIcon: ({ focused }) => (
            <Users color={focused ? "white" : "gray"} />
          ),
        }}
      />

      {/* CREATE BUTTON */}
      <Tabs.Screen
        name="create"
        options={{
          href: null, //  not a route
          tabBarIcon: () => <Plus color="white" size={28} />,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <Search color={focused ? "white" : "gray"} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <User color={focused ? "white" : "gray"} />
          ),
        }}
      />
    </Tabs>
  );
}
