import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FuriousWarrior</h3>
            <p className="text-sm text-gray-600">Professional services and products for your career growth.</p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-primary">About Us</Link></li>
              <li><Link href="/products" className="text-sm text-gray-600 hover:text-primary">Products</Link></li>
              <li><Link href="/counseling" className="text-sm text-gray-600 hover:text-primary">Counseling</Link></li>
              <li><Link href="/speaking" className="text-sm text-gray-600 hover:text-primary">Speaking</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/refund" className="text-sm text-gray-600 hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary"><Facebook size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-primary"><Instagram size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-primary"><Twitter size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-primary"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} FuriousWarrior. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}