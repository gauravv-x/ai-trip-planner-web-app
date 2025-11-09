"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const menuOption = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact Us", path: "/contact-us" },
];

function Header() {
  const { user } = useUser();
  const path = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 lg:px-8 border-b shadow-sm sticky top-0 bg-white z-50">
      {/* ✅ Clickable Logo */}
      <Link href="/" className="flex gap-2 items-center cursor-pointer group">
        <Image
          src={"/logo.svg"}
          alt="Logo"
          width={35}
          height={35}
          className="transition-transform group-hover:scale-110"
        />
        <h2 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-all">
          <span className="hidden sm:inline">AI Trip Planner</span>
          <span className="sm:hidden">AI Trip</span>
        </h2>
      </Link>

      {/* ✅ Desktop Menu Options */}
      <nav className="hidden md:flex gap-4 lg:gap-6 items-center">
        {menuOption.map((menu, index) => {
          const isActive = path === menu.path;
          return (
            <Link href={menu.path} key={index}>
              <h2
                className={`text-base lg:text-lg transition-all cursor-pointer ${
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

      {/* ✅ Desktop Auth / Action Buttons */}
      <div className="hidden md:flex gap-3 lg:gap-4 items-center">
        {!user ? (
          <SignInButton mode="modal">
            <Button className="cursor-pointer hover:scale-105 transition-transform text-sm">
              Get Started
            </Button>
          </SignInButton>
        ) : path === "/create-new-trip" ? (
          <Link href={"/my-trips"}>
            <Button
              className="cursor-pointer hover:bg-primary hover:text-white transition-all hover:scale-105 text-sm"
              variant="outline"
            >
              My Trips
            </Button>
          </Link>
        ) : (
          <Link href={"/create-new-trip"}>
            <Button
              className="cursor-pointer hover:bg-primary hover:text-white transition-all hover:scale-105 text-sm"
            >
              Create New Trip
            </Button>
          </Link>
        )}
        <UserButton />
      </div>

      {/* ✅ Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        {user && <UserButton />}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* ✅ Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg md:hidden z-50">
          <nav className="flex flex-col p-4 space-y-4">
            {menuOption.map((menu, index) => {
              const isActive = path === menu.path;
              return (
                <Link
                  href={menu.path}
                  key={index}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <h2
                    className={`text-lg transition-all cursor-pointer py-2 ${
                      isActive
                        ? "text-primary font-semibold underline underline-offset-4"
                        : "hover:text-primary"
                    }`}
                  >
                    {menu.name}
                  </h2>
                </Link>
              );
            })}
            <div className="pt-2 border-t">
              {!user ? (
                <SignInButton mode="modal">
                  <Button className="w-full cursor-pointer hover:scale-105 transition-transform">
                    Get Started
                  </Button>
                </SignInButton>
              ) : path === "/create-new-trip" ? (
                <Link href={"/my-trips"} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    className="w-full cursor-pointer hover:bg-primary hover:text-white transition-all"
                    variant="outline"
                  >
                    My Trips
                  </Button>
                </Link>
              ) : (
                <Link href={"/create-new-trip"} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full cursor-pointer hover:bg-primary hover:text-white transition-all">
                    Create New Trip
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
