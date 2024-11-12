import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

export default function Products() {
  const products = [
    { name: "Cyber Security Toolkit", price: 199.99, description: "A comprehensive set of tools for cyber security professionals." },
    { name: "Network Analyzer Pro", price: 149.99, description: "Advanced network analysis software for identifying vulnerabilities." },
    { name: "Secure Code Review Guide", price: 79.99, description: "In-depth guide for secure coding practices and code review." },
    { name: "Incident Response Playbook", price: 129.99, description: "Step-by-step guide for handling cyber security incidents." },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>${product.price.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{product.description}</p>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}