import FormInputBox from "../ui/formInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormData,
} from "../../schemas/login.schema";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { loginThunk } from "../../store/users.thunks";
import CustomButton from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.users);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginThunk(data));

    if (loginThunk.fulfilled.match(result)) {
      toast.success("Login successful");
      navigate("/"); 
    } else {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 bg-light-bg dark:bg-dark-bg transition-colors duration-300">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-light-card dark:bg-dark-card shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center text-light-text dark:text-dark-text mb-6">
            Login to Your Account
          </h2>

          {error && (
            <p className="text-error text-sm mb-4 text-center font-medium">
              {error}
            </p>
          )}

          <FormInputBox
            label="Email"
            id="email"
            placeholder="Enter your email"
            register={register("email")}
            error={errors.email?.message}
          />

          <FormInputBox
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            register={register("password")}
            error={errors.password?.message}
          />

          <CustomButton
            label="Login"
            loadingLabel="Logging in..."
            isLoading={isLoading}
          />

          <div className="text-sm flex justify-center gap-1 text-light-text dark:text-dark-text mt-2">
            <span>New here?</span>
            <button
              type="button"
              className="cursor-pointer font-semibold text-light-primary hover:underline dark:text-dark-primary"
              onClick={() => navigate("/signup")}
            >
              Create an account
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
