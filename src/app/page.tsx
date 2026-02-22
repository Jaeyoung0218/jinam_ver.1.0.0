import { redirect } from "next/navigation";

export default function LegacyHomePageRedirect() {
  redirect("/ko");
}
