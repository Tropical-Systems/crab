const wipeShifts = require("../Functions/wipeShifts");
const chalk = require("chalk");
require("dotenv").config();
const {
  sendHeartbeat,
  startStayAliveDb,
  getTropicalDb,
} = require("../Functions/StartUp-Functions");
const config = require('../../config.json')
module.exports = {
  event: "ready",
  once: true,
  execute: async (client) => {
    const BOT_STATUS_URL = process.env.BOT_STATUS_URL;

    if (config.enviroment) {
      sendHeartbeat(BOT_STATUS_URL, "Crab");
      setInterval(() => sendHeartbeat(BOT_STATUS_URL, "Crab"), 5 * 60 * 1000);
    }
    try {
      await startStayAliveDb();
      console.log(chalk.green(`[SYSTEM] 🦀 Logged in as ${client.user.username}`));
      wipeShifts();
    } catch (error) {
      console.error(chalk.red("[SYSTEM] ❌ Startup error:", error));
      process.exit(1);
    }
  },
};
