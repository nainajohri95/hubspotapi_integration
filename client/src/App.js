import React from "react";
import "./App.css";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";

function App() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <ContactForm />
      <ContactList />
    </div>
  );
}

export default App;
