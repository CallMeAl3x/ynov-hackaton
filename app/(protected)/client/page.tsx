import { Metadata } from "next";
"use client";
import { UserInfo } from "@/components/auth/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

export const metadata: Metadata = {
  title: "Client - Pensaga",
  description: "Pensaga client page.",
};

const ClientPage = () => {
  const user = useCurrentUser();

  return <UserInfo user={user} label="Client Page" />;
};

export default ClientPage;
