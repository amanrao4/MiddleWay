const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Missing query" });
    }

    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { format: "json", q: query },
        headers: {
          "User-Agent": "MiddleWayApp/1.0 (demo@middleway.com)",
        },
        timeout: 7000, // 7 seconds
      });
          

    res.json(response.data);
  } catch (error) {
    console.error("Nominatim Proxy Error:", error.message);
    res.status(500).json({ message: "Failed to fetch from Nominatim" });
  }
});

module.exports = router;
