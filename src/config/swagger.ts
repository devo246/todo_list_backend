import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0", // swagger تحديد اصدار

    info: {
      title: "My API", // اسم المشروع
      version: "1.0.0", // اصدار المشروع
      description: "API documentation for my Express application",
    },

    servers: [
      {
        url: "http://localhost:3000", // الاساسي API عنوان الـ
      },
    ],
  },
  // routes داخل ملفات الـ Swagger comments روح دور على
  apis: ["./src/routes/*.ts"],
};
export const swaggerSpec = swaggerJSDoc(options);

