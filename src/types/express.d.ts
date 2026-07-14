declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: "admin" | "receptionist";
        permissions: { resource: string; actions: string[] }[];
      };
      validatedQuery?: unknown;
    }
  }
}

export {};
