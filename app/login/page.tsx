'use client';

import { authClient } from "@/lib/shared/better-auth"
import { Code } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Loader from "@/components/loader"
import SignInForm from './sign-in-form';
import SignUpForm from './sign-up-form';

export default function LoginPage() {
  const { data: session, isPending } = authClient.useSession()
  const [isSignUp, setIsSignUp] = useState(false);

  if (isPending) {
    return <Loader />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Form Section */}
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link className="mb-4 inline-flex items-center gap-2" href="/">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Code className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">TestAssist</span>
            </Link>
            <h1 className="font-bold text-2xl">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp 
                ? 'Sign up to get started with TestAssist' 
                : 'Sign in to your account to continue'
              }
            </p>
          </div>

          {/* Form Component */}
          {isSignUp ? (
            <SignUpForm onToggle={() => setIsSignUp(false)} />
          ) : (
            <SignInForm onToggle={() => setIsSignUp(true)} />
          )}
        </div>

        {/* Right Column: Already logged in notice + Demo Credentials */}
        <div className="w-full max-w-xs flex-shrink-0 flex flex-col gap-4">
          {session && (
            <Alert className="mb-0">
              <AlertDescription>
                You are already signed in as <strong>{session.user.email}</strong>
                <div className="flex items-center gap-2 mt-2">
                  <Link href="/dashboard" className="text-primary hover:underline">
                    Go to dashboard
                  </Link>
                  <span className="text-muted-foreground">or</span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary hover:underline"
                    onClick={() => authClient.signOut()}
                  >
                    sign out
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <p className="mb-2 text-center text-muted-foreground text-sm">
                Demo credentials:
              </p>
              <div className="space-y-1 text-center text-xs">
                <p>Email: demo@testassist.com</p>
                <p>Password: demo123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
