export type Country = {
  code: string;
  name: string;
  currency: string;
  flag: string;
  region: string;
};

export const AVAILABLE_COUNTRIES: Country[] = [
  { code: "TR", name: "Turkey", currency: "TRY", flag: "🇹🇷", region: "Europe" },
  { code: "JP", name: "Japan", currency: "JPY", flag: "🇯🇵", region: "Asia" },
  {
    code: "US",
    name: "United States",
    currency: "USD",
    flag: "🇺🇸",
    region: "Americas",
  },
  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    flag: "🇬🇧",
    region: "Europe",
  },
  {
    code: "EU",
    name: "European Union",
    currency: "EUR",
    flag: "🇪🇺",
    region: "Europe",
  },
  {
    code: "KR",
    name: "South Korea",
    currency: "KRW",
    flag: "🇰🇷",
    region: "Asia",
  },
  { code: "CN", name: "China", currency: "CNY", flag: "🇨🇳", region: "Asia" },
  {
    code: "SG",
    name: "Singapore",
    currency: "SGD",
    flag: "🇸🇬",
    region: "Asia",
  },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    flag: "🇦🇺",
    region: "Oceania",
  },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    flag: "🇨🇦",
    region: "Americas",
  },
  {
    code: "CH",
    name: "Switzerland",
    currency: "CHF",
    flag: "🇨🇭",
    region: "Europe",
  },
  {
    code: "HK",
    name: "Hong Kong",
    currency: "HKD",
    flag: "🇭🇰",
    region: "Asia",
  },
];

export const groupedCountries = AVAILABLE_COUNTRIES.reduce((acc, country) => {
  if (!acc[country.region]) {
    acc[country.region] = [];
  }
  acc[country.region].push(country);
  return acc;
}, {} as Record<string, Country[]>);
