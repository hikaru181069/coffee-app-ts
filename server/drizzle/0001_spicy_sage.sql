ALTER TABLE "flavors" ADD COLUMN "name_en" text NOT NULL;--> statement-breakpoint
ALTER TABLE "flavors" ADD COLUMN "category_en" text NOT NULL;--> statement-breakpoint
ALTER TABLE "origins" ADD COLUMN "name_en" text NOT NULL;--> statement-breakpoint
ALTER TABLE "processes" ADD COLUMN "name_en" text NOT NULL;--> statement-breakpoint
ALTER TABLE "roast_levels" ADD COLUMN "name_en" text NOT NULL;--> statement-breakpoint
ALTER TABLE "varieties" ADD COLUMN "name_en" text NOT NULL;--> statement-breakpoint
ALTER TABLE "flavors" ADD CONSTRAINT "flavors_nameEn_unique" UNIQUE("name_en");--> statement-breakpoint
ALTER TABLE "origins" ADD CONSTRAINT "origins_nameEn_unique" UNIQUE("name_en");--> statement-breakpoint
ALTER TABLE "processes" ADD CONSTRAINT "processes_nameEn_unique" UNIQUE("name_en");--> statement-breakpoint
ALTER TABLE "roast_levels" ADD CONSTRAINT "roast_levels_nameEn_unique" UNIQUE("name_en");--> statement-breakpoint
ALTER TABLE "varieties" ADD CONSTRAINT "varieties_nameEn_unique" UNIQUE("name_en");