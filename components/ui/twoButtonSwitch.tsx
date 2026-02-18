// components/ui/TwoButtonSwitch.tsx
import colorsDefault from "@/constants/colors";
import { Button, XStack } from "tamagui";

type TwoButtonSwitchProps = {
  value: "forYou" | "following";
  onChange: (value: "forYou" | "following") => void;
  width: number | string;
  emptyFollowing?: boolean;
};

export default function TwoButtonSwitch({
  value,
  onChange,
  width,
  emptyFollowing = false,
}: TwoButtonSwitchProps) {
  const isForYou = value === "forYou";

  const activeBg = emptyFollowing ? colorsDefault.primary : colorsDefault.white;
  const activeText = emptyFollowing ? colorsDefault.white : colorsDefault.primary;
  const inactiveText = emptyFollowing ? colorsDefault.primary : colorsDefault.white;

  return (
    <XStack
      borderColor={"#E4C0F1"}
      borderWidth={1}
      height={"$3"}
      gap="$2"
      alignSelf="center"
      justifyContent="center"
      borderRadius={999}
      width={width}
    >
      <Button
        width={"50%"}
        height={"100%"}
        borderRadius={99}
        backgroundColor={isForYou ? activeBg : "transparent"}
        borderColor={isForYou ? "#E4C0F1" : "transparent"}
        color={isForYou ? activeText : inactiveText}
        fontSize={13}
        fontWeight={"500"}
        onPress={() => onChange("forYou")}
      >
        For You
      </Button>

      <Button
        width={"50%"}
        height={"100%"}
        borderRadius={99}
        backgroundColor={!isForYou ? activeBg : "transparent"}
        borderColor={!isForYou ? "#E4C0F1" : "transparent"}
        color={!isForYou ? activeText : inactiveText}
        fontSize={13}
        fontWeight={"500"}
        onPress={() => onChange("following")}
      >
        Following
      </Button>
    </XStack>
  );
}
