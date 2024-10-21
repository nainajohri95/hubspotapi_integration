import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contacts?page=${page}&limit=100`);
      const data = await response.json();
      setContacts(data.results);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(currentPage);
  }, [currentPage]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Contacts</h2>
      
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <Card key={contact.id} className="shadow-sm">
              <CardContent className="p-4">
                <p className="font-medium">Email: {contact.properties.email}</p>
                <p>Phone: {contact.properties.phone}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-center gap-2">
        <Button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="py-2 px-4">Page {currentPage}</span>
        <Button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={contacts.length < 100}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ContactList;