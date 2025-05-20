// The type describing the festival configuration based on the spec
export type Festival = {
  name: string;
  startDate: Date;
  endDate: Date;
  venue: Venue;
  address: Address;
  weather: Weather;
  artists: Artist[];
};

// The type describing the venue configuration
type Venue = {
  name: string;
  address: Address;
  capacity: number;
  toilets: Toilet[];
  medicalTents: {
    hasMedicalTent: boolean;
    quantity: number | null;
  };
  campingAreas: {
    hasCampingArea: boolean;
    quantity: number | null;
  };
  security: 1 | 2 | 3 | null; // Security level of the venue in a scale of 1-3
  isOutdoors: boolean;
  vendors: Vendor[];
};

// Bathrooms in the venue.
type Toilet = {
  hasToilet: boolean;
  type: "porta-potty" | "flush-toilet" | "dedicated-bathroom" | null;
};

// Address of the venue
type Address = {
  street: string;
  city: string;
  state: string;
  zip: string | number;
  region: string;
  country: string;
};

// Weather configuration
type Weather = {
  location: {
    name: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
    localTime: string;
  };
  forecast: {
    date: Date;
    avgTemp: Temperature;
    avgWind: Wind;
    precipitationInches: number;
    avgHumidity: number;
    condition: WeatherCondition;
    willItRain: number;
    willItSnow: number;
  };
};

// Temperature based in Celsius to then be converted to Fahrenheit
type Temperature = {
  celsius: number;
  fahrenheit: number;
};

// Determines the wind for the weather conditions
type Wind = {
  kilometerPerHour: number;
  milesPerHour: number;
};

// Summary of the weather conditions to employ on the client.
type WeatherCondition = {
  description: string;
  icon: URL;
};

// Base interface for weather requests through the https://www.weatherapi.com/ API
export interface WeatherRequest {
  location: WeatherRequestParameterLocation;
  apiKey: string;
}

// Parameters for the weather request in the future (> 14 days)
export interface FutureWeatherRequest extends WeatherRequest {
  date?: Date;
}

// Parameters for the weather request in the past (< 14 days)
export interface DefaultWeatherRequest extends WeatherRequest {
  days: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14; // Based on API documentation
  hour?: number;
}

// Identifier for the location of the weather requests
type WeatherRequestParameterLocation = {
  usZipCode?: string;
  ukZipCode?: string;
  canadaPostalCode?: string;
  cityName?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

// Vendors for the festival
type Vendor = {
  name: string;
  type: "food" | "drink" | "merchandise" | "other";
};

// Artist for the festival
type Artist = {
  name: string;
  id: string;
  genres: string[];
  popularity: number; // 0-100 popularity score
  followers: number;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  external_urls: {
    spotify: string; // Link to artist page on Spotify
  };
};
