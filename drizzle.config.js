import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./configs/schema.js", // Correct path to the schema file
  out: "./drizzle", // Output folder for generated migrations
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_p0dKyEMz5eDr@ep-old-bush-a4b799qh.us-east-1.aws.neon.tech/AI-Form-Builder?sslmode=require",
  },
});
