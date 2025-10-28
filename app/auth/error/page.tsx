import { Metadata } from "next";
import ErrorCard from "@/components/auth/error-card";

export const metadata: Metadata = {
  title: "Auth Error - Pensaga",
  description: "An error occurred during authentication.",
};

const AuthErrorPage = () => {
  return <ErrorCard />;
};

export default AuthErrorPage;
