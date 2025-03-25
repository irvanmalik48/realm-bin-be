import { init } from "@paralleldrive/cuid2";
import { config } from "../../../config";

const createId = init({
  random: Math.random,
  length: config.idLength,
});

export { createId };
