"use client";

import { useState, useEffect } from "react";




type Tire = {
  id: number;
  company: string;
  plate: string;
  size: string;
  pattern: string;
  condition: "〇" | "△" | "✕";
  wheelType: "アルミ" | "鉄" | "なし";
};




export default function Home() {
  const [editingId, setEditingId] = useState<number | null>(null);
const [editTire, setEditTire] = useState<Tire | null>(null);

  

const [search, setSearch] = useState("");
const [sortType, setSortType] = useState("company");



const [newTire, setNewTire] = useState({
  company: "",
  plate: "",
  size: "",
  pattern: "",
  condition: "〇" as "〇" | "△" | "✕",
  wheelType: "アルミ" as "アルミ" | "鉄" | "なし",
  quantity: 1,
});


const [tires, setTires] = useState<Tire[]>([
  {
    id: 1,
    company: "〇〇運輸",
    plate: "足立100 あ 1234",
    size: "11R22.5",
    pattern: "M890",
    condition: "〇",
    wheelType: "アルミ",
  },
  {
    id: 2,
    company: "△△物流",
    plate: "品川200 い 5678",
    size: "245/70R19.5",
    pattern: "R173",
    condition: "✕",
    wheelType: "鉄",
  },
]);
  useEffect(() => {
    const saved = localStorage.getItem("tires");
    if (saved) {
      setTires(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tires", JSON.stringify(tires));
  }, [tires]);
const filteredTires = tires.filter((tire) => {
  return (
    tire.company.includes(search) ||
    tire.plate.includes(search) ||
    tire.size.includes(search)
  );
});




const groupedTires = filteredTires.reduce((acc, tire) => {
  const key = `${tire.company}_${tire.plate}_${tire.size}`;

  if (!acc[key]) {
    acc[key] = {
      company: tire.company,
      plate: tire.plate,
      size: tire.size,
      good: 0,
      warning: 0,
      bad: 0,
      total: 0,
    };
  }

  if (tire.condition === "〇") acc[key].good += 1;
  if (tire.condition === "△") acc[key].warning += 1;
  if (tire.condition === "✕") acc[key].bad += 1;

  acc[key].total += 1;

  return acc;
}, {} as Record<
  string,
  {
    company: string;
    plate: string;
    size: string;
    good: number;
    warning: number;
    bad: number;
    total: number;
  }
>);
const sortedGroups = Object.entries(groupedTires).sort((a, b) =>
  a[1].company.localeCompare(b[1].company, "ja")
);





const handleDelete = (id: number) => {
  setTires(tires.filter((tire) => tire.id !== id));
};



  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        🛞 タイヤ保管管理システム
      </h1>

      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <input
          type="text"
          placeholder="会社名・ナンバー・サイズで検索（下4桁もOK）"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <h2 className="font-bold mb-3">📝 タイヤ登録</h2>

        <div className="grid gap-3">
          <input
            type="text"
            placeholder="会社名"
            className="border p-2 rounded"
            value={newTire.company}
            onChange={(e) =>
              setNewTire({ ...newTire, company: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="車両ナンバー"
            className="border p-2 rounded"
            value={newTire.plate}

            onChange={(e) =>
              setNewTire({ ...newTire, plate: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="タイヤサイズ"
            className="border p-2 rounded"
            value={newTire.size}

            onChange={(e) =>
              setNewTire({ ...newTire, size: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="本数"
         className="border p-2 rounded"
         value={newTire.quantity}

            onChange={(e) =>
              setNewTire({
                ...newTire,
                quantity: Number(e.target.value),
              })
            }
          />
          <select
  className="border p-2 rounded"
  value={newTire.wheelType}

  onChange={(e) =>
    setNewTire({
      ...newTire,
      wheelType: e.target.value as "アルミ" | "鉄" | "なし",
    })
  }
>
  <option value="アルミ">アルミ</option>
  <option value="鉄">鉄</option>
  <option value="なし">なし</option>
</select>

            <select
  className="border p-2 rounded"
  value={newTire.condition}

  onChange={(e) =>
    setNewTire({
      ...newTire,
      condition: e.target.value as "〇" | "△" | "✕",
    })
  }
>
  <option value="〇">〇（良好）</option>
  <option value="△">△（注意）</option>
  <option value="✕">✕（交換）</option>
</select>
  
           

          <button
            className="bg-blue-600 text-white p-2 rounded"
onClick={() => {
  const newEntries: Tire[] = [];

  for (let i = 0; i < newTire.quantity; i++) {
    newEntries.push({
      id: Date.now() + i,
      company: newTire.company,
      plate: newTire.plate,
      size: newTire.size,
      pattern: "未設定",
      condition: newTire.condition,
      wheelType: newTire.wheelType,
    });
  }

  setTires([...tires, ...newEntries]);
  setNewTire({
  company: "",
  plate: "",
  size: "",
  pattern: "",
  condition: "〇",
  wheelType: "アルミ",
  quantity: 1,
});

}}

          >
            登録
            </button>
            </div>
</div>
{editTire && (
  <div className="bg-yellow-50 p-4 rounded-xl shadow-md mb-6">
    <h2 className="font-bold mb-3">✏ 一括編集</h2>

    <select
      className="border p-2 rounded w-full mb-3"
      value={editTire.condition}
      onChange={(e) =>
        setEditTire({
          ...editTire,
          condition: e.target.value as "〇" | "△" | "✕",
        })
      }
    >
      <option value="〇">〇（良好）</option>
      <option value="△">△（注意）</option>
      <option value="✕">✕（交換）</option>
    </select>

    <select
      className="border p-2 rounded w-full mb-3"
      value={editTire.wheelType}
      onChange={(e) =>
        setEditTire({
          ...editTire,
          wheelType: e.target.value as "アルミ" | "鉄" | "なし",
        })
      }
    >
      <option value="アルミ">アルミ</option>
      <option value="鉄">鉄</option>
      <option value="なし">なし</option>
    </select>

    <button
      className="bg-green-600 text-white p-2 rounded w-full"
      onClick={() => {
        setTires(
          tires.map((t) =>
            t.company === editTire.company &&
            t.plate === editTire.plate &&
            t.size === editTire.size
              ? {
                  ...t,
                  condition: editTire.condition,
                  wheelType: editTire.wheelType,
                }
              : t
          )
        );
        setEditTire(null);
      }}
    >
      保存
    </button>
  </div>
)}




<div className="mb-4">
 
</div>

      <div className="space-y-4">

        
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md mt-6">
  <h2 className="font-bold mb-3">📊 集計一覧</h2>
  

{sortedGroups.map(([key, item]) => (

  <div key={key} className="border-b py-3 flex justify-between items-center">
    <div>
      <div className="font-semibold">
        {item.company} ｜ {item.plate} ｜ {item.size}
      </div>
     <div className="text-sm mt-1 space-x-4">

  {/* 〇 */}
  <span>
    〇 {item.good}本
    <button
      className="ml-2 bg-blue-500 text-white px-2 rounded"
      onClick={() => {
        setTires([
          ...tires,
          {
            id: Date.now(),
            company: item.company,
            plate: item.plate,
            size: item.size,
            pattern: "未設定",
            condition: "〇",
            wheelType: "アルミ",
          },
        ]);
      }}
    >
      ＋
    </button>

    <button
      className="ml-1 bg-gray-400 text-white px-2 rounded"
      onClick={() => {
        const target = tires.find(
          (t) =>
            t.company === item.company &&
            t.plate === item.plate &&
            t.size === item.size &&
            t.condition === "〇"
        );

        if (!target) return;

        setTires(tires.filter((t) => t.id !== target.id));
      }}
    >
      −
    </button>
  </span>

  {/* △ */}
  <span>
    △ {item.warning}本
    <button
      className="ml-2 bg-yellow-500 text-white px-2 rounded"
      onClick={() => {
        setTires([
          ...tires,
          {
            id: Date.now(),
            company: item.company,
            plate: item.plate,
            size: item.size,
            pattern: "未設定",
            condition: "△",
            wheelType: "アルミ",
          },
        ]);
      }}
    >
      ＋
    </button>

    <button
      className="ml-1 bg-gray-400 text-white px-2 rounded"
      onClick={() => {
        const target = tires.find(
          (t) =>
            t.company === item.company &&
            t.plate === item.plate &&
            t.size === item.size &&
            t.condition === "△"
        );

        if (!target) return;

        setTires(tires.filter((t) => t.id !== target.id));
      }}
    >
      −
    </button>
  </span>

  {/* ✕ */}
  <span>
    ✕ {item.bad}本
    <button
      className="ml-2 bg-red-600 text-white px-2 rounded"
      onClick={() => {
        setTires([
          ...tires,
          {
            id: Date.now(),
            company: item.company,
            plate: item.plate,
            size: item.size,
            pattern: "未設定",
            condition: "✕",
            wheelType: "アルミ",
          },
        ]);
      }}
    >
      ＋
    </button>

    <button
      className="ml-1 bg-gray-400 text-white px-2 rounded"
      onClick={() => {
        const target = tires.find(
          (t) =>
            t.company === item.company &&
            t.plate === item.plate &&
            t.size === item.size &&
            t.condition === "✕"
        );

        if (!target) return;

        setTires(tires.filter((t) => t.id !== target.id));
      }}
    >
      −
    </button>
  </span>

  <span className="ml-4 font-bold">
    合計 {item.total}本
  </span>
</div>

    </div>

    <button
      className="bg-yellow-500 text-white px-3 py-1 rounded"
      onClick={() => {
        const groupTires = tires.filter(
          (t) =>
            t.company === item.company &&
            t.plate === item.plate &&
            t.size === item.size
        );

        setEditTire(groupTires[0]);
      }}
    >
      編集
    </button>
  </div>
))}
</div>




    </main>
  );
}
