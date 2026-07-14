const RESOURCES = [
  "patients",
  "appointments",
  "opdSlips",
  "billing",
  "doctors",
  "users",
  "settings",
  "reports",
  "auditLogs",
] as const;

const ACTIONS = ["view", "create", "edit", "delete"] as const;

export { RESOURCES, ACTIONS };
