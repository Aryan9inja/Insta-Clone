interface Props {
  type?: "submit" | "button";
  label: string;
  loadingLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  classname?: string;
  onClick?: () => void;
}

const CustomButton = ({
  type = "submit",
  label,
  loadingLabel = "Processing...",
  isLoading = false,
  disabled = false,
  classname = "",
  onClick,
}: Props) => {
  return (
    <div className="mb-4">
      <button
        type={type}
        disabled={isLoading || disabled}
        onClick={onClick}
        className={`
          px-4 py-2 rounded-lg transition duration-200 w-full
          bg-light-primary text-light-text
          dark:bg-dark-primary dark:text-dark-text
          ${disabled || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover"
          }
          ${classname}
        `}
      >
        {isLoading ? loadingLabel : label}
      </button>
    </div>
  );
};

export default CustomButton;
