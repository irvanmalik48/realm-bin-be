import { init } from "@paralleldrive/cuid2";

const createId = init({
  random: Math.random,
  length: 5,
});

export { createId };
