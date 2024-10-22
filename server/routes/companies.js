const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_BASE_URL = "https://api.hubapi.com";

// List 100 companies
router.get("/list", async (req, res) => {
  try {
    const count = 100;
    const { offset } = req.query; // for pagination

    const response = await axios.get(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/companies`,
      {
        params: {
          limit: count,
          properties: "domain,phone",
          after: offset || 0,
        },
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
        },
      }
    );

    const companies = response.data.results;
    res.json({ companies, paging: response.data.paging });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

module.exports = router;
