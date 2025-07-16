const VerifyEmailNotice = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-md text-center">
        <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          We've sent a verification link to your email address. Please check
          your inbox and click the link to verify your account.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;
