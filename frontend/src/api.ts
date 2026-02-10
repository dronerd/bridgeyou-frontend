const API_URL = import.meta.env.VITE_API_URL;

export async function rewriteMessage(
  message: string,
  sender: string,
  receiver: string
) {
  const res = await fetch(`${API_URL}/rewrite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sender, receiver }),
  });

  return res.json();
}
