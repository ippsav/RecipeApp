import React from "react";
import Link from "next/link";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <div className=" h-16 w-screen bg-gray-800 text-white flex items-center px-7 justify-between">
      <div>
        <Link href="/">MySafronApp</Link>
      </div>
      <div className="flex space-x-4">
        <div>
          <Link href="/login">Login</Link>
        </div>
        <div>
          <Link href="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};
