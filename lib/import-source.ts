export type ImportedOrder = {
  rowIndex: number;
  timestamp: string;
  email: string;
  pickupDate: string;
  depositorName: string;
  depositAmount: number;
  depositDate: string;
  depositTime: string;
  pickupPersonName: string;
  phone: string;
  confirmed: string;
  items: { name: string; quantity: number }[];
};

export async function fetchImportedOrders(): Promise<ImportedOrder[]> {
  const url = process.env.APPS_SCRIPT_URL;

  if (!url) {
    throw new Error("APPS_SCRIPT_URL is missing");
  }

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Import failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.ok || !Array.isArray(data.items)) {
    throw new Error("Invalid import response");
  }

  return data.items;
}