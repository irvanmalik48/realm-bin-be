import fastJson from "fast-json-stringify";

export interface IWelcomeMessage {
  title: string;
  description: string;
  version: string;
  apiPrefix: string;
  environment: string;
}

export interface IEndpoint {
  title: string;
  route: string;
  method: string;
  description: string;
}

export interface IListEndpoints {
  endpoints: IEndpoint[];
}

export class RootRepository {
  static welcome(): string {
    const welcomeSchema = fastJson({
      title: "Welcome Message Schema",
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        version: { type: "string" },
        apiPrefix: { type: "string" },
        environment: { type: "string" },
      },
    });

    const message = welcomeSchema<IWelcomeMessage>({
      title: "Realm Bin BE",
      description: "The backend for Realm Bin. Made in ElysiaJS.",
      version: "1.0.0",
      apiPrefix: "v2",
      environment:
        process.env.NODE_ENV === "production" ? "production" : "development",
    });

    if (process.env.NODE_ENV === "development")
      console.log("[RB-E] `/v2` accessed. Welcome message sent.");

    return message;
  }

  static listEndpoints(): string {
    const listEndpointsSchema = fastJson({
      title: "List Endpoints Schema",
      type: "object",
      properties: {
        endpoints: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              route: { type: "string" },
              method: { type: "string" },
              description: { type: "string" },
            },
          },
        },
      },
    });

    const message = listEndpointsSchema<IListEndpoints>({
      endpoints: [
        {
          title: "Welcome Message",
          route: "/",
          method: "GET",
          description: "Get the welcome message of the API.",
        },
        {
          title: "List Endpoints",
          route: "/endpoints",
          method: "GET",
          description: "List all the endpoints of the API.",
        },
        {
          title: "Get Paste by ID",
          route: "/get/:id",
          method: "GET",
          description: "Get paste by ID.",
        },
        {
          title: "Add Paste",
          route: "/post",
          method: "POST",
          description: "Add new paste. Use JSON body.",
        },
      ],
    });

    if (process.env.NODE_ENV === "development")
      console.log("[RB-E] `/v2/endpoints` accessed. List of endpoints sent.");

    return message;
  }
}
