import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Trophy, Users } from "lucide-react"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-10  ">
      <h1 className="text-4xl font-bold mb-8">About Furious Warrior</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <Card>
          <CardHeader>
            <Shield className="w-10 h-10 mb-2 text-primary" />
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>To provide consistent security with zero tolerance, ensuring that cyber security remains uncompromising at every level.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Users className="w-10 h-10 mb-2 text-primary" />
            <CardTitle>Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p>A group of dedicated professionals with extensive experience in cyber security, committed to protecting your digital assets.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Trophy className="w-10 h-10 mb-2 text-primary" />
            <CardTitle>Our Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Recognized leaders in the cyber security industry, with a track record of successfully securing numerous high-profile organizations.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
        <p className="text-lg mb-4">
          Furious Warrior was founded in 2015 by a group of cyber security experts who saw the need for a more robust and proactive approach to digital security. Since then, we've grown into a leading force in the industry, constantly innovating and adapting to the ever-changing threat landscape.
        </p>
        <p className="text-lg">
          Our commitment to excellence and our zero-tolerance policy towards security breaches have made us the go-to partner for businesses and organizations looking to protect their digital assets and maintain the trust of their customers.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-4">Our Values</h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>Integrity in all our dealings</li>
          <li>Continuous learning and improvement</li>
          <li>Proactive approach to security</li>
          <li>Collaboration with our clients</li>
          <li>Innovation in cyber security solutions</li>
        </ul>
      </div>
    </div>
  )
}