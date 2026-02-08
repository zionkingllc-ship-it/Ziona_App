import { themes, tokens } from "@tamagui/themes";
import { createTamagui } from "tamagui";
import colors from "./constants/colors";
import { createFont } from "tamagui";
import spacing from "@/constants/spacing"

const appTokens = {
  color: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  },
  spacing:{
    borderRadius:spacing.borderRadius
  }

};

const appThemes = {
  light: {
    background: colors.background,
    color: colors.text,
    primary: colors.primary,
    secondary: colors.secondary,
  },
  dark: {
    background: colors.primary,
    color: colors.white,
    primary: colors.secondary,
    secondary: "#B3B3FF",
  },
};

const monaSansFont = createFont({
  family: 'MonaSans',

  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 30,
    8: 36,
  },

  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 26,
    5: 28,
    6: 32,
    7: 38,
    8: 44,
  },

  weight: {
    4: '400',
    6: '600',
  },

  face: {
    400: {
      normal: 'MonaSans',
    },
    600: {
      normal: 'MonaSans_SemiBold',
      italic: 'MonaSans_SemiBoldItalic',
    },
  },
})

const config = createTamagui({
  tokens: {
    ...tokens,
    ...appTokens,
  },
  themes: {
    ...themes,
    ...appThemes,
  },
  fonts: {
    body: monaSansFont,
    heading: monaSansFont,
  },
});



export type AppConfig = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
