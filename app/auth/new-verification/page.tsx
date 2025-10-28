import { Metadata } from "next";
import { NewVerificationForm } from "@/components/auth/new-verification-form";

export const metadata: Metadata = {
  title: "Verify Email - Pensaga",
  description: "Verify your email address to complete your Pensaga account setup.",
};

const newVerificationPage = () => {
  return <NewVerificationForm />;
};

export default newVerificationPage;
