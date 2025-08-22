import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"
import { env } from "../env"

const sql = postgres(env.POSTGRES_URL, { max: 1 })
const db = drizzle(sql)

async function main() {
  console.log("🚀 Rodando migrations...")

  await migrate(db, { migrationsFolder: "../drizzle/migrations/meta" })

  console.log("✅ Migrations aplicadas com sucesso!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Erro ao rodar migrations:", err)
  process.exit(1)
})
