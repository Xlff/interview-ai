function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return normalizeEnvValue(value);
}

function normalizeEnvValue(value: string) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function encodeUserInfo(value: string) {
  return value.replace(/[^A-Za-z0-9._~%-]/g, function encode(char) {
    return encodeURIComponent(char);
  });
}

function normalizeDatabaseUrl(value: string) {
  const normalized = normalizeEnvValue(value);

  if (isValidUrl(normalized)) {
    return normalized;
  }

  const schemeSeparator = normalized.indexOf("://");

  if (schemeSeparator === -1) {
    return normalized;
  }

  const scheme = normalized.slice(0, schemeSeparator + 3);
  const remainder = normalized.slice(schemeSeparator + 3);
  const atIndex = remainder.lastIndexOf("@");

  if (atIndex === -1) {
    return normalized;
  }

  const userInfo = remainder.slice(0, atIndex);
  const afterAuthority = remainder.slice(atIndex + 1);
  const colonIndex = userInfo.indexOf(":");

  if (colonIndex === -1) {
    const sanitized = `${scheme}${encodeUserInfo(userInfo)}@${afterAuthority}`;
    return isValidUrl(sanitized) ? sanitized : normalized;
  }

  const username = userInfo.slice(0, colonIndex);
  const password = userInfo.slice(colonIndex + 1);
  const sanitized = `${scheme}${encodeUserInfo(username)}:${encodeUserInfo(password)}@${afterAuthority}`;

  return isValidUrl(sanitized) ? sanitized : normalized;
}

export const env = {
  nodeEnv() {
    return process.env.NODE_ENV ?? "development";
  },
  databaseUrl() {
    return normalizeDatabaseUrl(requireEnv("DATABASE_URL"));
  },
  supabaseUrl() {
    return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  },
  supabaseAnonKey() {
    return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  supabaseServiceRoleKey() {
    return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
};
