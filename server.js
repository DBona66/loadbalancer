const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Redis = require("ioredis");

const app = express();
const port = 5000;

var os = require("os");
var ip = require("ip");
var networkInterfaces = os.networkInterfaces();

console.log(ip.address());

var redis_ip = process.argv[2];

if (typeof redis_ip === "undefined") {
  redis_ip = "localhost";
}

console.log(redis_ip);

// Configure Redis client
const redis = new Redis({
  host: `${redis_ip}`,
  port: 6379,
});

redis.on("error", (err) => {
  console.error("Error connecting to Redis", err);
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.post("/api/data", async (req, res) => {
  const { name, email } = req.body;
  const id = Date.now().toString();

  try {
    await redis.hset(id, "name", name, "email", email, "ip", ip.address());
    res.send("OK");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const keys = await redis.keys("*");
    if (keys.length === 0) {
      return res.send([]);
    }

    const multi = redis.multi();
    keys.forEach((key) => {
      multi.hgetall(key);
    });

    const replies = await multi.exec();

    const data = keys.map((key, index) => ({
      id: key,
      ...replies[index][1], // Access the actual result from the multi response
    }));

    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
