'use client'

import Spinner from "@/components/Spinner";
import { useRef, useState } from "react";

export default function Page() {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const errMessage = useRef("");

  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = {
      OwnerName: event.target.ownername.value,
    };

    const response = await fetch("http://localhost:3001/get-owner", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status) {
      setUrl(`http://localhost:3000/owner/${data.message}`);
      errMessage.current = "";
    } else {
      setUrl(null);
      errMessage.current = data.message;
    }
    setLoading(false);
  };

  return (
    <div className="container mt-3" style={{ height: "100vh" }}>
      <h1 className="text-center fw-bold">
        Find the merchant to whom you want to pay
      </h1>
      <form
        className="d-flex flex-column align-items-center justify-content-center h-50"
        onSubmit={submitForm}
      >
        <div className="mb-3 w-75 input-group" style={{ maxWidth: "500px" }}>
          <input
            type="text"
            className="form-control"
            id="ownername"
            name="ownername"
            placeholder="Enter merchant/organisation name"
          />
          <button type="submit" className="btn btn-primary">
            {!loading ? "Search" : <Spinner />}
          </button>
        </div>
        {url ? <p className="text-center">Payment URL: <a href={url} target="_blank">{url}</a></p> : <p>{errMessage.current}</p>}
      </form>
    </div>
  );
}
