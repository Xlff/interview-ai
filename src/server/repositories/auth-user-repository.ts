import { db } from "@/lib/db";

type LocalUserRecord = {
  id: string;
  email: string;
};

export async function findLocalUserByEmail(email: string): Promise<LocalUserRecord | null> {
  return db.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });
}

export async function getOrCreateLocalUserByEmail(email: string): Promise<LocalUserRecord> {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findLocalUserByEmail(normalizedEmail);

  if (existing) {
    return existing;
  }

  return db.user.create({
    data: {
      email: normalizedEmail,
    },
  });
}
