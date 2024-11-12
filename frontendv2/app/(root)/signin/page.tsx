"use client";

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
import { Loader } from "@/components/ui/loader";
import { jwtDecode } from "jwt-decode";
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

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (alert) {
      const timeoutId = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timeoutId); // Clear timeout on component unmount
    }
  }, [alert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/users/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.token) {
        await localStorage.setItem("token", data.token);

        const decoded: Token = jwtDecode(data.token);
        console.log("Decoded user info:", decoded);
        console.log(decoded);
        setAlert({ type: "success", message: "Login successful!" });
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
      } else {
        setAlert({ type: "error", message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlert({ type: "error", message: "Login failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 my-20">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign In to Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? <Loader className="mr-2" /> : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
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
  );
}
