import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const STORAGE_KEY = "calorie_app_final";

export default function App() {
  const videoRef = useRef(null);
  const reader = useRef(null);

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [editing, setEditing] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const foods = data[today] || [];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    reader.current = new BrowserMultiFormatReader();
  }, []);

  const total = foods.reduce((s, f) => s + f.kcal, 0);

  const saveFood = () => {
    if (!name || !kcal) return;

    setData(prev => {
      const day = prev[today] || [];

      if (editing !== null) {
        const updated = [...day];
        updated[editing] = { name, kcal: Number(kcal) };
        return { ...prev, [today]: updated };
      }

      return {
        ...prev,
        [today]: [...day, { name, kcal: Number(kcal) }]
      };
    });

    setName("");
    setKcal("");
    setEditing(null);
  };

  const deleteFood = (i) => {
    setData(prev => {
      const updated = foods.filter((_, idx) => idx !== i);
      return { ...prev, [today]: updated };
    });
  };

  const editFood = (i) => {
    setName(foods[i].name);
    setKcal(foods[i].kcal);
    setEditing(i);
  };

  const startScanner = async () => {
    const devices = await reader.current.listVideoInputDevices();
    const id = devices[0].deviceId;

    reader.current.decodeFromVideoDevice(id, videoRef.current, async (res) => {
      if (res) {
        const barcode = res.getText();

        try {
          const r = await fetch(
            `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
          );
          const d = await r.json();

          if (d.status === 1) {
            const product = d.product;
            setName(product.product_name || "Unbekannt");
            setKcal(
              Math.round(product.nutriments?.["energy-kcal_100g"] || 100)
            );
          } else {
            alert("Produkt nicht gefunden");
          }
        } catch {
          alert("Fehler beim Laden");
        }
      }
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🍎 Kalorien Tracker</h1>

      <div style={styles.card}>
        <h2 style={{ margin: 0 }}>{today}</h2>
        <p style={styles.total}>{total} kcal</p>
      </div>

      <div style={styles.card}>
        <input
          placeholder="Lebensmittel"
          value={name}
          onChange={e => setName(e.target.value)}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Kalorien"
          value={kcal}
          onChange={e => setKcal(e.target.value)}
          style={styles.input}
        />

        <button style={styles.greenBtn} onClick={saveFood}>
          {editing !== null ? "Speichern" : "Hinzufügen"}
        </button>

        <button style={styles.blueBtn} onClick={startScanner}>
          📷 Barcode scannen
        </button>

        <video ref={videoRef} style={styles.video} />
      </div>

      <div>
        {foods.map((f, i) => (
          <div key={i} style={styles.item}>
            <div>
              <b>{f.name}</b>
              <div style={{ color: "#555" }}>{f.kcal} kcal</div>
            </div>

            <div>
              <button onClick={() => editFood(i)} style={styles.editBtn}>✏️</button>
              <button onClick={() => deleteFood(i)} style={styles.deleteBtn}>❌</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>📅 Verlauf</h3>
        {Object.keys(data).map(day => (
          <div key={day} style={styles.history}>
            <b>{day}</b>
            <div>
              {data[day].reduce((s, f) => s + f.kcal, 0)} kcal
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "system-ui",
    background: "#f0f2f5",
    minHeight: "100vh",
    padding: 20,
    maxWidth: 500,
    margin: "auto"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },
  total: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50"
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    border: "1px solid #ddd"
  },
  greenBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    background: "#4CAF50",
    color: "white",
    border: "none",
    marginBottom: 10
  },
  blueBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    background: "#2196F3",
    color: "white",
    border: "none"
  },
  video: {
    width: "100%",
    marginTop: 10,
    borderRadius: 12
  },
  item: {
    background: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  editBtn: {
    marginRight: 5,
    padding: 8,
    borderRadius: 8,
    border: "none",
    background: "#eee"
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 8,
    border: "none",
    background: "#ff6b6b",
    color: "white"
  },
  history: {
    background: "white",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    display: "flex",
    justifyContent: "space-between"
  }
};