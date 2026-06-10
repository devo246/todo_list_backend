import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.body);
      req.body = result;
      next();
    } catch (error: any) {
      console.error("validate error", error);
      res.status(400).json({
        message: "Validation error",
        error: error.issues.map((err: any) => err.message),
      });
    }
  };

export default validate;