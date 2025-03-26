import destr from "destr";
import Valkey from "iovalkey";
import { IGetPaste } from "../../routes/get/infra/get.repository";

export function deleteExpiredFilesListener() {
  const valkey = new Valkey(Bun.env.VALKEY_URL as string);

  valkey.subscribe("expired", (err, _count) => {
    if (err) {
      console.error(err);
    } else {
      console.log("[RB-E] Listening to expired events...");
    }
  });

  valkey.on("message", async (_channel, message) => {
    const key = message.split("-")[0];
    console.log(
      `[RB-E] Expired key: ${key}. Deleting subsequent file and original store...`
    );
    const file = await valkey.get(key);
    if (file) {
      const { paste } = destr<Omit<IGetPaste, "id">>(file);
      const path = paste.split(":::")[1];
      await Bun.file(path)
        .delete()
        .catch((err) => {
          console.error(err);
        });
      await valkey.del(key).catch((err) => {
        console.error(err);
      });
      console.log(`Key ${key} deleted and cleaned.`);
    }
    await valkey.del(key);
    console.log(`Key ${key} deleted and cleaned.`);
  });

  // Gracefully exit on SIGINT and SIGTERM
  process.on("SIGINT", () => {
    console.log("\n[RB-E] SIGINT received. Gracefully exiting...");
    valkey.unsubscribe("expired");
    valkey.quit();
    console.log("[RB-E] Sayonara!");
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("[RB-E] SIGTERM received. Gracefully exiting...");
    valkey.unsubscribe("expired");
    valkey.quit();
    console.log("[RB-E] Sayonara!");
    process.exit(0);
  });
}
