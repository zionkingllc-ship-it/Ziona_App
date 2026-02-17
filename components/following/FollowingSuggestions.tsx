// components/screens/FollowSuggestions.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet, 
} from "react-native";
import colors from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

interface User {
  id: string;
  name: string;
  avatar: string; // URL or require(...)
}

const mockSuggestions: User[] = [
  { id: "1", name: "Ziona", avatar: "https://i.pravatar.cc/150?img=32" },
  { id: "2", name: "Pastor David", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "3", name: "Lola", avatar: "https://i.pravatar.cc/150?img=45" },
  { id: "4", name: "Rebecca", avatar: "https://i.pravatar.cc/150?img=23" },
  { id: "5", name: "Joseph", avatar: "https://i.pravatar.cc/150?img=19" },
  { id: "6", name: "Sarah", avatar: "https://i.pravatar.cc/150?img=7" },
];

export default function FollowSuggestions() {
  const [following, setFollowing] = useState<string[]>([]);

  const toggleFollow = (userId: string) => {
    setFollowing((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const renderItem = ({ item }: { item: User }) => {
    const isFollowing = following.includes(item.id);
    return (
      <View style={styles.userRow}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{item.name}</Text>
        <TouchableOpacity
          style={[styles.followBtn, isFollowing && styles.followingBtn]}
          onPress={() => toggleFollow(item.id)}
        >
          <Text
            style={[
              styles.followBtnText,
              isFollowing && styles.followingBtnText,
            ]}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.tabTitle}>For You</Text>
        <Text style={[styles.tabTitle, styles.tabActive]}>Following</Text>
      </View>

      <View style={styles.messageContainer}>
        {following.length === 0 && (
          <Text style={styles.messageText}>
            You are currently not following anyone
          </Text>
        )}
      </View>

      <FlatList
        data={mockSuggestions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  tabTitle: {
    fontSize: 16,
    color: colors.gray,
    marginHorizontal: 16,
  },
  tabActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  messageContainer: {
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 24,
  },
  messageText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
  },
  listContent: { paddingHorizontal: 16, paddingTop: 8 },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userName: { flex: 1, fontSize: 16, fontWeight: "500", color: colors.black },
  followBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  followBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  followingBtn: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  followingBtnText: {
    color: colors.primary,
  },
});