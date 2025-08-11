//src/app/cardapio/_components/Sidebar.tsx
import React from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "light" | "dark" | "transparent";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({
  variant = "light",
  size = "md",
  className = "",
  style,
  children,
  ...props
}) => {
  const base =
    "h-screen flex-shrink-0 shadow-md overflow-y-auto flex flex-col";

  const variants: Record<NonNullable<SidebarProps["variant"]>, string> = {
    light: "bg-white text-gray-800",
    dark: "bg-[#001332] text-white",
    transparent: "bg-transparent text-gray-900",
  };

  const sizes: Record<NonNullable<SidebarProps["size"]>, string> = {
    sm: "w-48",
    md: "w-64",
    lg: "w-80",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <aside className={classes} style={style} {...props}>
      <div className="p-5 flex-1">{children}</div>
    </aside>
  );
};

export default Sidebar;
