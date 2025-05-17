import { ClerkProvider } from "@clerk/nextjs";
import { useRouter } from "next/router";
import "../styles/globals.css"; // If you have global styles

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <Component {...pageProps} />
    </ClerkProvider>
  );
}