import { connectDB } from "@src/config/db";
import app from "@src/app";
import { env } from "@src/config/env";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();
