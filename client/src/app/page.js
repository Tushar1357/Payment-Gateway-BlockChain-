'use client'

import { useState } from "react";
import Link from "next/link"; 

export default function Home() {
  const [url, setUrl] = useState(""); 
  const createOwner = async (event) => {
    event.preventDefault();
    const formData = {
      OwnerName: event.target.ownername.value,
      address: event.target.address.value,
      amount: event.target.amount.value,
    };

    try {
      const response = await fetch("http://localhost:3001/add-owner", {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

    
      if (data.status && data.OwnerId) {
        setUrl(`http://localhost:3000/owner/${data.OwnerId}`);
      } else {
        console.error("Error:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={createOwner}>
        <input type="text" name="ownername" placeholder="Enter user name" required />
        <input type="text" name="address" placeholder="Enter user address" required />
        <input type="number" name="amount" placeholder="Enter amount" step='0.01' required />
        <button type="submit">Submit</button>
      </form>

      {url && <Link href={url}>Payment Link</Link>}
    </div>
  );
}
