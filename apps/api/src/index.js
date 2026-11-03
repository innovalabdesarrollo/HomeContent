import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:net";
import dotenv from "dotenv";
import { connectDb } from "./db.js";
import { createApp } from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const PORT = Number(process.env.PORT || 3007);

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "0.0.0.0");
  });
}

async function main() {
  if (!(await isPortFree(PORT))) {
    console.error(
      `Puerto ${PORT} en uso. No se mata ningún proceso. Libera el puerto o cambia PORT en .env.`
    );
    process.exit(1);
  }

  await connectDb(process.env.MONGODB_URI);
  console.log("MongoDB conectado");

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`API HomeContent en http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
