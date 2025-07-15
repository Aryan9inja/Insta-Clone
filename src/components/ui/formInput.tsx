import type { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  label: string;
  classname?: string;
  type?: string;
  id: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: string;
}

const FormInputBox = ({
  label,
  classname,
  type = "text",
  id,
  placeholder,
  error,
  register,
}: Props) => {
  return (
    <div className={`mb-4 ${classname}`}>
      <label
        htmlFor={id}
        className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        {...register}
        className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
        } `}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormInputBox;
