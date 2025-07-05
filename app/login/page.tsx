"use client"

import SignInForm from "@/components/sign-in-form"
import SignUpForm from "@/components/sign-up-form"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const { data: session } = authClient.useSession()
  const [showSignIn, setShowSignIn] = useState(false)

  if (session) {
    redirect("/")
  }

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  )
}
