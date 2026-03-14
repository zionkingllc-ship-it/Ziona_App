import { getCategories } from "@/repository/categoryRepository";
import { DiscoverCategory } from "@/types/discover";
import { Category } from "@/types/category";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, View, XStack } from "tamagui";
import BaseModal from "./BaseModal";

const { height } = Dimensions.get("window");

interface Props {
  visible: boolean
  onClose: () => void
  onSelect: (category: Category) => void
}

export default function CategoryModal({ visible, onClose, onSelect }: Props) {
  const [categories, setCategories] = useState<DiscoverCategory[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <BaseModal visible={visible} onClose={onClose} alignBottom>
      <View style={styles.sheet}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.row,
                { backgroundColor: item.bgColor, borderColor: item.bdColor },
              ]}
              onPress={() => onSelect(item)}
            >
              <XStack
                alignItems="center"
                justifyContent="space-between"
                gap="$3"
              >
                <Text fontWeight="600" fontFamily="$heading" fontSize={20}>
                  {item.label}
                </Text>
                <Image source={item.icon} style={{ width: 30, height: 40 }} />
              </XStack>
            </TouchableOpacity>
          )}
        />
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    height: height * 0.4,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
});
