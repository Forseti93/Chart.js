import axios from "axios";
import { useQuery } from "react-query";

export function usePlanets() {
    return useQuery("planets", async () => {
      const { data } = await axios.get(
        "https://swapi.dev/api/planets/"
      );
      return data;
    });
  }