import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

export default async function HomePage() {
  const isLoggedIn = await verifySession();

  if (isLoggedIn) {
    redirect("/dashboard");
  }

  redirect("/login");
}