const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_BASE_URL = "https://api.hubapi.com";

// List 100 contacts (with optional pagination for bonus)
router.get("/list", async (req, res) => {
  try {
    const count = 100;
    const { offset } = req.query; // for pagination

    const response = await axios.get(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts`,
      {
        params: {
          limit: count,
          properties: "email,phone",
          after: offset || 0,
        },
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
        },
      }
    );

    const contacts = response.data.results;
    res.json({ contacts, paging: response.data.paging });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// Add new contact
router.post("/add", async (req, res) => {
  const { email, phone } = req.body;

  try {
    const response = await axios.post(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts`,
      {
        properties: {
          email,
          phone,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
        },
      }
    );

    res.status(201).json({
      message: "Contact created successfully",
      contactId: response.data.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create contact" });
  }
});

module.exports = router;
