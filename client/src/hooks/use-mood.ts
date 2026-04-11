import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type MoodInput } from "@shared/routes";

export function useMoodEntries() {
  return useQuery({
    queryKey: [api.mood.list.path],
    queryFn: async () => {
      const res = await fetch(api.mood.list.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return { entries: [], analytics: { averageScore: 0, trend: "stable" } };
        throw new Error("Failed to fetch mood entries");
      }
      return res.json();
    },
    staleTime: 0, // Always re-fetch when component mounts after mutation
  });
}

export function useCreateMoodEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: MoodInput) => {
      const res = await fetch(api.mood.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save mood entry");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate mood entries so the list refreshes immediately
      queryClient.invalidateQueries({ queryKey: [api.mood.list.path] });
      // Also invalidate AI recommendations since mood context changed
      queryClient.invalidateQueries({ queryKey: ["/api/ai/recommendations"] });
    },
  });
}
