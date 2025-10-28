"use client";

import { newVerification } from "@/actions/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const callbackUrl = searchParams.get("callbackUrl");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("No token provided");
      return;
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
        // Redirect to callback URL after successful verification
        if (data.success && callbackUrl) {
          setTimeout(() => {
            router.push(decodeURIComponent(callbackUrl));
          }, 1500);
        }
      })
      .catch(() => {
        setError("Something went wrong");
      });
  }, [token, callbackUrl, router]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Comfirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader></BeatLoader>}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};
