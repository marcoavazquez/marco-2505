import { Card } from "@/components/ui";
import { LoginForm } from "./LoginForm";

export function LoginView() {
  return (
    <Card title="Iniciar sesión" description="Qué bueno tenerte de vuelta en la pista." titleLevel="h1" className="max-w-sm border-t-4 border-t-primary sm:p-8">
      <LoginForm />
    </Card>
  );
}
