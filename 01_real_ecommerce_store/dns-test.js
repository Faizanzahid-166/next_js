const dns = require("node:dns");
const dnsPromises = dns.promises;

(async () => {
  console.log("Default DNS Servers:", dns.getServers());

  console.log("\n--- Testing default resolution ---");
  try {
    const records = await dnsPromises.resolveSrv("_mongodb._tcp.cluster0.m867nij.mongodb.net");
    console.log("Success with default:", records);
  } catch (err) {
    console.error("Failed with default:", err.message || err);
  }

  console.log("\n--- Testing with 1.1.1.1 ---");
  try {
    dns.setServers(["1.1.1.1"]);
    const records = await dnsPromises.resolveSrv("_mongodb._tcp.cluster0.m867nij.mongodb.net");
    console.log("Success with 1.1.1.1:", records);
  } catch (err) {
    console.error("Failed with 1.1.1.1:", err.message || err);
  }

  console.log("\n--- Testing with 8.8.8.8 ---");
  try {
    dns.setServers(["8.8.8.8"]);
    const records = await dnsPromises.resolveSrv("_mongodb._tcp.cluster0.m867nij.mongodb.net");
    console.log("Success with 8.8.8.8:", records);
  } catch (err) {
    console.error("Failed with 8.8.8.8:", err.message || err);
  }
})();