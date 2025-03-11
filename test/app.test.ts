import { describe, expect, it } from "bun:test";
import { app } from "../src/app";
import { valkey } from "../src/shared/infrastructure/valkey";

describe("RB-BE", () => {
  it("[GET /v2] Return a response", async () => {
    const response = await app
      .handle(new Request("http://localhost:9944/v2"))
      .then((res) => res.text());

    expect(response).toBe(
      JSON.stringify({
        title: "Realm Bin BE",
        description: "The backend for Realm Bin. Made in ElysiaJS.",
        version: "1.0.0",
        apiPrefix: "v2",
        environment:
          Bun.env.RUNNING_ENV === "production" ? "production" : "development",
      })
    );
  });
  it("[POST /v2/post] Send a paste", async () => {
    const response = await app
      .handle(
        new Request("http://localhost:9944/v2/post", {
          method: "POST",
          body: JSON.stringify({ content: "Hello, World!" }),
          headers: {
            "Content-Type": "application/json",
          },
        })
      )
      .then((res) => res.text());

    const res = JSON.parse(response);

    expect(res.id).toEqual(expect.any(String));
    expect(res.paste).toEqual("Hello, World!");

    describe("RB-BE (Inheriting)", () => {
      it("[GET /v2/get/:id] Get a paste", async () => {
        const response = await app
          .handle(
            new Request(`http://localhost:9944/v2/get/${res.id}`, {
              method: "GET",
            })
          )
          .then((data) => data.text());

        // cleanup
        valkey.del(res.id);

        expect(response).toBe(
          JSON.stringify({
            id: res.id,
            paste: res.paste,
          })
        );
      });
    });
  });
});
