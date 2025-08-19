CREATE TYPE "public"."semester_type" AS ENUM('first', 'second');--> statement-breakpoint
ALTER TABLE "semesters" ADD COLUMN "type" "semester_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "semesters" DROP COLUMN "title";