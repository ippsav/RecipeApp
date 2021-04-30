import React from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-300">
      <Navbar />
      {children}
    </div>
  );
};
