import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";
import 'dotenv/config';

export const env = createEnv({
  server: {
    // Azure OpenAI API
    DUNGEON_MASTER_ML_ENDPOINT: z.string().min(1, "ML_ENDPOINT is required"),
    DUNGEON_MASTER_ML_ENDPOINT_API_KEY: z.string().min(1, "ML_ENDPOINT_API_KEY is required"),
  },
  client: {},
  experimental__runtimeEnv: {},
  extends: [vercel()],
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
