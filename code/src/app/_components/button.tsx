import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "restaurant" | "settings"
  size?: "sm" | "md" | "lg"
}

const Button: React.FC<ButtonProps> = ({
  variant = "restaurant",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const base = "cursor-pointer inline-flex items-center justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none"

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    outline:
      "border border-gray-400 bg-white text-gray-800 hover:bg-gray-100",
    restaurant:
      "bg-[#FAA405] text-[#001332] hover:shadow-md",
    settings:
      "w-12 h-12 rounded-full text-gray-700 hover:bg-[#001332] hover:text-white",
  }


  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "text-sm px-3 py-1.5 h-9 rounded-md",
    md: "text-base px-4 py-2 h-10 rounded-md",
    lg: "text-lg px-5 py-2.5 h-12 rounded-md",
  }

  const classes = `${base} ${variants[variant]} ${variant !== "settings" ? sizes[size] : ""} ${className}`

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
