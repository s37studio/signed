"use client";

// import { useState } from "react";

import SignInForm from "@/components/sign-in-form";
// import SignUpForm from "@/components/sign-up-form";

export default function LoginPage() {
  // const [showSignIn, setShowSignIn] = useState(false);

  // Affichage uniquement du formulaire de connexion - la création de compte est désactivée
  return <SignInForm />;

  // return showSignIn ? (
  //   <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  // ) : (
  //   <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  // );
}
