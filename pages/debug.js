import { useUser } from "@clerk/nextjs";

export default function DebugPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  
  if (!isLoaded) return <p>Загрузка...</p>;
  
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = user?.primaryEmailAddress?.emailAddress === adminEmail;
  
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Отладочная информация</h1>
      
      <h2>Параметры окружения:</h2>
      <ul>
        <li>NEXT_PUBLIC_ADMIN_EMAIL: {adminEmail || "Не установлен"}</li>
        <li>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "Установлен" : "Не установлен"}</li>
      </ul>
      
      <h2>Статус пользователя:</h2>
      <ul>
        <li>Авторизован: {isSignedIn ? "Да" : "Нет"}</li>
        <li>ID: {user?.id || "Нет"}</li>
        <li>Email: {user?.primaryEmailAddress?.emailAddress || "Нет"}</li>
        <li>Имя: {user?.fullName || "Нет"}</li>
        <li>Администратор: {isAdmin ? "Да" : "Нет"}</li>
      </ul>
      
      <h2>Метаданные пользователя:</h2>
      <pre>{JSON.stringify(user?.publicMetadata || {}, null, 2)}</pre>
      
      <h2>Проверка API:</h2>
      <button 
        onClick={async () => {
          try {
            const res = await fetch("/api/check-approval");
            const data = await res.json();
            alert(JSON.stringify(data, null, 2));
          } catch (err) {
            alert(`Ошибка: ${err.message}`);
          }
        }}
        style={{ padding: "0.5rem" }}
      >
        Проверить одобрение
      </button>
    </div>
  );
}