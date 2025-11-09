"use client";
import { Github, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-semibold mb-3">AI Trip Planner</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Smart travel assistant powered by AI — plan your dream trips, explore destinations, and simplify travel planning effortlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/create-new-trip" className="hover:text-primary transition-colors">Create Trip</Link>
            </li>
            <li>
              <Link href="/my-trips" className="hover:text-primary transition-colors">My Trips</Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Connect</h3>
          <div className="flex justify-center sm:justify-start gap-4 text-gray-600 dark:text-gray-400">
            <Link href="https://github.com/gauravv-x" target="_blank" className="hover:text-primary transition-transform hover:scale-110">
              <Github/>
            </Link>
            <Link href="https://www.linkedin.com/in/gauravakabari" target="_blank" className="hover:text-primary transition-transform hover:scale-110">
              <Linkedin />
            </Link>
            <Link href="https://www.instagram.com/gauravv.x__" target="_blank" className="hover:text-primary transition-transform hover:scale-110">
              <Instagram />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} <span className="font-semibold text-primary">Gaurav Akbari</span>. All rights reserved.
      </div>
    </footer>
  );
}
