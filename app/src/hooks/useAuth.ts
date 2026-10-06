"use client";

import { useCallback, useEffect, useState } from "react";
import { User } from "@/types/user";
import { authSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect --
       localStorage cannot be read during the first client render, so the
       session has to be loaded from the effect instead. */
    setUser(authSession.get());
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    authSession.clear();
    setUser(null);
    redirect('/login')
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    logout,
  };
};