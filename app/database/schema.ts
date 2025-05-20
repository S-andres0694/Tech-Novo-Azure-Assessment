import { relations } from "drizzle-orm";
import {
    pgTable,
    integer,
    varchar,
    timestamp,
    boolean,
    jsonb,
    primaryKey,
} from "drizzle-orm/pg-core";
import type { Artist } from "~/types/festivalTypes";

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
    TOILET_TYPES: [] as const,
} as const;

/*
 * Tables for the application
 */

// Table for the festival event
export const festival = pgTable("festival", {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: CONSTANTS.MAX_FESTIVAL_NAME_LENGTH }).notNull(),
    description: varchar("description", { length: CONSTANTS.MAX_FESTIVAL_DESCRIPTION_LENGTH }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    venueId: integer("venue_id").references(() => venue.id).notNull(),
    addressId: integer("address_id").references(() => address.id).notNull(),
    weatherId: integer("weather_id").references(() => weather.id).notNull(),
    userId: integer("user_id").references(() => users.id).notNull(),
    artists: jsonb("artists_data").$type<Artist[]>().default([]).array(), // Renamed for clarity, stores array of Artist objects
});

// Table for the venue
export const venue = pgTable("venue", {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: CONSTANTS.MAX_VENUE_NAME_LENGTH }).notNull(),
    addressId: integer("address_id").references(() => address.id).notNull(),
    capacity: integer("capacity").notNull(),
    medicalTents: jsonb("medical_tents"),
    campingAreas: jsonb("camping_areas"),
    toilets: jsonb("toilets"),
    security: integer("security").notNull(),
    isOutdoors: boolean("is_outdoors").notNull(),
});

export const festivalToVendors = relations(festival, ({ many }) => ({
    vendors: many(vendors),
}));

// Table for the venue address
export const address = pgTable("address", {
    id: integer("id").primaryKey(),
    street: varchar("street", { length: CONSTANTS.MAX_ADDRESS_LENGTH }).notNull(),
    city: varchar("city", { length: CONSTANTS.MAX_ADDRESS_LENGTH }).notNull(),
    state: varchar("state", { length: CONSTANTS.MAX_ADDRESS_LENGTH }).notNull(),
    zip: varchar("zip", { length: CONSTANTS.MAX_ADDRESS_LENGTH }).notNull(),
    region: varchar("region", { length: CONSTANTS.MAX_ADDRESS_LENGTH }).notNull(),
    country: varchar("country", { length: CONSTANTS.MAX_ADDRESS_LENGTH }).notNull(),
});

// Table for the weather at the event
export const weather = pgTable("weather", {
    id: integer("id").primaryKey(),
    locationId: integer("location_id").references(() => weatherResponseLocation.id).notNull(),
    forecastId: integer("forecast_id").references(() => weatherResponseForecast.id).notNull(),
});

// Table for the location of the weather response
export const weatherResponseLocation = pgTable("weather_response_location", {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: CONSTANTS.MAX_WEATHER_LOCATION_NAME_LENGTH }).notNull(),
    region: varchar("region", { length: CONSTANTS.MAX_WEATHER_LOCATION_REGION_LENGTH }).notNull(),
    country: varchar("country", { length: CONSTANTS.MAX_WEATHER_LOCATION_COUNTRY_LENGTH }).notNull(),
    latitude: integer("latitude").notNull(),
    longitude: integer("longitude").notNull(),
    localTime: timestamp("local_time").notNull(),
});

// Table for the forecast of the weather
export const weatherResponseForecast = pgTable("weather_response_forecast", {
    id: integer("id").primaryKey(),
    date: timestamp("date").notNull(),
    avgTemp: integer("avg_temp").notNull(),
    avgWind: integer("avg_wind").notNull(),
    precipitationInches: integer("precipitation_inches").notNull(),
    avgHumidity: integer("avg_humidity").notNull(),
    condition: jsonb("condition").notNull(),
    willItRain: boolean("will_it_rain").notNull(),
    willItSnow: boolean("will_it_snow").notNull(),
});

// Table for the temperature at the event
export const temperature = pgTable("temperature", {
    id: integer("id").primaryKey(),
    celsius: integer("celsius"),
    fahrenheit: integer("fahrenheit"),
});

// Table for the wind of the weather
export const wind = pgTable("wind", {
    id: integer("id").primaryKey(),
    kilometerPerHour: integer("kph"),
    milesPerHour: integer("mph"),
})

// Table for the vendors that are going to be in the event.
export const vendors = pgTable("vendors", {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: CONSTANTS.MAX_VENDORS_NAME_LENGTH }).notNull(),
    type: varchar("type", { length: CONSTANTS.MAX_VENDORS_TYPE_LENGTH }).notNull(),
});

// Table for the users of the application
export const users = pgTable("users", {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: CONSTANTS.MAX_USERS_NAME_LENGTH }).notNull(),
    email: varchar("email", { length: CONSTANTS.MAX_USERS_EMAIL_LENGTH }).notNull(),
    password: varchar("password", { length: CONSTANTS.MAX_USERS_PASSWORD_LENGTH }).notNull(), // Stores the encrypted password so it should be a considerable length.
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const usersToFestivals = pgTable('users_to_festivals', {
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    festivalId: integer('festival_id').notNull().references(() => festival.id, { onDelete: 'cascade' }),
}, (t) => ([
    primaryKey({ columns: [t.userId, t.festivalId] }),
]));

export const usersRelations = relations(users, ({ many }) => ({
    festivals: many(usersToFestivals),
}));

export const festivalRelations = relations(festival, ({ one }) => ({
    venue: one(venue, { fields: [festival.venueId], references: [venue.id] }),
    address: one(address, { fields: [festival.addressId], references: [address.id] }),
    weather: one(weather, { fields: [festival.weatherId], references: [weather.id] }),
    organizer: one(users, { fields: [festival.userId], references: [users.id] }),
}));