import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";
import 'dotenv/config';

export const env = createEnv({
  server: {
    // Azure OpenAI API
    AZURE_OPENAI_API_KEY: z.string().min(1, "AZURE_OPENAI_API_KEY is required"),
    AZURE_OPENAI_API_INSTANCE_NAME: z.string().min(1, "AZURE_OPENAI_API_INSTANCE_NAME is required"),
    AZURE_OPENAI_DEPLOYMENT_NAME: z.string().min(1, "AZURE_OPENAI_DEPLOYMENT_NAME is required"),
    ASSISTANT_ID: z.string().min(1, "ASSISTANT_ID is required"),
    ML_ENDPOINT: z.string().min(1, "ML_ENDPOINT is required"),
    ML_ENDPOINT_API_KEY: z.string().min(1, "ML_ENDPOINT_API_KEY is required"),
  },
  client: {},
  experimental__runtimeEnv: {},
  extends: [vercel()],
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
