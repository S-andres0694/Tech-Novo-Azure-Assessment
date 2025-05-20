import type { InferSelectModel } from "drizzle-orm";
import type {
  address,
  festival,
  temperature,
  toilets,
  vendors,
  venue,
  weather,
  wind,
} from "~/database/schema";

// The type describing the festival configuration based on the spec
export type Festival = InferSelectModel<typeof festival>;

// The type describing the venue configuration
export type Venue = InferSelectModel<typeof venue>;

// Bathrooms in the venue.
export type Toilet = InferSelectModel<typeof toilets>;

// Address of the venue
export type Address = InferSelectModel<typeof address>;

// Weather configuration
export type Weather = InferSelectModel<typeof weather>;

// Temperature based in Celsius to then be converted to Fahrenheit
export type Temperature = InferSelectModel<typeof temperature>;

// Determines the wind for the weather conditions
export type Wind = InferSelectModel<typeof wind>;

// Summary of the weather conditions to employ on the client.
export type WeatherCondition = {
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
export type WeatherRequestParameterLocation = {
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
export type Vendor = InferSelectModel<typeof vendors>;

// Artist for the festival
export type Artist = {
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
