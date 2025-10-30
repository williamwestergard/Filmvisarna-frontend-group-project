export async function RegisterFormApi(data: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}) {
  const response = await fetch("/api/users", {   
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phone, 
      email: data.email,
      password: data.password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Kunde inte skapa användare.");
  }

  return result;
}
