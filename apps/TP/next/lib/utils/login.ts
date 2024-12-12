"use server";
import { signIn } from "../../auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "./routes";
import { isRedirectError } from "next/dist/client/components/redirect";

export const login = async (values: any) => {
  try {
    const { client, username, password } = values;
    await signIn("credentials", {
      client,
      username,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "invalid credentials" };
        case "CallbackRouteError":
          return { error: err.cause?.err?.message.toString() };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw err;
  }
};

export const socialLogin = async (socialProvider: "google" | "github") => {
  try {
    const res = await signIn(socialProvider, {
      redirectTo: DEFAULT_LOGIN_REDIRECT,
      redirect: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      const { type, cause } = error as AuthError;

      if (isRedirectError(error)) {
        throw error;
      }

      switch (type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        case "CallbackRouteError":
          return cause?.err?.toString();
        default:
          return "Something went wrong.";
      }
    }

    throw error;
  }
};
