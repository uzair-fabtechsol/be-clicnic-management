import dotenv from "dotenv";

dotenv.config();

const config = {
  mongodb: {
    url: process.env.DB_CONNECTION_STRING as string,
    options: {
      family: 4,
    },
  },

  migrationsDir: "migrations",
  changelogCollectionName: "migrations",
  migrationFileExtension: ".ts",
  useFileHash: false,
  moduleSystem: "commonjs",
};

module.exports = config;
