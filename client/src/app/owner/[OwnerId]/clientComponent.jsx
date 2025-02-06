"use client";

import React, { useEffect, useState,useRef } from "react";
import { socketio } from "../../../components/socket";
import Spinner from "@/components/Spinner";
import { QRCodeCanvas } from "qrcode.react";

export default function ClientComponent({ params }) {
  const { OwnerId } = params;
  const [Info, setInfo] = useState(null);
  const [paymentStatus, setStatus] = useState(false);

  useEffect(() => {
    const getAddress = async () => {
      const response = await fetch("http://localhost:3001/generate-address", {
        method: "POST",
        body: JSON.stringify({
          OwnerId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status) {
        setInfo(data);
      }

      socketio.emit("register_order", {
        address: data.address,
      });
    };

    if (OwnerId) {
      getAddress();
    }
  }, [OwnerId, socketio]);

  useEffect(() => {
    const handleUpdate = (message) => {
      setStatus(true);
    };
    socketio.on("payment_update", handleUpdate);
  }, [socketio]);

  return (
    <div
      className="container d-flex justify-content-center flex-column align-items-center"
      style={{ height: "100vh" }}
    >
      <h1 className="text-center mb-3">Pay to your Merchant with crypto</h1>
      {Info ? (<div className="d-flex justify-content-center flex-column align-items-center" style={{maxWidth: "500px"}}>
        <QRCodeCanvas value={Info.address} size={200} />
        <table className="table table-striped w-75 mt-3">
          <tbody>
            {Object.keys(Info).map((key) => (
              key != "status" &&
              <tr key={key}>
                <td>{key.toUpperCase()}</td>
                <td>{Info[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : <Spinner />}

      {Info && <h3>Payment Status: {paymentStatus ? <span className="text-success">Confirmed</span> : <span className="text-warning">Pending</span>}</h3>}
    </div>
  );
}
