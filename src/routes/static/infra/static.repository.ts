import fastJson from "fast-json-stringify";
import { config } from "../../../../config";

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
  queries?: IQuery[];
}

export interface IQuery {
  [key: string]: string | undefined;
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
      version: "2.0.0",
      apiPrefix: "v2",
      environment:
        config.environment === "production" ? "production" : "development",
    });

    if (config.environment === "development")
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
          queries: [
            {
              key: "type",
              alias: "t",
              description:
                "Type of paste. Can be 'text' or 'file'. Default is 'text'.",
            },
            {
              key: "password",
              alias: "p",
              description: "Password for the paste if it's locked. Optional.",
            },
          ],
          method: "GET",
          description: "Get paste by ID.",
        },
        {
          title: "Add Paste (Text)",
          route: "/post",
          method: "POST",
          description: "Add new text-based paste. Accepts JSON and FormData.",
        },
        {
          title: "Add Paste (File)",
          route: "/post",
          method: "PUT",
          description:
            "Add new file-based paste. Use multipart/form-data body.",
        },
      ],
    });

    if (config.environment === "development")
      console.log("[RB-E] `/v2/endpoints` accessed. List of endpoints sent.");

    return message;
  }
}
