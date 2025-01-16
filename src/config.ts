import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  IPFS_PROTOCOL: z.string(),
  IPFS_HOST: z.string(),
  IPFS_PORT: z.string().transform(Number),
  IPFS_AUTH: z.string().transform((val, ctx) => {
    const [username, password] = val.split(":");
    if (!username || !password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "IPFS_AUTH should be in the format username:password",
      });
      return z.NEVER;
    }
    return { username, password };
  }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Environment variables validation failed",
    parsedEnv.error.format()
  );
  process.exit(1);
}

export const config = parsedEnv.data;
