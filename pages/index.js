import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return (
      <div style={{ padding: "2rem", fontFamily: "Arial" }}>
        <h1>Пожалуйста, войдите:</h1>
        <SignInButton />
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Добро пожаловать!</h1>
      <p>
        Вы вошли как: {user.fullName || user.username || user.emailAddresses[0]?.emailAddress}
      </p>
      <SignOutButton />
    </div>
  );
}