"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/test")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      <h1>Frontend + Backend Connected 🚀</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}