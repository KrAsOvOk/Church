"use client";
import { useState } from "react";

export default function CalendarPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    const res = await fetch("/api/kalendar/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date, description }),
    });

    const data = await res.json();
    if (data.url) {
      setResult("Udalosť bola uložená! URL: " + data.url);
      setTitle("");
      setDate("");
      setDescription("");
    } else {
      setResult("Chyba: " + (data.error || "Neznáma chyba"));
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Pridať udalosť do kalendára</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Názov udalosti:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Dátum:</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Popis:</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Uložiť udalosť</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
}