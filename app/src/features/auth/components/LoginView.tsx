import { Card } from "@/components/ui";
import { LoginForm } from "./LoginForm";

export function LoginView() {
  return (
    <Card title="Iniciar Sesión" titleLevel="h1" titleAlign="center" className="max-w-sm">
      <LoginForm />
    </Card>
  );
}
