import FormInputBox from "../ui/formInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "../../schemas/signUp.schema";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { signUpThunk } from "../../store/users.thunks";
import CustomButton from "../ui/button";

const SignUpForm = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.users);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    await dispatch(signUpThunk(data));
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 bg-light-background dark:bg-gray-900 transition-colors duration-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <FormInputBox
          label="Name"
          id="name"
          placeholder="Enter your name"
          register={register("name")}
          error={errors.name?.message}
          classname="mb-4"
        />

        <FormInputBox
          label="Username"
          id="username"
          placeholder="Enter preffered username"
          register={register("username")}
          error={errors.username?.message}
          classname="mb-4"
        />

        <FormInputBox
          label="Email"
          id="email"
          placeholder="Enter your email"
          register={register("email")}
          error={errors.email?.message}
          classname="mb-4"
        />

        <FormInputBox
          label="Password"
          id="password"
          type="password"
          placeholder="Enter your password"
          register={register("password")}
          error={errors.password?.message}
          classname="mb-6"
        />

        <CustomButton
          label="CreateAccount"
          loadingLabel="Creating Account..."
          isLoading={isLoading}
        />

        <div className="text-sm flex justify-center gap-1 dark:text-gray-300 text-gray-700 mt-2">
          <span>Already a user?</span>
          <button
            type="button"
            className="cursor-pointer font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
