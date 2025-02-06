"use client";

import { useState } from "react";
import Link from "next/link";
import Spinner from "@/components/Spinner";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setloading] = useState(false)
  const createOwner = async (event) => {
    event.preventDefault();
    setloading(true)
    const formData = {
      OwnerName: event.target.ownername.value,
      address: event.target.address.value,
      amount: event.target.amount.value,
    };

    try {
      const response = await fetch("http://localhost:3001/add-owner", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status && data.OwnerId) {
        setloading(false)
        setUrl(`http://localhost:3000/owner/${data.OwnerId}`);
      } else {
        console.error("Error:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center flex-column align-items-center mt-3" style={{height: "100vh"}}>
      <h1 className="text-center fw-bold">USDTPay</h1>
      <p className="text-center w-50">
        Pay now with crypto seamlessly. Forget the hassles you find doing
        payment. Be anonymous
      </p>
      <h3 className="m-3">Accept Payents as a Merchant</h3>
      {loading && <Spinner />}
      <form
        onSubmit={createOwner}
        className="d-flex justify-content-center p-3 w-100 flex-column"
      >
        <div className="mb-3">
          <label htmlFor="merchant" className="form-label">
            Merchant Name
          </label>
          <input
            type="text"
            className="form-control"
            id="merchant"
            name="ownername"
            placeholder="Enter merchant/organisation name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address (BSC ONLY)
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            placeholder="Enter your address"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            USDT Amount
          </label>
          <input
            type="number"
            className="form-control"
            id="amount"
            name="amount"
            step="0.01"
            placeholder="Enter amount of USDT"
          />
        </div>
        <button className="btn btn-primary mb-3" type="submit">Submit</button>
      {url && <p>Payment Link: <Link href={url}>{url}</Link></p> }
      </form>

    </div>
  );
}
