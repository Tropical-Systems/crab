const mongoose = require("mongoose");
const axios = require("axios");
const chalk = require("chalk");
require("dotenv").config();
const PING_INTERVAL = 5 * 60 * 1000;
const config = require("../../config.json");

if (!process.env.DB_HEARTBEAT_URL) {
  throw new Error("DB_HEARTBEAT_URL is not defined in the config file.");
}

const DB_HEARTBEAT_URL = process.env.DB_HEARTBEAT_URL;

async function sendHeartbeat(url, type) {
  if (config.enviroment === "production") {
    try {
      await axios.get(url);
      console.log(
        chalk.green(`[HEARTBEAT] Successfully pinged BetterStack (${type})`)
      );
    } catch (error) {
      console.error(
        chalk.red(`[HEARTBEAT] Failed to ping BetterStack (${type}):`, error)
      );
    }
  }
}

async function startStayAliveDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MongoDB URI is not defined in the config file.");
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    if (config.enviroment === "production") {
      await sendHeartbeat(DB_HEARTBEAT_URL, "Database");
      setInterval(
        () => sendHeartbeat(DB_HEARTBEAT_URL, "Database"),
        PING_INTERVAL
      );
    }
    console.log(chalk.green("[SYSTEM] 🌺 Connected to Crab Database successfully."));
  } catch (err) {
    console.error(chalk.red("[SYSTEM] Failed to connect to MongoDB", err));
    process.exit(1);
  }
}

module.exports = { startStayAliveDb, sendHeartbeat };
