"use client";

import React, { useEffect, useState, useRef } from "react";
import { socketio } from "../../../components/socket";
import Spinner from "@/components/Spinner";
import { QRCodeCanvas } from "qrcode.react";

export default function ClientComponent({ params }) {
  const { OwnerId } = params;
  const [Info, setInfo] = useState(null);
  const [paymentStatus, setStatus] = useState(false);
  const [errMess, setMess] = useState("")
  const [time, settime] = useState(1800);
  const [timer, settimer] = useState(false);
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
        settimer(true);
        socketio.emit("register_order", {
          address: data.address,
        });
      }
      else{
        setMess(data.message)
      }
      

    };

    if (OwnerId) {
      getAddress();
    }
  }, [OwnerId, socketio]);

  useEffect(() => {
    const handleUpdate = () => {
      setStatus(true);
    };
    socketio.on("payment_update", handleUpdate);
  }, [socketio]);

  useEffect(() => {
    if (timer) {
      const interval = setInterval(() => {
        settime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <div
      className="container d-flex justify-content-start flex-column align-items-center mt-5"
      style={{ height: "100vh" }}
    >
      <h1 className="text-center mb-3">Pay to your Merchant with crypto</h1>
      {Info ? (
        <div
          className="d-flex justify-content-center flex-column align-items-center w-100"
        >
          <h4 className="mb-3">Time Reamining : {time} seconds</h4>
          <QRCodeCanvas value={Info.address} size={200} />
          <div className="overflow-scroll w-100" style={{minWidth:"350px", maxWidth: "600px"}}>
          <table className="table table-striped mt-3">
            <tbody>
              {Object.keys(Info).map(
                (key) =>
                  key != "status" && (
                    <tr key={key}>
                      <td>{key.toUpperCase()}</td>
                      <td>{Info[key]}</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
          </div>
        </div>
      ) : (
        !errMess && <Spinner />
      )}

      {errMess ? <p className="fs-3 fw-bold text-decoration-underline">{errMess}</p>: null}

      {Info && (
        <h3>
          Payment Status:{" "}
          {time == 0 ? (
            <b className="text-danger">Failed</b>
          ) : paymentStatus ? (
            <b className="text-success">Confirmed</b>
          ) : (
            <b className="text-warning">Pending</b>
          )}
        </h3>
      )}
    </div>
  );
}
