import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContacts();
  }, [page]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `http://localhost:5000/api/contacts/list?offset=${page * 100}`
      );
      setContacts(response.data.contacts);
    } catch (error) {
      console.error("Error fetching contacts", error);
      setError("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Contacts List</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-6 bg-red-50">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Loading contacts...
                    </div>
                  </TableCell>
                </TableRow>
              ) : contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8">
                    No contacts found
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{contact.properties.email}</TableCell>
                    <TableCell>{contact.properties.phone}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={prevPage}
            disabled={page === 0 || loading}
          >
            Previous
          </Button>
          <Button variant="outline" onClick={nextPage} disabled={loading}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactList;
