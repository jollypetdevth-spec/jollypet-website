import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const supabase = createServerSupabaseClient();

        // Verify with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user) return null;

        // Fetch user profile
        const { data: profile } = await supabase
          .from("users")
          .select("id, full_name, email, user_type, is_approved")
          .eq("id", data.user.id)
          .single();

        if (!profile) return null;

        return {
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          userType: profile.user_type,
          isApproved: profile.is_approved,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userType = (user as any).userType;
        token.isApproved = (user as any).isApproved;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).userType = token.userType;
        (session.user as any).isApproved = token.isApproved;
      }
      return session;
    },
  },
});
