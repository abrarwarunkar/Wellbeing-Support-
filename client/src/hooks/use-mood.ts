import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type MoodInput } from "@shared/routes";

export function useMoodEntries() {
  return useQuery({
    queryKey: [api.mood.list.path],
    queryFn: async () => {
      const res = await fetch(api.mood.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch mood entries");
      return api.mood.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMoodEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: MoodInput) => {
      const validated = api.mood.create.input.parse(data);
      const res = await fetch(api.mood.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create mood entry");
      return api.mood.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.mood.list.path] }),
  });
}
