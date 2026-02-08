export const passwordRules = {
  minLength: (v: string) => v.length >= 8 && v.length <= 20,
  hasLetterAndNumber: (v: string) =>
    /[a-zA-Z]/.test(v) && /\d/.test(v),
  hasSpecialChar: (v: string) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(v),
}

export const isPasswordValid = (password: string) =>
  Object.values(passwordRules).every((rule) => rule(password))