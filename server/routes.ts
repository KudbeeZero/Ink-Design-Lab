import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { openai } from "./replit_integrations/image/client";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.auth.me.path, async (req: any, res) => {
    if (!req.isAuthenticated()) return res.json(null);
    const replitUser = req.user.claims;
    const user = await storage.getOrCreateUserByReplitId(replitUser.sub, replitUser.name || replitUser.email);
    res.json({ id: user.id, username: user.username });
  });

  // Generate tattoo design
  app.post(api.designs.generate.path, isAuthenticated, async (req: any, res) => {
    try {
      const replitUser = req.user.claims;
      const user = await storage.getOrCreateUserByReplitId(replitUser.sub, replitUser.name || replitUser.email);
      
      const { prompt, style } = api.designs.generate.input.parse(req.body);
      
      const fullPrompt = `Masterpiece tattoo flash sheet, ${prompt}, ${style} style, isolated on pure white background, ultra-high contrast black ink, sharp professional linework, clean vector-like precision, cinematic lighting on the artwork, 8k resolution, minimalist masterpiece.`;

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

      const design = await storage.createDesign(user.id, {
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
  app.get(api.designs.list.path, isAuthenticated, async (req: any, res) => {
    const replitUser = req.user.claims;
    const user = await storage.getOrCreateUserByReplitId(replitUser.sub, replitUser.name || replitUser.email);
    
    const designs = await storage.getDesigns(user.id);
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
