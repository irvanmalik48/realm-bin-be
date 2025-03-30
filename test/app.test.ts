import { describe, expect, it } from "bun:test";
import { app } from "../src/app";
import { valkey } from "../src/shared/infrastructure/valkey";
import { config } from "../config";

describe("RB-BE", () => {
  it("[GET /v2] Return a response", async () => {
    const response = await app
      .handle(new Request("http://localhost:9944/v2"))
      .then((res) => res.text());

    expect(response).toBe(
      JSON.stringify({
        title: "Realm Bin BE",
        description: "The backend for Realm Bin. Made in ElysiaJS.",
        version: "2.0.2",
        apiPrefix: "v2",
        environment: config.environment,
      })
    );
  });

  it("[POST /v2/post] Send a paste (text)", async () => {
    const form = new FormData();

    form.append("content", "Hello, World!");
    form.append("isLocked", "false");

    const response = await app
      .handle(
        new Request("http://localhost:9944/v2/post", {
          method: "POST",
          body: JSON.stringify(Object.fromEntries(form)),
          headers: {
            "Content-Type": "application/json",
          },
        })
      )
      .then((res) => res.text());

    const res = JSON.parse(response);

    expect(res.id).toEqual(expect.any(String));
    expect(res.paste).toEqual("Hello, World!");
    expect(res.isLocked).toEqual("false");

    describe("RB-BE (Inheriting)", () => {
      it("[GET /v2/get/:id] Get a paste (text)", async () => {
        const response = await app
          .handle(
            new Request(`http://localhost:9944/v2/get/${res.id}?type=text`, {
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

  it("[POST /v2/post] Send a passworded paste (text)", async () => {
    const response = await app
      .handle(
        new Request("http://localhost:9944/v2/post", {
          method: "POST",
          body: JSON.stringify({
            content: "Hello, World!",
            isLocked: "true",
            password: "password",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
      )
      .then((res) => res.text());

    const res = JSON.parse(response);

    expect(res.id).toEqual(expect.any(String));
    expect(res.paste).toEqual("Hello, World!");
    expect(res.isLocked).toEqual("true");
    expect(res.password).toEqual(expect.any(String));

    describe("RB-BE (Inheriting)", () => {
      it("[GET /v2/get/:id] Get a passworded paste (text)", async () => {
        const response = await app
          .handle(
            new Request(
              `http://localhost:9944/v2/get/${res.id}?type=text&password=password`,
              {
                method: "GET",
              }
            )
          )
          .then((data) => data.text());

        // cleanup
        await valkey.del(res.id);

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
