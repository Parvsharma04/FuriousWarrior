"use client";

import { PhoneInputComponent } from "@/components/phone-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader"; // Import custom loader component
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SignUpPage() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 8) {
      setAlert({
        type: "error",
        message: "Password must be at least 8 characters long.",
      });
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/users/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullname,
            phonenumber: phone,
            email: email,
            password,
          }),
        }
      );

      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }

      const data = await response.json();

      if (data.message === "User Already Exists") {
        setAlert({
          type: "error",
          message: "User already exists! Login to access dashboard...",
        });
      } else {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        setAlert({
          type: "success",
          message: "Registration successful! Redirecting to dashboard...",
        });
        setTimeout(() => {
          switch (decoded.role) {
            case "USER":
              router.push("/user/dashboard");
              break;
            case "ADMIN":
              router.push("/admin/dashboard");
              break;
            case "MODERATOR":
              router.push("/moderator/dashboard");
              break;
            default:
              router.push("/user/dashboard");
              break;
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({
        type: "error",
        message: "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Automatically hide the alert after 2 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 2000);

      return () => clearTimeout(timer); // Cleanup the timer on unmount or alert change
    }
  }, [alert]);

  return (
    <div className="container mx-auto px-4 my-20">
      <div>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInputComponent value={phone} onChange={setPhone} />
              </div>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader className="mr-2" /> : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p>
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
        {alert && (
          <Alert
            variant={alert.type === "error" ? "destructive" : "default"}
            className="mt-4 max-w-md mx-auto"
          >
            <AlertTitle>
              {alert.type === "error" ? "Error" : "Success"}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
