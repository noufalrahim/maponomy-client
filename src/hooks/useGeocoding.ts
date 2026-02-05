/* eslint-disable @typescript-eslint/no-explicit-any */
import { geocodingReq } from "@/lib/geocodingReq";
import { useState } from "react";

export const useGeocoding = () => {
  const [places, setPlaces] = useState<{
    lat: number;
    lon: number;
    formatted_address: string;
  }[]>([]);

  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const search = async (query: string) => {
    if (!query || query.length < 3) {
      setPlaces([]);
      return;
    }

    abortController?.abort();

    const controller = new AbortController();
    setAbortController(controller);
    setLoading(true);

    try {
      const resp = await geocodingReq(query);
      if (resp) {

        setPlaces([
          ...resp.places.filter((mp: any) => mp.match === true),
          ...resp.outside_places,
        ]);

      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return { places, loading, search };
};
