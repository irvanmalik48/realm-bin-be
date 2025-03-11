import Valkey from "iovalkey";

const valkey = new Valkey(Bun.env.VALKEY_URL as string);

export { valkey };
