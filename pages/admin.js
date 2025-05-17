import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function AdminPage() {
  const { user, isSignedIn } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = user?.primaryEmailAddress?.emailAddress === adminEmail;

  useEffect(() => {
    // Только для отладки
    if (user) {
      console.log("Current user email:", user.primaryEmailAddress?.emailAddress);
      console.log("Admin email from env:", adminEmail);
      console.log("Is admin?", isAdmin);
    }

    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    if (!isAdmin) {
      setLoading(false);
      return;
    }

    async function fetchUsers() {
      try {
        console.log("Fetching users...");
        const res = await fetch("/api/approve");
        
        if (!res.ok) {
          console.error(`Error fetching users: ${res.status} ${res.statusText}`);
          const errorData = await res.json().catch(() => ({}));
          setError(`Ошибка загрузки пользователей: ${res.status} ${errorData.error || ''}`);
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        console.log("Fetched users:", data);
        setUsers(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(`Ошибка: ${err.message}`);
        setLoading(false);
      }
    }

    fetchUsers();
  }, [isSignedIn, isAdmin, user, adminEmail]);

  const handleApprove = async (userId) => {
    try {
      const res = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(`Ошибка одобрения: ${errorData.error || res.statusText}`);
        return;
      }
      
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert("Пользователь успешно одобрен");
    } catch (err) {
      console.error("Failed to approve user:", err);
      alert(`Ошибка: ${err.message}`);
    }
  };

  if (!isSignedIn) return <p>Загрузка... Пожалуйста, авторизуйтесь.</p>;
  if (!isAdmin) return <div style={{ padding: "2rem", fontFamily: "Arial" }}>
    <h1>Нет доступа</h1>
    <p>У вас нет прав администратора.</p>
    <p>Ваш email: {user?.primaryEmailAddress?.emailAddress}</p>
    <p>Требуемый email админа: {adminEmail || "Не указан в переменных окружения"}</p>
  </div>;
  
  if (error) return <div style={{ padding: "2rem", fontFamily: "Arial" }}>
    <h1>Ошибка</h1>
    <p>{error}</p>
    <button onClick={() => window.location.reload()}>Попробовать снова</button>
  </div>;
  
  if (loading) return <p>Загрузка списка пользователей...</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Панель администратора</h1>
      <h2>Новые пользователи (ожидают одобрения):</h2>
      {users.length === 0 ? (
        <p>Нет пользователей для одобрения.</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id} style={{ marginBottom: "1rem" }}>
              {u.emailAddresses?.[0]?.emailAddress || u.username || "Неизвестный пользователь"}
              <button
                onClick={() => handleApprove(u.id)}
                style={{ marginLeft: "1rem", padding: "0.5rem" }}
              >
                Одобрить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}