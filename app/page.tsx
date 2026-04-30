"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Restaurant } from "@/lib/types";
import { sampleRestaurants } from "@/lib/sampleRestaurants";

declare global {
  interface Window {
    AMap?: any;
  }
}

const STORAGE_KEY = "bestie-food-restaurants-v1";
const USER_KEY = "bestie-food-user-v1";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function splitTags(value: string) {
  return value
    .split(/[，,\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function createEmptyRestaurant(): Restaurant {
  return {
    id: uid(),
    name: "",
    cuisine: "火锅",
    address: "",
    phone: "",
    avgPrice: "",
    imageUrl: "",
    dianpingUrl: "",
    tags: [],
    note: "",
    rating: 5,
    latitude: 31.2304 + Math.random() * 0.03,
    longitude: 121.4737 + Math.random() * 0.03
  };
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(sampleRestaurants);
  const [selected, setSelected] = useState<Restaurant | null>(sampleRestaurants[0]);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("全部");
  const [form, setForm] = useState<Restaurant>(createEmptyRestaurant());
  const [tagInput, setTagInput] = useState("");
  const [lotteryResult, setLotteryResult] = useState<Restaurant | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      setEmail(savedUser);
      setIsLoggedIn(true);
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Restaurant[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRestaurants(parsed);
          setSelected(parsed[0]);
        }
      } catch {
        setRestaurants(sampleRestaurants);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
  }, [restaurants]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    restaurants.forEach((item) => item.tags.forEach((tag) => set.add(tag)));
    return ["全部", ...Array.from(set)];
  }, [restaurants]);

  const filtered = useMemo(() => {
    return restaurants.filter((item) => {
      const keyword = query.trim().toLowerCase();
      const matchKeyword =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.cuisine.toLowerCase().includes(keyword) ||
        item.address.toLowerCase().includes(keyword) ||
        item.tags.join(" ").toLowerCase().includes(keyword);
      const matchTag = tagFilter === "全部" || item.tags.includes(tagFilter);
      return matchKeyword && matchTag;
    });
  }, [restaurants, query, tagFilter]);

  function login() {
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) return;
    localStorage.setItem(USER_KEY, cleanEmail);
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    setIsLoggedIn(false);
  }

  function addRestaurant() {
    if (!form.name.trim() || !form.address.trim()) return;

    const next: Restaurant = {
      ...form,
      id: uid(),
      imageUrl:
        form.imageUrl ||
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
      tags: tagInput ? splitTags(tagInput) : form.tags,
      latitude: form.latitude || 31.2304 + Math.random() * 0.03,
      longitude: form.longitude || 121.4737 + Math.random() * 0.03
    };

    setRestaurants((prev) => [next, ...prev]);
    setSelected(next);
    setForm(createEmptyRestaurant());
    setTagInput("");
  }

  function removeRestaurant(id: string) {
    const next = restaurants.filter((item) => item.id !== id);
    setRestaurants(next);
    setSelected(next[0] || null);
  }

  function drawRestaurant() {
    const pool = filtered.length ? filtered : restaurants;
    if (!pool.length) return;

    setIsDrawing(true);
    setLotteryResult(null);

    let count = 0;
    const timer = window.setInterval(() => {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setSelected(pick);
      count += 1;
      if (count > 12) {
        window.clearInterval(timer);
        const finalPick = pool[Math.floor(Math.random() * pool.length)];
        setSelected(finalPick);
        setLotteryResult(finalPick);
        setIsDrawing(false);
      }
    }, 90);
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] bg-white/75 p-5 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-cherry">Bestie Food Lottery</p>
            <h1 className="text-3xl font-bold tracking-tight text-ink md:text-5xl">
              今天吃哪家？
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-cocoa md:text-base">
              把你和闺蜜想吃的饭店放进地图。纠结的时候，一键抽签，命运替你们点菜。
            </p>
          </div>

          <div className="w-full rounded-3xl bg-rosefog/45 p-4 md:w-[340px]">
            {isLoggedIn ? (
              <div>
                <p className="text-xs text-cocoa">当前私人存档</p>
                <p className="mt-1 truncate font-semibold text-ink">{email}</p>
                <button
                  onClick={logout}
                  className="mt-3 rounded-full border border-cherry/30 px-4 py-2 text-sm font-semibold text-cherry"
                >
                  退出
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-ink">邮箱登录入口</p>
                <p className="mt-1 text-xs leading-5 text-cocoa">
                  默认数据保存在当前设备。后续接 Supabase 后，可升级为真正云端独立存档。
                </p>
                <div className="mt-3 flex gap-2">
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="min-w-0 flex-1 rounded-full border border-rosefog bg-white px-4 py-2 text-sm outline-none focus:border-cherry"
                  />
                  <button
                    onClick={login}
                    className="rounded-full bg-cherry px-4 py-2 text-sm font-semibold text-white"
                  >
                    进入
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <StatCard label="已收藏饭店" value={`${restaurants.length} 家`} />
          <StatCard label="当前筛选结果" value={`${filtered.length} 家`} />
          <StatCard label="今日建议" value={selected?.name || "先添加饭店"} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="rounded-[2rem] bg-white p-4 shadow-soft md:p-5">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink">饭店地图</h2>
                <p className="mt-1 text-sm text-cocoa">点击点位查看饭店详情。</p>
              </div>
              <button
                onClick={drawRestaurant}
                disabled={isDrawing}
                className="lottery-shine rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-70"
              >
                {isDrawing ? "抽签中..." : "不知道吃什么，抽签"}
              </button>
            </div>

            <FoodMap restaurants={filtered} selected={selected} onSelect={setSelected} />

            {lotteryResult && (
              <div className="mt-4 rounded-[1.5rem] border border-cherry/20 bg-rosefog/45 p-4">
                <p className="text-sm font-semibold text-cherry">今日饭票已出</p>
                <h3 className="mt-1 text-2xl font-bold text-ink">{lotteryResult.name}</h3>
                <p className="mt-2 text-sm leading-6 text-cocoa">
                  理由：你们已经纠结够久了，这家现在看起来最适合。
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
                    就它了
                  </button>
                  <button
                    onClick={drawRestaurant}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-cherry"
                  >
                    再抽一次
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <RestaurantDetail restaurant={selected} />
            <PrivacyBox />
          </aside>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <AddRestaurantPanel
            form={form}
            setForm={setForm}
            tagInput={tagInput}
            setTagInput={setTagInput}
            onAdd={addRestaurant}
          />

          <div className="rounded-[2rem] bg-white p-5 shadow-soft">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink">饭店清单</h2>
                <p className="mt-1 text-sm text-cocoa">搜索、筛选、点开，或者删掉不想吃的。</p>
              </div>
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索饭店/菜系/标签"
                  className="w-full rounded-full border border-rosefog px-4 py-2 text-sm outline-none focus:border-cherry md:w-48"
                />
                <select
                  value={tagFilter}
                  onChange={(event) => setTagFilter(event.target.value)}
                  className="rounded-full border border-rosefog bg-white px-4 py-2 text-sm outline-none focus:border-cherry"
                >
                  {allTags.map((tag) => (
                    <option key={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`overflow-hidden rounded-[1.5rem] border text-left transition hover:-translate-y-0.5 hover:shadow-soft ${
                    selected?.id === item.id ? "border-cherry bg-rosefog/30" : "border-rosefog bg-white"
                  }`}
                >
                  <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-ink">{item.name}</h3>
                        <p className="mt-1 text-sm text-cocoa">{item.cuisine} · 人均 {item.avgPrice || "-"} 元</p>
                      </div>
                      <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-cherry">
                        {item.rating} 星
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-rosefog/60 px-2 py-1 text-xs text-cocoa">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        removeRestaurant(item.id);
                      }}
                      className="mt-3 text-xs font-semibold text-cherry/80"
                    >
                      删除
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-white/80 p-5 shadow-soft">
      <p className="text-sm text-cocoa">{label}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function FoodMap({
  restaurants,
  selected,
  onSelect
}: {
  restaurants: Restaurant[];
  selected: Restaurant | null;
  onSelect: (restaurant: Restaurant) => void;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const amapKey = process.env.NEXT_PUBLIC_AMAP_KEY;

  useEffect(() => {
    if (!amapKey || !mapRef.current) return;

    const scriptId = "amap-js-api";
    const initMap = () => {
      if (!window.AMap || !mapRef.current) return;
      mapRef.current.innerHTML = "";
      const map = new window.AMap.Map(mapRef.current, {
        zoom: 12,
        center: selected ? [selected.longitude, selected.latitude] : [121.4737, 31.2304]
      });

      restaurants.forEach((item) => {
        const marker = new window.AMap.Marker({
          position: [item.longitude, item.latitude],
          title: item.name
        });
        marker.on("click", () => onSelect(item));
        map.add(marker);
      });
    };

    if (document.getElementById(scriptId)) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}`;
    script.onload = initMap;
    document.body.appendChild(script);
  }, [amapKey, restaurants, selected, onSelect]);

  if (amapKey) {
    return <div ref={mapRef} className="h-[460px] overflow-hidden rounded-[1.5rem] bg-cream" />;
  }

  return (
    <div className="map-gradient relative h-[460px] overflow-hidden rounded-[1.5rem] border border-rosefog">
      <div className="absolute inset-x-8 top-1/2 h-1 rounded-full bg-white/80" />
      <div className="absolute left-1/2 top-8 h-[80%] w-1 rounded-full bg-white/70" />
      <div className="absolute bottom-6 left-6 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-cocoa">
        未配置高德 Key：当前为模拟地图
      </div>

      {restaurants.map((item, index) => {
        const left = 18 + ((index * 23) % 62);
        const top = 18 + ((index * 31) % 58);
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-xs font-bold shadow-soft transition hover:scale-105 ${
              selected?.id === item.id ? "bg-cherry text-white" : "bg-white text-ink"
            }`}
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            {item.cuisine}
          </button>
        );
      })}
    </div>
  );
}

function RestaurantDetail({ restaurant }: { restaurant: Restaurant | null }) {
  if (!restaurant) {
    return (
      <div className="rounded-[2rem] bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold text-ink">饭店详情</h2>
        <p className="mt-3 text-sm text-cocoa">还没有选择饭店。</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
      <div className="h-52 bg-cover bg-center" style={{ backgroundImage: `url(${restaurant.imageUrl})` }} />
      <div className="p-5">
        <p className="text-sm font-semibold text-cherry">{restaurant.cuisine}</p>
        <h2 className="mt-1 text-2xl font-bold text-ink">{restaurant.name}</h2>
        <p className="mt-3 text-sm leading-6 text-cocoa">{restaurant.note || "还没有备注，可以写下这家适合什么心情。"}</p>

        <div className="mt-4 space-y-2 text-sm text-cocoa">
          <p><strong className="text-ink">地址：</strong>{restaurant.address}</p>
          <p><strong className="text-ink">电话：</strong>{restaurant.phone || "未填写"}</p>
          <p><strong className="text-ink">人均：</strong>{restaurant.avgPrice || "-"} 元</p>
          <p><strong className="text-ink">评分：</strong>{restaurant.rating} / 5</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {restaurant.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-rosefog/60 px-3 py-1 text-xs font-semibold text-cocoa">
              {tag}
            </span>
          ))}
        </div>

        {restaurant.dianpingUrl ? (
          <a
            href={restaurant.dianpingUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
          >
            打开大众点评
          </a>
        ) : (
          <p className="mt-5 rounded-2xl bg-cream p-3 text-xs leading-5 text-cocoa">
            还没有填写大众点评链接。建议手动粘贴链接，不抓取平台图片和数据。
          </p>
        )}
      </div>
    </div>
  );
}

function PrivacyBox() {
  return (
    <div className="rounded-[2rem] bg-ink p-5 text-white shadow-soft">
      <h2 className="text-lg font-bold">隐私说明</h2>
      <p className="mt-3 text-sm leading-6 text-white/80">
        这个初版默认把饭店清单保存在当前设备，不要求真实姓名，也不会公开你的饭店收藏、抽签记录和个人备注。
        后续接入 Supabase 后，可以升级为邮箱账号独立云端存档。
      </p>
    </div>
  );
}

function AddRestaurantPanel({
  form,
  setForm,
  tagInput,
  setTagInput,
  onAdd
}: {
  form: Restaurant;
  setForm: (value: Restaurant) => void;
  tagInput: string;
  setTagInput: (value: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-soft">
      <h2 className="text-xl font-bold text-ink">添加想吃的店</h2>
      <p className="mt-1 text-sm text-cocoa">第一版建议手动录入，安全、稳定、可控。</p>

      <div className="mt-4 grid gap-3">
        <Input label="饭店名称" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <Input label="菜系" value={form.cuisine} onChange={(value) => setForm({ ...form, cuisine: value })} />
        <Input label="地址" value={form.address} onChange={(value) => setForm({ ...form, address: value })} />
        <Input label="电话" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
        <Input label="人均价格" value={form.avgPrice} onChange={(value) => setForm({ ...form, avgPrice: value })} />
        <Input label="饭店图片 URL" value={form.imageUrl} onChange={(value) => setForm({ ...form, imageUrl: value })} />
        <Input label="大众点评链接" value={form.dianpingUrl} onChange={(value) => setForm({ ...form, dianpingUrl: value })} />
        <Input label="标签，用逗号分隔" value={tagInput} onChange={setTagInput} placeholder="热乎, 聊天, 便宜" />

        <label className="text-sm font-semibold text-ink">
          备注
          <textarea
            value={form.note}
            onChange={(event) => setForm({ ...form, note: event.target.value })}
            placeholder="例如：适合周五晚上边吃边聊。"
            className="mt-1 h-24 w-full resize-none rounded-2xl border border-rosefog px-4 py-3 text-sm font-normal outline-none focus:border-cherry"
          />
        </label>

        <label className="text-sm font-semibold text-ink">
          闺蜜评分：{form.rating} 星
          <input
            type="range"
            min="1"
            max="5"
            value={form.rating}
            onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}
            className="mt-2 w-full"
          />
        </label>

        <button
          onClick={onAdd}
          className="mt-2 rounded-full bg-cherry px-5 py-3 text-sm font-bold text-white"
        >
          加入饭店清单
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="text-sm font-semibold text-ink">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-full border border-rosefog px-4 py-3 text-sm font-normal outline-none focus:border-cherry"
      />
    </label>
  );
}
