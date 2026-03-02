// components/ui/InlineUnderlineText.tsx

import { Text, YStack } from "tamagui"
import { ReactNode } from "react"
import { useResponsive } from "@/hooks/useResponsive"

type Props = {
  children: ReactNode
  color: string
  thickness?: number
  offset?: number
  weight?: any
  fontFamily?: any
  fontSize?: number
}

export function InlineUnderlineText({
  children,
  color,
  thickness = 2,
  offset = 2,
  weight = "500",
  fontFamily = "$body",
  fontSize,
}: Props) {
  const { fs, hp } = useResponsive()

  const scaledThickness = hp(0.25) * (thickness / 2)
  const scaledOffset = hp(0.4) * (offset / 2)

  return (
    <Text
      color={color}
      fontWeight={weight}
      fontFamily={fontFamily}
      fontSize={fontSize ? fs(fontSize) : undefined}
      textDecorationLine="underline"
      textDecorationColor={color}
    >
      {children}
    </Text>
  )
}