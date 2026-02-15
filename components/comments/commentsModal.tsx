// import colors from "@/constants/colors";
// import { Heart } from "@tamagui/lucide-icons";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Dimensions,
//   FlatList,
//   LayoutChangeEvent,
//   Modal,
//   Pressable,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";
// import { Image, Text, View, XStack, YStack } from "tamagui";
// import { KeyboardAvoidingWrapper } from "../layout/KeyboardAvoidingWrapper";

// const { height } = Dimensions.get("window");
// const likeIconActive = require("@/assets/images/likeIcon2.png");

// type Comment = {
//   id: string;
//   name: string;
//   text: string;
//   time: string;
//   liked: boolean;
//   likeCount: number;
// };

// type Props = {
//   visible: boolean;
//   onClose: () => void;
// };

// const INITIAL_COMMENTS: Comment[] = Array.from({ length: 20 }).map((_, i) => ({
//   id: String(i),
//   name: "Pastor David",
//   text: "This is exactly what I preach",
//   time: "5 mins",
//   liked: false,
//   likeCount: Math.floor(Math.random() * 10),
// }));

// const EMOJIS = ["😀", "🥰", "😂", "😳", "😌", "😁", "🥺", "😏", "😬"];

// export function CommentsSheet({ visible, onClose }: Props) {
//   const translateY = useSharedValue(height);

//   const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
//   const [inputValue, setInputValue] = useState("");
//   const [isFocused, setIsFocused] = useState(false);
//   const [bottomHeight, setBottomHeight] = useState(10);

//   const inputRef = useRef<TextInput>(null);

//   useEffect(() => {
//     translateY.value = withTiming(visible ? 0 : height, { duration: 300 });
//   }, [visible]);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//   }));

//   const toggleLike = (id: string) => {
//     setComments((prev) =>
//       prev.map((c) =>
//         c.id === id
//           ? {
//               ...c,
//               liked: !c.liked,
//               likeCount: c.liked ? c.likeCount - 1 : c.likeCount + 1,
//             }
//           : c,
//       ),
//     );
//   };

//   const onBottomLayout = (e: LayoutChangeEvent) => {
//     setBottomHeight(e.nativeEvent.layout.height);
//   };

//   const addEmoji = (emoji: string) => {
//     setInputValue((prev) => prev + emoji);
//     inputRef.current?.focus();
//   };

//   return (
//     <Modal
//       transparent
//       visible={visible}
//       animationType="slide"
//       statusBarTranslucent
//     >
//       <View style={{ flex: 1 }}>
//         <KeyboardAvoidingWrapper>
//           {/* BACKDROP (separate layer) */}
//           <Pressable
//             onPress={onClose}
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               backgroundColor: "rgba(0,0,0,0.4)",
//             }}
//           />

//           {/* SHEET CONTAINER */}
//           <View
//             style={{
//               flex: 1,
//               justifyContent: "flex-end",
//             }}
//             pointerEvents="box-none"
//           >
//             <Animated.View
//               style={[
//                 {
//                   maxHeight: height * 0.7,
//                   flex: 1,
//                   backgroundColor: "white",
//                   borderTopLeftRadius: 30,
//                   borderTopRightRadius: 30,
//                   overflow: "hidden",
//                 },
//               ]}
//             >
//               {/* HEADER */}
//               <YStack
//                 padding="$4"
//                 borderBottomWidth={1}
//                 borderColor="#eee"
//                 alignItems="center"
//               >
//                 <Text fontWeight="600" fontSize="$4">
//                   Comments
//                 </Text>
//               </YStack>

//               {/* LIST */}
//               <View style={{ flex: 1 }}>
//                 <FlatList
//                   data={comments}
//                   keyExtractor={(item) => item.id}
//                   style={{ flex: 1 }}
//                   nestedScrollEnabled
//                   keyboardShouldPersistTaps="handled"
//                   contentContainerStyle={{
//                     padding: 16,
//                     paddingBottom: bottomHeight,
//                   }}
//                   renderItem={({ item }) => (
//                     <XStack justifyContent="space-between" padding="$4">
//                       <XStack gap="$2" flex={1}>
//                         <Image
//                           source={{ uri: "https://i.pravatar.cc/100" }}
//                           width={30}
//                           height={30}
//                           borderRadius={50}
//                         />

//                         <YStack flex={1}>
//                           <XStack gap="$2" alignItems="center">
//                             <Text fontWeight="600" fontSize={16}>
//                               {item.name}
//                             </Text>
//                             <Text color="#999" fontSize={10}>
//                               {item.time}
//                             </Text>
//                           </XStack>

//                           <Text fontSize={13}>{item.text}</Text>

//                           <XStack marginTop={15} gap={15}>
//                             <TouchableOpacity>
//                               <Text fontSize={10}>Reply</Text>
//                             </TouchableOpacity>
//                           </XStack>
//                         </YStack>
//                       </XStack>

//                       <Pressable onPress={() => toggleLike(item.id)}>
//                         {item.liked ? (
//                           <Image
//                             source={likeIconActive}
//                             width={24}
//                             height={24}
//                           />
//                         ) : (
//                           <Heart size={24} color={colors.primary} />
//                         )}
//                         <Text fontSize={10} textAlign="center">
//                           {item.likeCount}
//                         </Text>
//                       </Pressable>
//                     </XStack>
//                   )}
//                 />
//               </View>

//               {/* INPUT SECTION */}
//               <YStack
//                 borderTopWidth={1}
//                 borderColor="#eee"
//                 onLayout={onBottomLayout}
//               >
//                 <XStack
//                   padding="$3"
//                   gap="$2"
//                   alignItems="center"
//                   backgroundColor={"#FAF9FA"}
//                   borderWidth={1}
//                   borderColor={"#EEEBEF"}
//                   marginHorizontal={10}
//                   paddingHorizontal= {14}
//                   borderRadius={8}
//                   marginVertical={10}
//                   minHeight={43}
//                   maxHeight={"$10"}
//                 >
//                   <TextInput
//                     ref={inputRef}
//                     multiline
//                     placeholder="Join the conversation..."
//                     placeholderTextColor={"#836F8B"}
//                     value={inputValue}
//                     onChangeText={setInputValue}
//                     onFocus={() => setIsFocused(true)}
//                     onBlur={() => setIsFocused(false)}
//                     style={{
//                       flex: 1,
//                     }}
//                   />
//                   <Image
//                     source={require("@/assets/images/sendIcon.png")}
//                     width={30}
//                     height={30}
//                   />
//                 </XStack>

//                 {isFocused && (
//                   <XStack paddingHorizontal="$3" paddingBottom="$3" gap="$3">
//                     {EMOJIS.map((emoji) => (
//                       <Text
//                         key={emoji}
//                         fontSize={22}
//                         onPress={() => addEmoji(emoji)}
//                       >
//                         {emoji}
//                       </Text>
//                     ))}
//                   </XStack>
//                 )}
//               </YStack>
//             </Animated.View>
//           </View>
//         </KeyboardAvoidingWrapper>
//       </View>
//     </Modal>
//   );
// }

import colors from "@/constants/colors";
import { Heart } from "@tamagui/lucide-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Keyboard,
  LayoutChangeEvent,
  Modal,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Image, Text, View, XStack, YStack } from "tamagui";

const { height } = Dimensions.get("window");
const likeIconActive = require("@/assets/images/likeIcon2.png");

type Comment = {
  id: string;
  name: string;
  text: string;
  time: string;
  liked: boolean;
  likeCount: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

const INITIAL_COMMENTS: Comment[] = Array.from({ length: 20 }).map((_, i) => ({
  id: String(i),
  name: "Pastor David",
  text: "This is exactly what I preach",
  time: "5 mins",
  liked: false,
  likeCount: Math.floor(Math.random() * 10),
}));

const EMOJIS = ["😀", "🥰", "😂", "😳", "😌", "😁", "🥺", "😏", "😬"];

export function CommentsSheet({ visible, onClose }: Props) {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [bottomHeight, setBottomHeight] = useState(10);

  const inputRef = useRef<TextInput>(null);

  /* -------------------------
     KEYBOARD CONTROL (FIX)
  -------------------------- */

  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      keyboardHeight.value = withTiming(e.endCoordinates.height, {
        duration: 250,
      });
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      keyboardHeight.value = withTiming(0, { duration: 250 });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    marginBottom: Platform.OS === "android" ? keyboardHeight.value : 0,
  }));

  /* -------------------------
     LOGIC
  -------------------------- */

  const toggleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              liked: !c.liked,
              likeCount: c.liked ? c.likeCount - 1 : c.likeCount + 1,
            }
          : c,
      ),
    );
  };

  const onBottomLayout = (e: LayoutChangeEvent) => {
    setBottomHeight(e.nativeEvent.layout.height);
  };

  const addEmoji = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  /* -------------------------
     RENDER
  -------------------------- */

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      statusBarTranslucent
    >
      <View style={{ flex: 1 }}>
        {/* BACKDROP */}
        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        />

        {/* SHEET CONTAINER */}
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              {
                maxHeight: height * 0.7,
                flex: 1,
                backgroundColor: "white",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                overflow: "hidden",
              },
              sheetAnimatedStyle,
            ]}
          >
            {/* HEADER */}
            <YStack
              padding="$4"
              borderBottomWidth={1}
              borderColor="#eee"
              alignItems="center"
            >
              <Text fontWeight="600" fontSize="$4">
                Comments
              </Text>
            </YStack>

            {/* LIST */}
            <View style={{ flex: 1 }}>
              <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                style={{ flex: 1 }}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  padding: 16,
                  paddingBottom: bottomHeight,
                }}
                renderItem={({ item }) => (
                  <XStack justifyContent="space-between" padding="$4">
                    <XStack gap="$2" flex={1}>
                      <Image
                        source={{ uri: "https://i.pravatar.cc/100" }}
                        width={30}
                        height={30}
                        borderRadius={50}
                      />

                      <YStack flex={1}>
                        <XStack gap="$2" alignItems="center">
                          <Text fontWeight="600" fontSize={16}>
                            {item.name}
                          </Text>
                          <Text color="#999" fontSize={10}>
                            {item.time}
                          </Text>
                        </XStack>

                        <Text fontSize={13}>{item.text}</Text>

                        <XStack marginTop={15} gap={15}>
                          <TouchableOpacity
                            style={{
                              borderWidth: 1,
                              borderColor: "#836F8B",
                              paddingHorizontal: 2,
                              borderRadius: 4,
                              width: 40,
                              justifyContent:"center",
                              height: 15,
                              alignItems:"center"
                            }}
                          >
                            <Text fontSize={10} fontWeight={600}>Reply</Text>
                          </TouchableOpacity>

                          <TouchableOpacity>
                            <Text fontSize={10}>View Replies</Text>
                          </TouchableOpacity>
                        </XStack>
                      </YStack>
                    </XStack>

                    <Pressable onPress={() => toggleLike(item.id)}>
                      {item.liked ? (
                        <Image source={likeIconActive} width={24} height={24} />
                      ) : (
                        <Heart size={24} color={colors.primary} />
                      )}
                      <Text fontSize={10} textAlign="center">
                        {item.likeCount}
                      </Text>
                    </Pressable>
                  </XStack>
                )}
              />
            </View>

            {/* INPUT SECTION */}
            <YStack
              borderTopWidth={1}
              borderColor="#eee"
              onLayout={onBottomLayout}
            >
              <XStack
                padding="$1"
                gap="$2"
                alignItems="center"
                backgroundColor={"#FAF9FA"}
                borderWidth={1}
                borderColor={"#EEEBEF"}
                marginHorizontal={10}
                paddingHorizontal={14}
                borderRadius={8}
                marginTop={10}
                marginBottom={isFocused ? 10 : 20}
                minHeight={43}
                maxHeight={"$10"}
              >
                <TextInput
                  ref={inputRef}
                  multiline
                  placeholder="Join the conversation..."
                  placeholderTextColor={"#836F8B"}
                  value={inputValue}
                  onChangeText={setInputValue}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  style={{ flex: 1 }}
                />
                <Image
                  source={require("@/assets/images/sendIcon.png")}
                  width={30}
                  height={30}
                />
              </XStack>

              {isFocused && (
                <XStack
                  paddingHorizontal="$3"
                  paddingBottom="$3"
                  gap="$3"
                  marginBottom={15}
                >
                  {EMOJIS.map((emoji) => (
                    <Text
                      key={emoji}
                      fontSize={22}
                      onPress={() => addEmoji(emoji)}
                    >
                      {emoji}
                    </Text>
                  ))}
                </XStack>
              )}
            </YStack>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}
