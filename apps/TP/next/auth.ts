import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { AxiosService } from "./lib/utils/axiosService";
import { registerIdentityProviderUser } from "./lib/utils/registerIdentityProvider";
import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" , maxAge : 60 * 60 * 1 },
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { client, username, password } = credentials;
        const data = {
          client: client,
          username: username,
          password: password,
          type: "c",
        };
        try {
          const res = await AxiosService.post(`/api/signin`, data);
          if (res.status == 201) {
            cookies().set("tp_cc", client as string);
            cookies().set("tp_lid", username as string);
            cookies().set("tp_tk", res.data.token);
            cookies().set("tp_em", res.data.email, {
            })
            return res.data;
          } 
        } catch (error:any) {
          throw new Error(
            JSON.stringify({
              status: error.response?.status || 500,
              message: error.response?.data?.error && error.response.data.errorDetails || "Unknown error occurred",
            })
          );
        }
       
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.type == "credentials") {
        return true; //false;
      } else {
        await registerIdentityProviderUser(user, account);
        return true;
      }
    },

    async jwt({ token, user }) {
      if (token) {
        // Check if token exists
        if (user) {
          token.user = user;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && token.user) {
        // Check if token and user exist
        session.user = token.user;
        if (token.user.image) {
          session.user.token = token.acc;
        }
      }
      return session;
    },
  },
});
