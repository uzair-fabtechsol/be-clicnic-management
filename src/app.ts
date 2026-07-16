import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
// import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { clean as xssClean } from "xss-clean/lib/xss";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import doctorRouter from "./routes/doctorRoutes";
import patientRouter from "./routes/patientRoutes";
import opdSlipRouter from "./routes/opdSlipRoutes";
import appointmentRouter from "./routes/appointmentRoutes";
import auditLogRouter from "./routes/auditLogRoutes";
import clinicInformationRouter from "./routes/clinicInformationRoutes";
import billingRouter from "./routes/billingRoutes";
import reportRouter from "./routes/reportRoutes";
import dashboardRouter from "./routes/dashboardRoutes";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";

// ─── Process-level Safety Nets ────────────────────────────────────────────────

process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// ─── App ──────────────────────────────────────────────────────────────────────

const app = express();

app.use(morgan("dev"));

// Allow requests from any origin while supporting credentials (cookies)
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => callback(null, origin ?? true),
  credentials: true,
};
app.use(cors(corsOptions));
app.options("/{*splat}", cors(corsOptions));

app.use(express.json({ limit: "10kb" }));

app.use(cookieParser());

// ─── Security Middleware ──────────────────────────────────────────────────────

// Data sanitization against NoSQL query injection
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.query) mongoSanitize.sanitize(req.query);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.headers) mongoSanitize.sanitize(req.headers);
  next();
});

// Data sanitization against XSS
app.use((req: Request, _res: Response, next: NextFunction) => {
  const sanitizeObject = (obj: unknown) => {
    if (!obj || typeof obj !== "object") return;
    for (const key in obj as Record<string, unknown>) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = (obj as Record<string, unknown>)[key];
        if (typeof value === "string") {
          (obj as Record<string, unknown>)[key] = xssClean(value);
        } else if (typeof value === "object") {
          sanitizeObject(value);
        }
      }
    }
  };

  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);
  sanitizeObject(req.headers);

  next();
});

// Prevent parameter pollution
app.use(hpp());

// Set security HTTP headers
app.use(helmet());

// const limiter = rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 10000,
//   message: "Too many requests from this IP, please try again after an hour",
// });
// app.use("/api", limiter);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({ message: "Welcome to be-clinic API" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/doctors", doctorRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/opd-slips", opdSlipRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/audit-logs", auditLogRouter);
app.use("/api/v1/clinic-information", clinicInformationRouter);
app.use("/api/v1/billings", billingRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// ─── Unhandled Routes ─────────────────────────────────────────────────────────

app.all(
  "/{*splat}",
  (req: Request, _res: Response, next: NextFunction): void => {
    next(
      new AppError(
        404,
        `Cannot find ${req.method} ${req.originalUrl} on this server`,
      ),
    );
  },
);

// ─── Global Error Handler (must be last) ─────────────────────────────────────

app.use(globalErrorHandler);

export default app;
