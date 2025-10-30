export async function LoginFormApi(data: {
  email: string;
  password: string;
}) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Kunde inte logga in.");
  }

  return result;
}
