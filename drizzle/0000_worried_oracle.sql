CREATE TABLE "address" (
	"id" integer PRIMARY KEY NOT NULL,
	"street" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"state" varchar(255) NOT NULL,
	"zip" varchar(255) NOT NULL,
	"region" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "festival" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"venue_id" integer NOT NULL,
	"address_id" integer NOT NULL,
	"weather_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"artists_data" jsonb[]
);
--> statement-breakpoint
CREATE TABLE "temperature" (
	"id" integer PRIMARY KEY NOT NULL,
	"celsius" integer,
	"fahrenheit" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_to_festivals" (
	"user_id" integer NOT NULL,
	"festival_id" integer NOT NULL,
	CONSTRAINT "users_to_festivals_user_id_festival_id_pk" PRIMARY KEY("user_id","festival_id")
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "venue" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address_id" integer NOT NULL,
	"capacity" integer NOT NULL,
	"medical_tents" jsonb,
	"camping_areas" jsonb,
	"toilets" jsonb,
	"security" integer NOT NULL,
	"is_outdoors" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weather" (
	"id" integer PRIMARY KEY NOT NULL,
	"location_id" integer NOT NULL,
	"forecast_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weather_response_forecast" (
	"id" integer PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"avg_temp" integer NOT NULL,
	"avg_wind" integer NOT NULL,
	"precipitation_inches" integer NOT NULL,
	"avg_humidity" integer NOT NULL,
	"condition" jsonb NOT NULL,
	"will_it_rain" boolean NOT NULL,
	"will_it_snow" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weather_response_location" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"region" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"latitude" integer NOT NULL,
	"longitude" integer NOT NULL,
	"local_time" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wind" (
	"id" integer PRIMARY KEY NOT NULL,
	"kph" integer,
	"mph" integer
);
--> statement-breakpoint
ALTER TABLE "festival" ADD CONSTRAINT "festival_venue_id_venue_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venue"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "festival" ADD CONSTRAINT "festival_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "festival" ADD CONSTRAINT "festival_weather_id_weather_id_fk" FOREIGN KEY ("weather_id") REFERENCES "public"."weather"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "festival" ADD CONSTRAINT "festival_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_festivals" ADD CONSTRAINT "users_to_festivals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_festivals" ADD CONSTRAINT "users_to_festivals_festival_id_festival_id_fk" FOREIGN KEY ("festival_id") REFERENCES "public"."festival"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venue" ADD CONSTRAINT "venue_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weather" ADD CONSTRAINT "weather_location_id_weather_response_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."weather_response_location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weather" ADD CONSTRAINT "weather_forecast_id_weather_response_forecast_id_fk" FOREIGN KEY ("forecast_id") REFERENCES "public"."weather_response_forecast"("id") ON DELETE no action ON UPDATE no action;