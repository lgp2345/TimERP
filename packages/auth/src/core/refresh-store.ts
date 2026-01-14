import { createHash, randomBytes } from "node:crypto";
import type { RedisLike } from "./types";

type RefreshRecord = {
  userId: string;
  companyId: string;
  familyId: string;
};

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function refreshKey(token: string): string {
  return `rt:${sha256(token)}`;
}

function familyKey(
  companyId: string,
  userId: string,
  familyId: string
): string {
  return `rtf:${companyId}:${userId}:${familyId}`;
}

export function generateRefreshToken(): string {
  return randomBytes(32).toString("base64url");
}

export type RefreshTokenStore = {
  issue: (args: {
    userId: string;
    companyId: string;
  }) => Promise<{ token: string; familyId: string }>;
  rotate: (args: {
    token: string;
    companyId: string;
  }) => Promise<{ token: string; userId: string; familyId: string } | null>;
  revoke: (args: { token: string }) => Promise<void>;
};

export function createRedisRefreshTokenStore(
  redis: RedisLike,
  ttlSeconds: number
): RefreshTokenStore {
  return {
    async issue(args) {
      const token = generateRefreshToken();
      const familyId = randomBytes(16).toString("hex");
      const record: RefreshRecord = {
        userId: args.userId,
        companyId: args.companyId,
        familyId,
      };

      const rKey = refreshKey(token);
      const fKey = familyKey(args.companyId, args.userId, familyId);

      await redis.set(rKey, JSON.stringify(record), "EX", String(ttlSeconds));
      await redis.set(fKey, rKey, "EX", String(ttlSeconds));
      return { token, familyId };
    },

    async rotate(args) {
      const oldKey = refreshKey(args.token);
      const raw = await redis.get(oldKey);
      if (!raw) return null;

      let record: RefreshRecord;
      try {
        record = JSON.parse(raw) as RefreshRecord;
      } catch {
        return null;
      }

      if (record.companyId !== args.companyId) return null;

      const newToken = generateRefreshToken();
      const newKey = refreshKey(newToken);
      const newRecord: RefreshRecord = record;
      const fKey = familyKey(record.companyId, record.userId, record.familyId);

      await redis.del(oldKey);
      await redis.set(
        newKey,
        JSON.stringify(newRecord),
        "EX",
        String(ttlSeconds)
      );
      await redis.set(fKey, newKey, "EX", String(ttlSeconds));

      return {
        token: newToken,
        userId: record.userId,
        familyId: record.familyId,
      };
    },

    async revoke(args) {
      await redis.del(refreshKey(args.token));
    },
  };
}
