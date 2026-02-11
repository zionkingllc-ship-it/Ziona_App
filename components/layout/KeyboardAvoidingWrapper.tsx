import { KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ReactNode } from 'react'

type KeyboardAvoidingWrapperProps = {
  children: ReactNode
  offset?: number
  backgroundColor?: string
}

export function KeyboardAvoidingWrapper({
  children,
  offset = 80,
  backgroundColor = 'transparent',
}: KeyboardAvoidingWrapperProps) {
  return ( 
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={offset}
      >
        {children}
      </KeyboardAvoidingView> 
  )
}