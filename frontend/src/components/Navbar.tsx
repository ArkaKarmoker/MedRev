'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Pill, Search, List, LogOut, LogIn, UserPlus, User } from "lucide-react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, [pathname]);

  useEffect(() => {
    const handleOpenLogin = () => setIsLoginOpen(true);
    window.addEventListener("openLogin", handleOpenLogin);
    return () => window.removeEventListener("openLogin", handleOpenLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-900 sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto w-full px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors">
          <Pill className="w-8 h-8" />
          MedRev
        </Link>
        <div className="flex items-center gap-1 sm:gap-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2 px-2 sm:px-4"><Search className="w-4 h-4" /><span className="hidden md:inline">Search</span></Button>
          </Link>
          <Link href="/medicines">
            <Button variant="ghost" className="gap-2 px-2 sm:px-4"><List className="w-4 h-4" /><span className="hidden md:inline">Medicines</span></Button>
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" className="gap-2 px-2 sm:px-4 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                  <User className="w-4 h-4" /><span className="hidden sm:inline">Profile</span>
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="gap-2 px-2 sm:px-4">
                <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="gap-2 px-2 sm:px-4" onClick={() => setIsLoginOpen(true)}>
                <LogIn className="w-4 h-4" /><span className="hidden sm:inline">Login</span>
              </Button>
              <Button className="gap-2 px-2 sm:px-4" onClick={() => setIsRegisterOpen(true)}>
                <UserPlus className="w-4 h-4" /><span className="hidden sm:inline">Sign Up</span>
              </Button>
            </>
          )}
        </div>
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={setIsLoginOpen} />
      <RegisterModal isOpen={isRegisterOpen} onClose={setIsRegisterOpen} />
    </nav>
  );
}
