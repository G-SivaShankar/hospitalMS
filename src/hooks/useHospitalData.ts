"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { initialData } from "../data/initialData";
import type { HospitalData } from "../types/hospital";

const STORAGE_KEY = "hospital-management-data";

function loadData(): HospitalData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved) as HospitalData;
    }
  } catch {
    console.error("Could not read saved hospital data.");
  }

  return initialData;
}

export function useHospitalData() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["hospital-data"],
    queryFn: loadData,
    initialData,
  });

  const mutation = useMutation({
    mutationFn: async (data: HospitalData) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["hospital-data"], data);
    },
  });

  return {
    data: query.data ?? initialData,
    saveData: mutation.mutate,
    isSaving: mutation.isPending,
  };
}