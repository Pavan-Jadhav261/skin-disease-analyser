'use client'

import React from "react"

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true)
      setIsSubmitting(false)
      setFormData({ name: '', email: '', message: '' })
    }, 1500)
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header Section */}
      <section className="border-b border-border bg-gradient-to-b from-green-50 to-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground">Get in Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Contact Information Cards */}
            <Card className="border-border p-6 md:col-span-1">
              <Mail className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold text-foreground">Email</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                support@skincheckAI.com
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                We'll respond within 24 hours
              </p>
            </Card>

            <Card className="border-border p-6 md:col-span-1">
              <Phone className="h-8 w-8 text-accent" />
              <h3 className="mt-4 font-semibold text-foreground">Phone</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                +1 (555) 123-4567
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Mon-Fri, 9 AM - 6 PM EST
              </p>
            </Card>

            <Card className="border-border p-6 md:col-span-1">
              <MapPin className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold text-foreground">Office</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                123 Health Street<br/>
                Medical City, MC 12345
              </p>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="mt-12">
            <Card className="border-border p-8">
              {!isSubmitted ? (
                <>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Send us a Message</h2>
                  <p className="text-muted-foreground mb-8">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="border-border"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="border-border"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us what's on your mind..."
                        className="min-h-32 border-border"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-accent mx-auto" />
                  <h3 className="mt-6 text-2xl font-bold text-foreground">Thank You!</h3>
                  <p className="mt-2 text-muted-foreground">
                    Your message has been sent successfully. We'll get back to you soon.
                  </p>
                  <Button
                    onClick={resetForm}
                    className="mt-8 bg-primary text-white hover:bg-primary/90"
                  >
                    Send Another Message
                  </Button>
                  <a href="/" className="block mt-4">
                    <Button variant="outline" className="w-full border-border bg-transparent">
                      Back to Home
                    </Button>
                  </a>
                </div>
              )}
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <Card className="border-border p-6">
                <h3 className="font-semibold text-foreground">Is my data secure?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, we take data privacy and security seriously. All uploaded images and personal information are encrypted and handled according to healthcare privacy standards.
                </p>
              </Card>

              <Card className="border-border p-6">
                <h3 className="font-semibold text-foreground">Can I use this for diagnosis?</h3>
                <p className="mt-2 text-muted-foreground">
                  No. This tool is for awareness only. Always consult a dermatologist for professional diagnosis and treatment recommendations.
                </p>
              </Card>

              <Card className="border-border p-6">
                <h3 className="font-semibold text-foreground">How accurate is the AI?</h3>
                <p className="mt-2 text-muted-foreground">
                  Our AI model has been trained on thousands of images and achieves high accuracy. However, no system is 100% accurate, which is why professional consultation is essential.
                </p>
              </Card>

              <Card className="border-border p-6">
                <h3 className="font-semibold text-foreground">What image formats are supported?</h3>
                <p className="mt-2 text-muted-foreground">
                  We accept JPG, JPEG, and PNG files up to 5MB. Ensure the image is clear and well-lit for best results.
                </p>
              </Card>

              <Card className="border-border p-6">
                <h3 className="font-semibold text-foreground">Do you store my images?</h3>
                <p className="mt-2 text-muted-foreground">
                  Images are processed and analyzed but not stored permanently unless you opt-in for research purposes, which you can control in your settings.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SkinCheck AI. All rights reserved.</p>
            <p className="mt-2">
              This is an educational platform. Always consult healthcare professionals for medical concerns.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
