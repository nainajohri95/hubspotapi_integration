import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            email: formData.email,
            phone: formData.phone,
          },
        }),
      });

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Contact created successfully!",
        });
        setFormData({ email: "", phone: "" });
      } else {
        setStatus({ type: "error", message: "Failed to create contact" });
      }
    } catch (error) {
      setStatus({ type: "error", message: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <Input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Contact"}
          </Button>
        </form>

        {status && (
          <Alert
            className={`mt-4 ${
              status.type === "success" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactForm;
