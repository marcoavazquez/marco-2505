"use client"

import { useAuth } from "@/hooks/useAuth";
import { Appbar } from "./Appbar";
import { BetsGraphics } from "./BetsGraphics";
import { SnailsGraphic } from "./SnailsGraphic";
import { useBalance } from "@/hooks/useBalance";
import { BalanceCard } from "./BalanceCard";
import { SnailAvatar } from "@/components/ui/SnailAvatar";

export const DashboardView = () => {

  const { user } = useAuth()
  const { balance, deposit } = useBalance(user?.email!)

  return (
    <div className="flex min-h-screen flex-col">
      <Appbar />

      <main className="flex-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <SnailAvatar className="size-16" />
            <div className="min-w-0">
              <p className="mb-1 text-sm font-medium text-secondary">Tu rincón en la pista</p>
              <h1 className="break-words text-2xl font-bold">Hola, {user?.fullName}</h1>
              <p className="mt-2 text-sm text-secondary">Cada carrera cuenta, a su propio ritmo.</p>
            </div>
          </div>

          <BalanceCard balance={balance!} onDeposit={deposit} />
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-8">
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-lg font-semibold">Resumen de la pista</h2>
            <span aria-hidden="true" className="h-px flex-1 bg-border" />
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
            <BetsGraphics />
            <SnailsGraphic />
          </div>
        </div>
      </main>
    </div>
  )
}
