"use client";

import { useCurrentUser } from "@/hooks/use-current-user";

const OnBoarding = () => {
    const user = useCurrentUser();
  
  return (
    <p>Welcome to the onboarding page! email : {user?.email} name: {user?.name}</p>
  );
};

export default OnBoarding;
