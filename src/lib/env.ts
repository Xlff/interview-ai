function readEnv(name: string) {
  return process.env[name];
}

export const env = {
  nodeEnv: readEnv("NODE_ENV") ?? "development",
};
