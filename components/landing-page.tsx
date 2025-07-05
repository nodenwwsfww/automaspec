"use client"
import { ArrowRight, CheckCircle, Code, Zap, Shield, Users, Github, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">TestAssist</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground">
              Login
            </Link>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            🚀 Now supporting Playwright, Jest & VTest
          </Badge>
          <h1 className="text-5xl font-bold mb-6 leading-tight bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Testing Made Simple
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your test specifications into executable code. Manage, run, and track your tests with a modern
            dashboard built for developers, testers, and managers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Start Testing Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need for testing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From test specification to execution, manage your entire testing workflow in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Code className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Code Generation</CardTitle>
                <CardDescription>
                  Generate Playwright, Jest, and VTest code from your test specifications with one click.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Real-time Execution</CardTitle>
                <CardDescription>
                  Run tests directly from the dashboard and see results in real-time with detailed logs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Role-based Access</CardTitle>
                <CardDescription>
                  Different permissions for developers, testers, and managers. Control who can edit what.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Share test suites, track coverage, and collaborate with your team in real-time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Github className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Git Integration</CardTitle>
                <CardDescription>
                  Sync with your repositories, track changes, and integrate with your CI/CD pipeline.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Chrome className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Cross-browser Testing</CardTitle>
                <CardDescription>
                  Test across different browsers and devices with built-in Playwright integration.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Start free, upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="text-3xl font-bold mt-4">$0</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Up to 50 tests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Basic code generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Community support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">1 project</span>
                  </div>
                </div>
                <Link href="/dashboard" className="block">
                  <Button className="w-full">Get Started Free</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your testing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who trust TestAssist for their testing needs.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Code className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold">TestAssist</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern testing dashboard for developers, testers, and managers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-sm">
                <Link href="#features" className="block text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="/pricing" className="block text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
                <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground">
                  Documentation
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">
                  Help Center
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground">
                  About
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">
                  Blog
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">
                  Careers
                </a>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 TestAssist. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
