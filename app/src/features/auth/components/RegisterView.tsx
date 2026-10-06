import { Card } from "@/components/ui";
import { RegisterForm } from "./RegisterForm";

export function RegisterView() {
  return (
    <Card title="Registro" titleLevel="h1" titleAlign="center" className="max-w-sm">
      <RegisterForm />
    </Card>
  );
}
