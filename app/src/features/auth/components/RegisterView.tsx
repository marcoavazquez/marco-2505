import { Card } from "@/components/ui";
import { RegisterForm } from "./RegisterForm";

export function RegisterView() {
  return (
    <Card title="Registro" description="Tu lugar en la pista empieza aquí." titleLevel="h1" className="max-w-sm border-t-4 border-t-primary sm:p-8">
      <RegisterForm />
    </Card>
  );
}
