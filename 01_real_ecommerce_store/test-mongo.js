require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const dns = require("dns");

(async () => {
  try {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    console.log("DNS servers set to: 1.1.1.1, 8.8.8.8");

    console.log(process.env.MONGO_URI.replace(/\/\/(.*?):(.*?)@/, "//***:***@"));

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();