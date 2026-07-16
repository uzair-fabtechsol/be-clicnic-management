import { connectDB } from "./config/db";
import app from "./app";

connectDB();

export default app;
