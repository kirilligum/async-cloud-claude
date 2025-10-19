import { Daytona } from "@daytonaio/sdk";
import { getEnv } from "../utils/os.ts";

// Ensure DAYTONA_API_KEY is loaded from environment
export const daytona = new Daytona({ apiKey: getEnv("DAYTONA_API_KEY") });
