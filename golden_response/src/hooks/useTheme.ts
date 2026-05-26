import { useTheme as useNextTheme } from "next-themes";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSession } from "next-auth/react";

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const { data: session } = useSession();
  
  let updateThemePreference: any = null;
  try {
    updateThemePreference = useMutation(api.users.updateThemePreference);
  } catch (error) {
    // Graceful fallback for offline compilations where Convex is mock
  }

  const changeTheme = async (newTheme: string) => {
    setTheme(newTheme);
    if (session?.user?.id && updateThemePreference) {
      try {
        await updateThemePreference({ userId: session.user.id, theme: newTheme });
      } catch (err) {
        console.warn("Failed to persist theme in database:", err);
      }
    }
  };

  return {
    theme,
    setTheme: changeTheme,
    resolvedTheme,
  };
}
