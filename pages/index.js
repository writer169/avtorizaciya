// pages/index.js
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, user } = useUser();

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Добро пожаловать!</h1>

      {isSignedIn ? (
        <div>
          <p>Вы вошли как: {user.fullName || user.username || user.emailAddresses[0]?.emailAddress}</p>
          <SignOutButton />
        </div>
      ) : (
        <div>
          <p>Пожалуйста, войдите:</p>
          <SignInButton />
        </div>
      )}
    </div>
  );
}