import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function Training() {
  const courses = [
    "OT Cyber Security Foundation Training",
    "OT Cyber Security Advance Training",
    "Maritime Cyber Security",
    "Industrial IoT Training",
    "OT Security Pre Sales Training",
    "Smart Meter & Smart City",
    "Automotive Cyber Security Training",
    "Instrumentation to OT Cyber Security Professionals",
    "Cyber security Awareness and Attack scenario training",
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Special Training Programs</h1>

      <p className="text-lg mb-6">
        Our expert-led programs are designed to equip you with the skills needed to transition into a successful cyber security career.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-6 w-6" /> {course}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Enroll Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Quizzes and Certifications</h2>
        <p className="mb-4">
          Participate in our quizzes and earn a certificate to recognize your involvement and achievement in cyber security.
        </p>
        <Button>Take a Quiz</Button>
      </div>
    </div>
  )
}