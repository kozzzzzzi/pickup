export type OrderItem = {
  name: string;
  quantity: number;
};

export type Order = {
  id: string;
  token: string;
  name: string;
  phone: string;
  email: string;
  pickupDate: string;
  items: OrderItem[];
};

const orderStore: Order[] = [
  {
    id: "1",
    token: "7f83a9c2b1e4d6f8",
    name: "김태현",
    phone: "01012341234",
    email: "taehyun@example.com",
    pickupDate: "2026.03.23",
    items: [
      { name: "슬로건", quantity: 1 },
      { name: "우치와", quantity: 2 },
    ],
  },
  {
    id: "2",
    token: "a42d91f0c7e85b13",
    name: "박수민",
    phone: "01011112222",
    email: "sumin@example.com",
    pickupDate: "2026.03.23",
    items: [{ name: "포토카드", quantity: 1 }],
  },
  {
    id: "3",
    token: "f91ac82d74be103e",
    name: "이서윤",
    phone: "01099998888",
    email: "seoyun@example.com",
    pickupDate: "2026.03.24",
    items: [
      { name: "우치와", quantity: 1 },
      { name: "슬로건", quantity: 1 },
    ],
  },
];

export function getOrders() {
  return orderStore;
}

export function getOrderById(id: string) {
  return orderStore.find((order) => order.id === id) ?? null;
}

export function getOrderByToken(token: string) {
  return orderStore.find((order) => order.token === token) ?? null;
}