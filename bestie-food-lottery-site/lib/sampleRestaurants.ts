import type { Restaurant } from "./types";

export const sampleRestaurants: Restaurant[] = [
  {
    id: "r1",
    name: "樱桃小锅火锅",
    cuisine: "火锅",
    address: "示例地址：幸福路 88 号",
    phone: "000-0000-0000",
    avgPrice: "120",
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1200&auto=format&fit=crop",
    dianpingUrl: "",
    tags: ["热乎", "聊天", "疗愈"],
    note: "适合天气冷、想慢慢聊的时候。",
    rating: 5,
    latitude: 31.2304,
    longitude: 121.4737
  },
  {
    id: "r2",
    name: "月光寿司屋",
    cuisine: "日料",
    address: "示例地址：梧桐街 21 号",
    phone: "000-1111-2222",
    avgPrice: "160",
    imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
    dianpingUrl: "",
    tags: ["精致", "轻食", "仪式感"],
    note: "适合想吃得漂亮一点。",
    rating: 4,
    latitude: 31.235,
    longitude: 121.49
  },
  {
    id: "r3",
    name: "周五烧烤研究所",
    cuisine: "烧烤",
    address: "示例地址：夜宵巷 9 号",
    phone: "000-3333-6666",
    avgPrice: "90",
    imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=1200&auto=format&fit=crop",
    dianpingUrl: "",
    tags: ["夜宵", "快乐", "不想动脑"],
    note: "适合需要一点快乐垃圾食品的时候。",
    rating: 5,
    latitude: 31.222,
    longitude: 121.46
  }
];
