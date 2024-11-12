import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Users } from "lucide-react";

export default function Counseling() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Counseling Services</h1>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Card>
          <CardHeader>
            <Briefcase className="w-10 h-10 mb-2 text-primary" />
            <CardTitle>Career Counseling</CardTitle>
            <CardDescription>
              Guidance for your cyber security career path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Our expert career counselors will help you navigate the complex
              world of cyber security careers. We'll assess your skills,
              interests, and goals to create a personalized career roadmap.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Book a Session</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Users className="w-10 h-10 mb-2 text-primary" />
            <CardTitle>Interview Preparation</CardTitle>
            <CardDescription>
              Ace your cyber security job interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Prepare for your dream job with our specialized interview
              preparation service. We'll cover common questions, technical
              assessments, and help you showcase your skills effectively.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Book a Session</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">
          Why Choose Our Counseling Services?
        </h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>Expert guidance from industry professionals</li>
          <li>Personalized advice tailored to your goals</li>
          <li>Up-to-date insights on the cyber security job market</li>
          <li>Practical tips and strategies for career advancement</li>
          <li>Confidence-building techniques for interviews and networking</li>
        </ul>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request a Consultation</CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you to schedule your
            counseling session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <select
                  id="service"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a service</option>
                  <option value="career">Career Counseling</option>
                  <option value="interview">Interview Preparation</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your goals and any specific areas you'd like to focus on"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Submit Request</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
