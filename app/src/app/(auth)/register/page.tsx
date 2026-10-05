import type { Metadata } from "next";
import { RegisterView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Registro",
};

export default function RegisterPage() {
  return <RegisterView />;
}
