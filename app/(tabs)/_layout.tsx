import colors from "@/constants/colors";
import { Tabs } from "expo-router";
import { Image } from "tamagui";

export default function TabsLayout() {
  const homeActive = require("@/assets/images/homeTabB.png");
  const homeInActive = require("@/assets/images/HomeTabA.png");

  const discoverActive = require("@/assets/images/discoverTabB.png");
  const discoverInActive = require("@/assets/images/discoverTabA.png");

  const createActive = require("@/assets/images/createTabsB.png");
  const createInActive = require("@/assets/images/createTabsA.png");

  const circleInActive = require("@/assets/images/circleTabA.png");
  const circleActive = require("@/assets/images/circleTabB.png");

  const profile = require("@/assets/images/profile.png");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 13, // try 13–14 for subtle increase
          fontWeight: "400", 
        },
      }}
    >
 <Tabs.Screen
  name="feed"
  options={{
    title: "Home", 
     freezeOnBlur: true,
    tabBarIcon: ({ focused }) => (
      <Image
        src={focused ? homeActive : homeInActive}
        width={23}
        height={23}
      />
    ),
  }}
/>
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          freezeOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <Image
              src={focused ? discoverActive : discoverInActive}
              width={23}
              height={23}
            />
          ),
        }}
      />

      {/* CREATE */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => (
            <Image
              src={focused ? createActive : createInActive}
              width={23}
              height={23}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="circle"
        options={{
          title: "Circle",
          tabBarIcon: ({ focused }) => (
            <Image
              src={focused ? circleActive : circleInActive}
              width={23}
              height={23}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => <Image src={profile} width={23} height={23} />,
        }}
      />
    </Tabs>
  );
}
