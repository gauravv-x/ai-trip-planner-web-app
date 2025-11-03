"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const menuOption = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact Us", path: "/contact-us" },
];

function Header() {
  const { user } = useUser();
  const path = usePathname();

  return (
    <header className="flex justify-between items-center p-4 border-b shadow-sm sticky top-0 bg-white z-50">
      {/* ✅ Clickable Logo */}
      <Link href="/" className="flex gap-2 items-center cursor-pointer group">
        <Image
          src={"/logo.svg"}
          alt="Logo"
          width={35}
          height={35}
          className="transition-transform group-hover:scale-110"
        />
        <h2 className="text-2xl font-bold group-hover:text-primary transition-all">
          AI Trip Planner
        </h2>
      </Link>

      {/* ✅ Menu Options */}
      <nav className="flex gap-8 items-center">
        {menuOption.map((menu, index) => {
          const isActive = path === menu.path;
          return (
            <Link href={menu.path} key={index}>
              <h2
                className={`text-lg transition-all cursor-pointer ${
                  isActive
                    ? "text-primary font-semibold underline underline-offset-4"
                    : "hover:text-primary hover:scale-105"
                }`}
              >
                {menu.name}
              </h2>
            </Link>
          );
        })}
      </nav>

      {/* ✅ Auth / Action Buttons */}
      <div className="flex gap-5 items-center">
        {!user ? (
          <SignInButton mode="modal">
            <Button className="cursor-pointer hover:scale-105 transition-transform">
              Get Started
            </Button>
          </SignInButton>
        ) : path === "/create-new-trip" ? (
          <Link href={"/my-trips"}>
            <Button
              className="cursor-pointer hover:bg-primary hover:text-white transition-all hover:scale-105"
              variant="outline"
            >
              My Trips
            </Button>
          </Link>
        ) : (
          <Link href={"/create-new-trip"}>
            <Button
              className="cursor-pointer hover:bg-primary hover:text-white transition-all hover:scale-105"
            >
              Create New Trip
            </Button>
          </Link>
        )}
        <UserButton />
      </div>
    </header>
  );
}

export default Header;
