import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login - Pensaga",
  description: "Sign in to your Pensaga account and continue creating amazing stories.",
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
