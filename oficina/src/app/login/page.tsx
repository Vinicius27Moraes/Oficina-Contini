import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-amber-500 font-display text-2xl font-bold text-graphite-950">
            O
          </span>
          <h1 className="font-display text-2xl font-semibold text-paper">Oficina Mecânica</h1>
          <p className="text-sm text-graphite-500">Entre com seu e-mail e senha para acessar o sistema.</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
