import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Briefcase, ChevronRight, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Furious Warrior</h1>
        <p className="text-xl text-muted-foreground">
          Consistent Security with Zero Tolerance
        </p>
      </header>

      <section className="mb-12 ">
        <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
        <p className="text-lg mb-4">
          At Furious Warrior, we uphold a commitment to Consistent Security with
          Zero Tolerance, ensuring that cyber security remains uncompromising at
          every level. Join us to build a thriving career in cyber security,
          where you&apos;ll gain hands-on experience and expertise, shaping the
          future of digital protection.
        </p>
        <Button asChild>
          <Link href="/services">
            Explore Our Services <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 mb-2" />
            <CardTitle>Career Guidance</CardTitle>
          </CardHeader>
          <CardContent>
            Expert advice and interview preparation for cyber security careers.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Briefcase className="h-8 w-8 mb-2" />
            <CardTitle>Advertise Services</CardTitle>
          </CardHeader>
          <CardContent>
            Online advertising and market research for cyber security solutions.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 mb-2" />
            <CardTitle>Newsletter Writing</CardTitle>
          </CardHeader>
          <CardContent>
            Ghostwriting, collaboration, and cybersecurity webinars.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 mb-2" />
            <CardTitle>Special Training</CardTitle>
          </CardHeader>
          <CardContent>
            Expert-led programs for various cyber security domains.
          </CardContent>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-6">
          Ready to Start Your Cyber Security Journey?
        </h2>
        <Button asChild size="lg">
          <Link href="/contact">
            Contact Us Today <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
