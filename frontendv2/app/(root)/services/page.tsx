import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, Newspaper, PhoneCall, Users } from "lucide-react"

export default function Services() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Services</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PhoneCall className="mr-2 h-6 w-6" /> Career Guidance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Consulting Calls for Career Guidance</li>
              <li>Interview Preparation Assistance</li>
              <li>Paid Internships</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Megaphone className="mr-2 h-6 w-6" /> Advertise Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Online advertising services</li>
              <li>Market research for cyber security and AI solutions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Newspaper className="mr-2 h-6 w-6" /> Newsletter Writing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ghost writing</li>
              <li>Collaboration</li>
              <li>Cybersecurity Webinars</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-6 w-6" /> Special Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Expert-led program designed to equip you with the skills needed to transition into a successful cyber security career.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}