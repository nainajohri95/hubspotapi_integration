const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());  // To parse JSON request bodies

// Import routes
const contactsRoutes = require('./routes/contacts');
const companiesRoutes = require('./routes/companies');

// Use routes
app.use('/api/contacts', contactsRoutes);
app.use('/api/companies', companiesRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
