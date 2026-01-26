import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertDesign, type Design } from "@shared/schema";
import { z } from "zod";

export function useDesigns() {
  return useQuery({
    queryKey: [api.designs.list.path],
    queryFn: async () => {
      const res = await fetch(api.designs.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch designs");
      return api.designs.list.responses[200].parse(await res.json());
    },
  });
}

export function useDesign(id: number) {
  return useQuery({
    queryKey: [api.designs.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.designs.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch design");
      return api.designs.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

type GenerateInput = z.infer<typeof api.designs.generate.input>;

export function useGenerateDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GenerateInput) => {
      const validated = api.designs.generate.input.parse(data);
      const res = await fetch(api.designs.generate.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json(); // Assuming generic error response
          throw new Error(error.message || "Invalid request");
        }
        throw new Error("Failed to generate design");
      }
      
      return api.designs.generate.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.designs.list.path] }),
  });
}
