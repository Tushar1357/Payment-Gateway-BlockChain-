'use client'

import React, { useEffect, useState } from 'react'
import {socketio} from '../../../components/socket'


export default function ClientComponent({ params }) {
  const { OwnerId } = params;  
  const [Info,setInfo] = useState(null)
  const[paymentStatus, setStatus] = useState(false)

  useEffect(() => {
    const getAddress = async () => {
      const response = await fetch("http://localhost:3001/generate-address", {
        method: "POST",
        body: JSON.stringify({
          OwnerId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      if(data.status){
      setInfo(data)}

      socketio.emit('register_order',{
        address: data.address
      })
    }

    if (OwnerId) {
      getAddress();
    }
  }, [OwnerId,socketio]); 

  useEffect(() => {

    const handleUpdate = (message) => {
      setStatus(true)
    }
    socketio.on('payment_update',handleUpdate)
  },[socketio])

  return (
    <div>
      {Info ? <p>Address: {Info.address}<br />OrderId: {Info.orderId}<br />Amount: ${Info.amount}</p>:<p>Invalid owner</p>}

      <h3>Payment Status: {paymentStatus ? "Confirmed" : "Pending"}</h3>
    </div>
  )
}
