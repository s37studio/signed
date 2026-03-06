"use client";

import { useState } from "react";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return mode === "signin"
    ? <SignInForm onSwitchToSignUp={() => setMode("signup")} />
    : <SignUpForm onSwitchToSignIn={() => setMode("signin")} />;
}
