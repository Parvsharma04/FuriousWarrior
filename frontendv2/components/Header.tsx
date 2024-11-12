"use client";

import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Token {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phonenumber: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const decodedToken: Token = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null);
    router.push("/");
  };

  const getDashboardPath = () => {
    switch (userRole) {
      case "USER":
        return "/user/dashboard";
      case "ADMIN":
        return "/admin/dashboard";
      case "MODERATOR":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            FuriousWarrior
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/about" className="text-gray-600 hover:text-primary">
              About Us
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-primary">
              Products
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-primary">
              Services
            </Link>
            <Link
              href="/counseling"
              className="text-gray-600 hover:text-primary"
            >
              Counseling
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-primary">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary">
              Contact Us
            </Link>
            {isAuthenticated && (
              <Link
                href={getDashboardPath()}
                className="text-gray-600 hover:text-primary"
              >
                Dashboard
              </Link>
            )}
          </div>
          <div className="hidden md:flex space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full ml-4 text-white bg-red-500 hover:bg-red-600"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          <button
            className="md:hidden text-gray-600 hover:text-primary"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col space-y-4">
              <Link href="/about" className="text-gray-600 hover:text-primary">
                About Us
              </Link>
              <Link
                href="/products"
                className="text-gray-600 hover:text-primary"
              >
                Products
              </Link>
              <Link
                href="/services"
                className="text-gray-600 hover:text-primary"
              >
                Services
              </Link>
              <Link
                href="/counseling"
                className="text-gray-600 hover:text-primary"
              >
                Counseling
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-primary">
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-primary"
              >
                Contact Us
              </Link>
              {isAuthenticated && (
                <Link
                  href={getDashboardPath()}
                  className="text-gray-600 hover:text-primary"
                >
                  Dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  className="w-full md:ml-4 mx-auto text-white bg-red-500 hover:bg-red-600"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
