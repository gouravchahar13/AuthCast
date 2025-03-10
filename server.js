import express from "express";
import PocketBase from "pocketbase";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

dotenv.config({path: './.env'});

const app = express();
const port = process.env.PORT;
const pb = new PocketBase(process.env.POCKETBASE_URL);

app.use(express.json());

(async () => {
    try {
        await pb.admins.authWithPassword('gouravchahar130405@gmail.com', 'password123'); // Only needed if authentication is required
        console.log("✅ Connected to PocketBase!");
    } catch (error) {
        console.error("❌ PocketBase connection failed:", error.message);
    }
})();

// POST /shorten - Create short URL
app.post("/shorten", async (req, res) => {
  try {
    const { long_url,expiry_date} = req.body;
    if (!long_url) {
        return res.status(400).json({ error: "long_url is required" });
      }
    const short_code = nanoid(6);
    const record = await pb.collection("urls").create({
      long_url,
      short_code,
      created_at: new Date().toISOString(),
      expiry_date: expiry_date ? new Date(expiry_date).toISOString() : null,
    });
    res.json({ short_url: `${req.protocol}://${req.get("host")}/${short_code}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /stats/active - Count active URLs grouped by day
app.get("/stats/active", async (req, res) => {
  try {
    const now = new Date().toISOString();
    const records = await pb.collection("urls").getFullList();

    const activeRecords = records.filter(record => !record.expiry_date || record.expiry_date > now);

   

    res.json(activeRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /urls/recent - Get last 5 created short URLs
app.get("/urls/recent", async (req, res) => {
    try {
      // Fetch the 5 most recent short URLs
      const records = await pb.collection("urls").getList(1, 5, { sort: "-created" });
  
      // Debugging: Log the records fetched
      console.log("Fetched Records:", records.items);  
      res.json(records);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  

// POST /urls/batch - Shorten multiple URLs
app.post("/urls/batch", async (req, res) => {
    try {
        const { urls } = req.body;

        if (!Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({ error: "urls must be a non-empty array" });
        }

        // Disable auto-cancellation
        pb.autoCancellation(false);

        const records = await Promise.all(
            urls.map(async ({ long_url, expiry_date }) => {
                if (!long_url) throw new Error("Each entry must have a 'long_url'");

                const short_code = nanoid(6);
                const record = await pb.collection("urls").create({
                    long_url,
                    short_code,
                    created_at: new Date().toISOString(),
                    expiry_date: expiry_date ? new Date(expiry_date).toISOString() : null
                });

                return { short_code, long_url, expiry_date: record.expiry_date };
            })
        );

        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});