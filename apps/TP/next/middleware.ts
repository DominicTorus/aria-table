import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./lib/utils/routes";
import { auth } from "./auth";

export default auth((req): any => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // if (isPublicRoute) {
  //   return Response.redirect(new URL("/login", nextUrl));
  // }

  if (isApiAuthRoute) {
    return null;
  }

  // if (isAuthRoute) {
  //   if (isLoggedIn) {
  //     // it will call if login found
  //     return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  //   }
  //   return null;
  // }

  // if (!isLoggedIn && !isPublicRoute) {
  //   //  // it will call if the url 3000/{something}
  //   return Response.redirect(new URL("/login", nextUrl));
  // }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
