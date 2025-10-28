import { useGetLiveRatesQuery } from "@/redux/services/api";

export function useCurrencyConverter() {
  const { data: rates, isLoading } = useGetLiveRatesQuery();

  function convertToEuro(value: number, code: string) {
    if (!rates || !rates[code] || code === "EUR") return value;
    return value / rates[code];
  }

  return { convertToEuro, isLoading };
}
