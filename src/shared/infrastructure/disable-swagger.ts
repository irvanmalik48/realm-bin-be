import Elysia from "elysia";

export const DisableSwaggerController = new Elysia({
  name: "Disable Swagger Controller",
}).get("/swagger", () => {
  return {
    err: "Swagger is disabled",
    message: "Swagger is disabled in production.",
  };
});
