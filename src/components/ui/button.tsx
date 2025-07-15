interface Props {
  type?: "submit" | "button";
  label: string;
  bgColor?: string;
  textColor?: string;
  darkBgColor?: string;
  darkTextColor?: string;
  loadingLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  classname?: string;
}

const CustomButton = ({
  type = "submit",
  label,
  loadingLabel = "Processing...",
  isLoading = false,
  disabled = false,
  classname = "",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  darkBgColor = "dark:bg-blue-300",
  darkTextColor = "dark:text-gray-800",
}: Props) => {
  return (
    <div className="mb-4">
      <button
        type={type}
        disabled={isLoading || disabled}
        className={`px-4 py-2 rounded-lg transition duration-200 w-full ${bgColor} ${textColor} ${darkBgColor} ${darkTextColor} ${
          disabled || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-80"
        } ${classname}`}
      >
        {isLoading ? loadingLabel : label}
      </button>
    </div>
  );
};

export default CustomButton;
