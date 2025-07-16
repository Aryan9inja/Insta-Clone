import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../../services/users.services";
import CustomButton from "../ui/button";

const EmailVerification = () => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    const handleVerify = async () => {
      if (!userId || !secret) {
        setStatus("error");
        setErrorMessage("Missing verification details.");
        return;
      }

      try {
        setStatus("loading");
        await verifyEmail(userId, secret);
        setStatus("success");
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(error?.message || "Verification failed.");
      }
    };

    handleVerify();
  }, [userId, secret]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-md text-center">
        {status === "loading" && (
          <p className="text-light-text dark:text-dark-text">
            Verifying your email...
          </p>
        )}

        {status === "success" && (
          <>
            <p className="text-green-600 font-semibold mb-4">
              Email verified successfully!
            </p>
            <CustomButton label="Go to Home" onClick={() => navigate("/")} />
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-red-500 font-semibold mb-4">{errorMessage}</p>
            <CustomButton
              label="Retry"
              onClick={() => window.location.reload()}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
