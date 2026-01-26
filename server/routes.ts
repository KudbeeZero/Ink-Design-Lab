import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { openai } from "./replit_integrations/image/client"; // Use the integrated client

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Generate tattoo design
  app.post(api.designs.generate.path, async (req, res) => {
    try {
      const { prompt, style } = api.designs.generate.input.parse(req.body);
      
      const fullPrompt = `Tattoo design of ${prompt}, style: ${style}, white background, high contrast, clean lines, professional tattoo flash sheet style`;

      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024",
      });

      const imageUrl = response.data[0].url;

      if (!imageUrl) {
        throw new Error("Failed to generate image from OpenAI");
      }

      const design = await storage.createDesign({
        prompt,
        style,
        imageUrl,
      });

      res.status(201).json(design);
    } catch (error: any) {
      console.error("Generation error:", error);
      res.status(500).json({ message: error.message || "Failed to generate design" });
    }
  });

  // List designs
  app.get(api.designs.list.path, async (req, res) => {
    const designs = await storage.getDesigns();
    res.json(designs);
  });

  // Get single design
  app.get(api.designs.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({ message: "Invalid ID" });
    }
    const design = await storage.getDesign(id);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.json(design);
  });

  return httpServer;
}
