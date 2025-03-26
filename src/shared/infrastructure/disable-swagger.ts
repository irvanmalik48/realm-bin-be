import Elysia from "elysia";

export const DisableSwaggerController = new Elysia({
  name: "Disable Swagger Controller",
}).get("/v2/swagger", () => {
  return {
    err: "Swagger is disabled",
    message: "Swagger is disabled in production.",
  };
});
