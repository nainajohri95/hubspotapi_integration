const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_BASE_URL = "https://api.hubapi.com";


router.get("/list", async (req, res) => {
  try {
    const count = 100; 
    const { offset } = req.query;

    const response = await axios.get(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts`,
      {
        params: {
          limit: count,
          properties: ["email", "phone", "createdAt"], 
          after: offset || 0,
        },
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
        },
      }
    );

    const contacts = response.data.results;
    
    const sortedContacts = contacts.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json({ contacts: sortedContacts, paging: response.data.paging });
  } catch (error) {
    console.error(
      "Error fetching contacts:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});


router.post("/add", async (req, res) => {
  const { email, phone } = req.body;

  try {
    const response = await axios.post(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts`,
      {
        properties: {
          email: email,
          phone: phone,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const newContact = response.data;
    res.json({ success: true, contact: newContact });
  } catch (error) {
    if (error.response?.data?.category === "CONFLICT") {
      const existingId = error.response?.data?.message.match(/ID: (\d+)/)?.[1];
      return res.status(409).json({
        success: false,
        message: "Contact already exists",
        existingId: existingId, 
      });
    }

    console.error(
      "Error adding contact:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to add contact",
      details: error.response?.data?.message || error.message,
    });
  }
});

module.exports = router;
