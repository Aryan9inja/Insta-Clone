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
  classname = "",
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
        className="block text-light-text dark:text-dark-text font-semibold mb-2"
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        placeholder={placeholder}
        {...register}
        className={`w-full px-4 py-2 rounded-md
    bg-light-card text-light-text placeholder:text-light-text/60
    dark:bg-dark-card dark:text-dark-text dark:placeholder:text-dark-text/60
    border focus:outline-none focus:ring-2 transition duration-200
    ${
      error
        ? "border-error focus:ring-error"
        : "border-light-border dark:border-dark-border focus:ring-light-primary dark:focus:ring-dark-primary"
    }`}
      />

      {error && <p className="text-sm text-[--color-error] mt-1">{error}</p>}
    </div>
  );
};

export default FormInputBox;
