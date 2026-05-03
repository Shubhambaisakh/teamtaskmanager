import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - Team Task Manager',
  description: 'Sign in or create an account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
