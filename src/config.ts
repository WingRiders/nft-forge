import { z } from "zod";
import { IpfsProvider } from "./ipfs/provider";
import { MockedIpfsProvider } from "./ipfs/mockedProvider";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  // if IPFS_* variables are not provided, the server will use the mocked IPFS provider
  IPFS_PROTOCOL: z.string().optional(),
  IPFS_HOST: z.string().optional(),
  IPFS_PORT: z.string().optional().transform(Number),
  IPFS_AUTH: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val) return undefined;
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

export const ipfsProvider =
  config.IPFS_PROTOCOL &&
  config.IPFS_HOST &&
  config.IPFS_PORT &&
  config.IPFS_AUTH
    ? new IpfsProvider({
        connection: {
          protocol: config.IPFS_PROTOCOL,
          host: config.IPFS_HOST,
          port: config.IPFS_PORT,
          auth: config.IPFS_AUTH,
        },
      })
    : new MockedIpfsProvider();
