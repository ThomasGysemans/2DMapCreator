'use client';

import { AuthProvider } from "../fireconfig/auth";

export default function AuthProviderClientComponent({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}