import { z } from "zod";
import { insertDesignSchema, designs } from "./schema";

export const api = {
  designs: {
    generate: {
      method: "POST" as const,
      path: "/api/designs/generate",
      input: z.object({
        prompt: z.string().min(1, "Prompt is required"),
        style: z.string().min(1, "Style is required"),
      }),
      responses: {
        201: z.custom<typeof designs.$inferSelect>(), // Returns the created design
        400: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/designs",
      responses: {
        200: z.array(z.custom<typeof designs.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/designs/:id",
      responses: {
        200: z.custom<typeof designs.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
