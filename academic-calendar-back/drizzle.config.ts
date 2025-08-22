import { defineConfig } from "drizzle-kit";
import path from "path";
import { env } from "./src/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/drizzle/schema/schema.ts", // caminho pro schema
  out: path.resolve("./src/drizzle/migrations"), // migrations vão aqui
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
});
