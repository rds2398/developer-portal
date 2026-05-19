import { useEffect } from "react";
import type { ReactNode } from "react";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(!!data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuthenticated]);

  return children;
}
