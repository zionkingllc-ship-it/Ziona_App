import colors from "@/constants/colors";
import { Button, XStack } from "tamagui";

type Propts = {
  value: "forYou" | "following";
  onChange: (value: "forYou" | "following") => void;
  width: any;
};

export default function TwoButtonSwitch({ value, onChange, width }: Propts) {
  const isForYou = value === "forYou";

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
        backgroundColor={isForYou ? colors.white : "transparent"}
        borderColor={isForYou ? "#E4C0F1" : "transparent"}
        color={isForYou ? colors.primary : colors.white}
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
        backgroundColor={!isForYou ? colors.white : "transparent"}
        borderColor={!isForYou ? "#E4C0F1" : "transparent"}
        color={!isForYou ? colors.primary : colors.white}
        fontSize={13}
        fontWeight={"500"}
        onPress={() => onChange("following")}
      >
        Following
      </Button>
    </XStack>
  );
}
