import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Loader2,
  Search,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ContactForm = ({ onContactAdded }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/contacts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, phone }),
      });

      const result = await response.json();

      if (response.status === 409) {
        setMessage(`Contact already exists. ID: ${result.existingId}`);
        setTimeout(() => setMessage(""), 3000);
      } else if (!response.ok) {
        throw new Error(result.error || "Failed to add contact");
      } else {
        const newContact = { email, phone };
        onContactAdded(newContact);
        setMessage("Contact added successfully!");
        setEmail("");
        setPhone("");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage(error.message || "Failed to add contact");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mb-8">
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-lg flex items-center gap-2">
        <PlusCircle className="text-white" size={24} />
        <h2 className="text-2xl font-bold text-white">Add New Contact</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {message && (
          <div
            className={`p-4 rounded-lg text-sm font-medium ${
              message.includes("success")
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
              placeholder="Enter email address"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Adding Contact...</span>
            </>
          ) : (
            <>
              <PlusCircle size={20} />
              <span>Add Contact</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchContacts();
  }, [page]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `http://localhost:5000/api/contacts/list?offset=${page * 100}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch contacts");
      }

      const data = await response.json();
      const mappedContacts = data.contacts.map((contact) => ({
        email: contact.properties?.email || "N/A",
        phone: contact.properties?.phone || "N/A",
        createdAt: contact.createdAt, 
      }));

      const sortedContacts = mappedContacts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setContacts(sortedContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError(error.message || "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleContactAdded = (newContact) => {
    const newContactWithTimestamp = { ...newContact, createdAt: new Date() };
    setContacts((prevContacts) => [newContactWithTimestamp, ...prevContacts]);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      (contact.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (contact.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ContactForm onContactAdded={handleContactAdded} />

      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Contacts List</h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                placeholder="Search by email or phone"
              />
            </div>
          </div>
        </div>

        <ul className="divide-y divide-gray-200">
          {loading ? (
            <li className="p-6 text-center text-gray-600">
              Loading contacts...
            </li>
          ) : error ? (
            <li className="p-6 text-center text-red-600">{error}</li>
          ) : filteredContacts.length === 0 ? (
            <li className="p-6 text-center text-gray-600">
              No contacts found.
            </li>
          ) : (
            filteredContacts.map((contact, index) => (
              <li key={index} className="p-6">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">{contact.email}</p>
                    <p className="text-gray-600">{contact.phone}</p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="flex justify-between items-center p-6 bg-gray-50 rounded-b-lg">
          <button
            onClick={prevPage}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            disabled={page === 0}
          >
            <ChevronLeft />
            Previous
          </button>
          <button
            onClick={nextPage}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            Next
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
