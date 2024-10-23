import React from "react";
import "./App.css";
import ContactList from "./components/ContactList";

function App() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <ContactList />
    </div>
  );
}

export default App;
