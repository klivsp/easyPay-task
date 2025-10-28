import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface FixerResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface Currency {
  code: string;
}

export const currencyApi = createApi({
  reducerPath: "currencyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://data.fixer.io/api/",
  }),
  endpoints: (builder) => ({
    getCurrencies: builder.query<Currency[], void>({
      query: () =>
        "latest?access_key=1e289d3ee1a76272c8216229d64440db&format=1",
      transformResponse: (response: FixerResponse): Currency[] => {
        return Object.keys(response.rates)
          .map((code) => ({
            code,
          }))
          .sort((a, b) => a.code.localeCompare(b.code));
      },
    }),

    getLiveRates: builder.query<Record<string, number>, void>({
      query: () =>
        "latest?access_key=1e289d3ee1a76272c8216229d64440db&format=1",
      transformResponse: (response: FixerResponse) => response.rates,
    }),
  }),
});

export const { useGetCurrenciesQuery, useGetLiveRatesQuery } = currencyApi;
