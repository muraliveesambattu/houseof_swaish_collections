"use client";

import { useState, useCallback } from "react";

interface PincodeData {
  city: string;
  state: string;
  district: string;
}

export function usePincode() {
  const [data, setData] = useState<PincodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPincode = useCallback(async (pincode: string) => {
    if (!/^\d{6}$/.test(pincode)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pincode?pin=${pincode}`);
      if (!res.ok) throw new Error("Invalid pincode");
      const json = await res.json();
      setData(json);
    } catch {
      setError("Could not fetch pincode details");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchPincode };
}
