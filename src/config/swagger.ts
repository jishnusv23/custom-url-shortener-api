import { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Custom Url shortner",
      version: "1.0.0",
      description: "custom-url-shortener-api-documention",
    },
    server: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./src/routes/*.{ts,js}"],
};


export default swaggerOptions