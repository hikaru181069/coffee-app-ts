CREATE TYPE "public"."place" AS ENUM('home', 'cafe');--> statement-breakpoint
CREATE TABLE "flavors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	CONSTRAINT "flavors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "origins" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "origins_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "processes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "processes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "record_flavors" (
	"record_id" integer NOT NULL,
	"flavor_id" integer NOT NULL,
	CONSTRAINT "record_flavors_record_id_flavor_id_pk" PRIMARY KEY("record_id","flavor_id")
);
--> statement-breakpoint
CREATE TABLE "record_varieties" (
	"record_id" integer NOT NULL,
	"variety_id" integer NOT NULL,
	CONSTRAINT "record_varieties_record_id_variety_id_pk" PRIMARY KEY("record_id","variety_id")
);
--> statement-breakpoint
CREATE TABLE "records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"drank_on" date NOT NULL,
	"place" "place" NOT NULL,
	"rating" integer,
	"notes" text,
	"cafe_name" text,
	"roaster_name" text,
	"origin_id" integer,
	"farm_name" text,
	"process_id" integer,
	"roast_level_id" integer,
	"coffee_grams" real,
	"water_ml" integer,
	"brew_seconds" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rating_range" CHECK ("records"."rating" between 1 and 10)
);
--> statement-breakpoint
CREATE TABLE "roast_levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "roast_levels_name_unique" UNIQUE("name"),
	CONSTRAINT "roast_levels_sortOrder_unique" UNIQUE("sort_order")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expire_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "varieties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "varieties_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "record_flavors" ADD CONSTRAINT "record_flavors_record_id_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "record_flavors" ADD CONSTRAINT "record_flavors_flavor_id_flavors_id_fk" FOREIGN KEY ("flavor_id") REFERENCES "public"."flavors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "record_varieties" ADD CONSTRAINT "record_varieties_record_id_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "record_varieties" ADD CONSTRAINT "record_varieties_variety_id_varieties_id_fk" FOREIGN KEY ("variety_id") REFERENCES "public"."varieties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_origin_id_origins_id_fk" FOREIGN KEY ("origin_id") REFERENCES "public"."origins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_process_id_processes_id_fk" FOREIGN KEY ("process_id") REFERENCES "public"."processes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_roast_level_id_roast_levels_id_fk" FOREIGN KEY ("roast_level_id") REFERENCES "public"."roast_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;