"use client";

import { useState, useEffect, useCallback } from "react";
import { addressService } from "@/services/address.service";
import type { IDivision, IDistrict } from "@/types/address.type";

export function useLocations() {
  const [divisions, setDivisions] = useState<IDivision[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(
    null,
  );
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDivisions = useCallback(async () => {
    setIsLoadingDivisions(true);
    const { data, error } = await addressService.getDivisions();
    if (error) {
      setError(error.message);
      setDivisions([]);
    } else {
      setDivisions(data || []);
      setError(null);
    }
    setIsLoadingDivisions(false);
  }, []);

  const fetchDistrictsByDivision = useCallback(async (divisionId: number) => {
    setIsLoadingDistricts(true);
    setSelectedDivisionId(divisionId);
    const { data, error } =
      await addressService.getDistrictsByDivision(divisionId);
    if (error) {
      setError(error.message);
      setDistricts([]);
    } else {
      setDistricts(data || []);
      setError(null);
    }
    setIsLoadingDistricts(false);
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => fetchDivisions());
  }, [fetchDivisions]);

  return {
    divisions,
    districts,
    selectedDivisionId,
    isLoadingDivisions,
    isLoadingDistricts,
    error,
    fetchDivisions,
    fetchDistrictsByDivision,
  };
}
