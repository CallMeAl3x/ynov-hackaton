import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register - Pensaga",
  description: "Create your Pensaga account and start creating amazing stories with AI assistance.",
};

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
