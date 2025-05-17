import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function AdminPage() {
  const { user, isSignedIn } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin =
    user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;

    fetch("/api/approve")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, [isAdmin]);

  const handleApprove = async (userId) => {
    await fetch("/api/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  if (!isSignedIn) return <p>Загрузка...</p>;
  if (!isAdmin) return <p>У вас нет доступа к этой странице.</p>;
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
              {u.emailAddresses[0]?.emailAddress || u.username}
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