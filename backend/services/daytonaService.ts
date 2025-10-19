import { Daytona } from "@daytonaio/sdk";

// Daytona client using environment variables
export const daytona = new Daytona({
  apiKey: process.env.DAYTONA_API_KEY || "",
  apiUrl: process.env.DAYTONA_API_URL,
});
