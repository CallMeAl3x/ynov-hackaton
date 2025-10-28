import { Metadata } from "next";
import { ResetForm } from "@/components/auth/reset-form";

export const metadata: Metadata = {
  title: "Reset Password - Pensaga",
  description: "Reset your Pensaga account password to regain access to your stories.",
};

const ResetPage = () => {
  return (
    <div>
      <ResetForm />
    </div>
  );
};

export default ResetPage;
