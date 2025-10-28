import { Metadata } from "next";
import { UserInfo } from "@/components/auth/user-info";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Server - Pensaga",
  description: "Pensaga server page.",
};

const ServerPage = async () => {
  const user = await currentUser();

  return <UserInfo user={user} label="Server Page" />;
};

export default ServerPage;
