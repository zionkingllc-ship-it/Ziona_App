import CategoryGrid from "@/components/discover/CategoryGrid";
import SearchHeader from "@/components/SearchHeader";
import colors from "@/constants/colors";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack } from "tamagui";
import { ActivityIndicator } from "react-native";

import { useDiscoverCategories } from "@/hooks/useDiscover";

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const { categories, loading } = useDiscoverCategories();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <YStack flex={1}>
        <SearchHeader value={searchQuery} onChangeText={setSearchQuery} />

        {loading ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator />
          </YStack>
        ) : (
          <CategoryGrid
            categories={categories}
            onCategoryPress={(categoryId) =>
              router.push({
                pathname: "/(tabs)/discover/[categoryId]",
                params: { categoryId },
              })
            }
          />
        )}
      </YStack>
    </SafeAreaView>
  );
}