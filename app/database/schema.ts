import {
  pgTable,
  integer,
  text,
  varchar,
  timestamp,
  PgTable,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

// Make sure to import the constants when building the client.
export const CONSTANTS = {
  MAX_ADDRESS_LENGTH: 255,
  MAX_VENUE_NAME_LENGTH: 255,
  MAX_BATHROOM_TYPE_LENGTH: 20,
  MAX_WEATHER_LOCATION_NAME_LENGTH: 255,
  MAX_WEATHER_LOCATION_REGION_LENGTH: 255,
  MAX_WEATHER_LOCATION_COUNTRY_LENGTH: 255,
  MAX_WEATHER_CONDITION_LENGTH: 255,
  MAX_USERS_NAME_LENGTH: 255,
  MAX_USERS_EMAIL_LENGTH: 255,
  MAX_USERS_PASSWORD_LENGTH: 255,
  MAX_VENDORS_NAME_LENGTH: 255,
  MAX_VENDORS_TYPE_LENGTH: 255,
  MAX_FESTIVAL_NAME_LENGTH: 255,
  MAX_FESTIVAL_DESCRIPTION_LENGTH: 255,
  VALID_SECURITY_LEVELS: [1, 2, 3, 0] as const,
  VENDOR_TYPES: ["food", "drink", "merchandise", "other"] as const,
} as const;

/*
 * Tables for the application
 */

// Table for the festival event
export const festival: PgTable = pgTable("festival", {
  id: integer("id").primaryKey(),
  name: varchar("name", {
    length: CONSTANTS.MAX_FESTIVAL_NAME_LENGTH,
  }).notNull(),
  description: varchar("description", {
    length: CONSTANTS.MAX_FESTIVAL_DESCRIPTION_LENGTH,
  }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  // @ts-expect-error - Not sure how to parameterize the venue table as a generic type of the pgTable type
  venueId: integer("venue_id")
    .references(() => venue.id)
    .notNull(),
  // @ts-expect-error - Not sure how to parameterize the address table as a generic type of the pgTable type
  addressId: integer("address_id")
    .references(() => address.id)
    .notNull(),
  // @ts-expect-error - Not sure how to parameterize the weather table as a generic type of the pgTable type
  weatherId: integer("weather_id")
    .references(() => weather.id)
    .notNull(),
  // @ts-expect-error - Not sure how to parameterize the users table as a generic type of the pgTable type
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  artistsIds: jsonb("artists").array(),
});

// Table for the venue
export const venue: PgTable = pgTable("venue", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: CONSTANTS.MAX_VENUE_NAME_LENGTH }).notNull(),
  // @ts-expect-error - Not sure how to parameterize the address table as a generic type of the pgTable type
  addressId: integer("address_id")
    .references(() => address.id)
    .notNull(),
  capacity: integer("capacity").notNull(),
  // @ts-expect-error - Not sure how to parameterize the toilets table as a generic type of the pgTable type
  toiletsId: integer("toilets_id")
    .references(() => toilets.id)
    .notNull(),
  // @ts-expect-error - Not sure how to parameterize the medical tents table as a generic type of the pgTable type
  medicalTentsId: integer("medical_tents_id")
    .references(() => medicalTents.id)
    .notNull(),
  // @ts-expect-error - Not sure how to parameterize the camping areas table as a generic type of the pgTable type
  campingAreasId: integer("camping_areas_id")
    .references(() => campingAreas.id)
    .notNull(),
  security: integer("security").notNull(),
  isOutdoors: boolean("is_outdoors").notNull(),
});

// Table for the medical tents of the venue
export const medicalTents: PgTable = pgTable("medical_tents", {
  id: integer("id").primaryKey(),
  hasMedicalTent: boolean("has_medical_tent").notNull(),
  quantity: integer("quantity").notNull(),
});

// Table for the camping areas of the venue
export const campingAreas: PgTable = pgTable("camping_areas", {
  id: integer("id").primaryKey(),
  hasCampingArea: boolean("has_camping_area"),
  quantity: integer("quantity"),
});

// Table for the toilets of the venue
export const toilets: PgTable = pgTable("toilets", {
  id: integer("id").primaryKey(),
  hasToilet: boolean("has_toilet").notNull(),
  type: varchar("type", {
    length: CONSTANTS.MAX_BATHROOM_TYPE_LENGTH,
  }).notNull(),
});

// Table for the venue address
export const address: PgTable = pgTable("address", {
  id: integer("id").primaryKey(),
  street: varchar("street", { length: CONSTANTS.MAX_ADDRESS_LENGTH }).notNull(),
  city: varchar("city", { length: CONSTANTS.MAX_ADDRESS_LENGTH }).notNull(),
  state: varchar("state", { length: CONSTANTS.MAX_ADDRESS_LENGTH }).notNull(),
  zip: varchar("zip", { length: CONSTANTS.MAX_ADDRESS_LENGTH }).notNull(),
  region: varchar("region", { length: CONSTANTS.MAX_ADDRESS_LENGTH }).notNull(),
  country: varchar("country", {
    length: CONSTANTS.MAX_ADDRESS_LENGTH,
  }).notNull(),
});

// Table for the weather at the event
export const weather: PgTable = pgTable("weather", {
  id: integer("id").primaryKey(),
  // @ts-expect-error= Not sure how to parameterize the location table as a generic type of the pgTable type
  locationId: integer("location_id")
    .references(() => weatherResponseLocation.id)
    .notNull(),
  // @ts-expect-error= Not sure how to parameterize the forecast table as a generic type of the pgTable type
  forecastId: integer("forecast_id")
    .references(() => weatherResponseForecast.id)
    .notNull(),
});

// Table for the location of the weather response
export const weatherResponseLocation: PgTable = pgTable(
  "weather_response_location",
  {
    id: integer("id").primaryKey(),
    name: varchar("name", {
      length: CONSTANTS.MAX_WEATHER_LOCATION_NAME_LENGTH,
    }).notNull(),
    region: varchar("region", {
      length: CONSTANTS.MAX_WEATHER_LOCATION_REGION_LENGTH,
    }).notNull(),
    country: varchar("country", {
      length: CONSTANTS.MAX_WEATHER_LOCATION_COUNTRY_LENGTH,
    }).notNull(),
    latitude: integer("latitude").notNull(),
    longitude: integer("longitude").notNull(),
    localTime: timestamp("local_time").notNull(),
  },
);

// Table for the forecast of the weather
export const weatherResponseForecast: PgTable = pgTable(
  "weather_response_forecast",
  {
    id: integer("id").primaryKey(),
    date: timestamp("date").notNull(),
    avgTemp: integer("avg_temp").notNull(),
    avgWind: integer("avg_wind").notNull(),
    precipitationInches: integer("precipitation_inches").notNull(),
    avgHumidity: integer("avg_humidity").notNull(),
    condition: jsonb("condition").notNull(),
    willItRain: boolean("will_it_rain").notNull(),
    willItSnow: boolean("will_it_snow").notNull(),
  },
);

// Table for the temperature at the event
export const temperature: PgTable = pgTable("temperature", {
  id: integer("id").primaryKey(),
  celsius: integer("celsius"),
  fahrenheit: integer("fahrenheit"),
});

// Table for the wind of the weather
export const wind: PgTable = pgTable("wind", {
  id: integer("id").primaryKey(),
  kilometerPerHour: integer("kph"),
  milesPerHour: integer("mph"),
});

// Table for the vendors that are going to be in the event.
export const vendors: PgTable = pgTable("vendors", {
  id: integer("id").primaryKey(),
  name: varchar("name", {
    length: CONSTANTS.MAX_VENDORS_NAME_LENGTH,
  }).notNull(),
  type: varchar("type", {
    length: CONSTANTS.MAX_VENDORS_TYPE_LENGTH,
  }).notNull(),
});

// Table for the users of the application
export const users: PgTable = pgTable("users", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: CONSTANTS.MAX_USERS_NAME_LENGTH }).notNull(),
  email: varchar("email", {
    length: CONSTANTS.MAX_USERS_EMAIL_LENGTH,
  }).notNull(),
  password: varchar("password", {
    length: CONSTANTS.MAX_USERS_PASSWORD_LENGTH,
  }).notNull(), // Stores the encrypted password so it should be a considerable length.
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  festivalsIDs: text("festivals_ids").array(),
});
