import React from "react";
import "./GuestCard.css";
import axios from 'axios';

function GuestCard() {
  // Retrieve the data from local storage
  const ins_act = JSON.parse(sessionStorage.getItem("ins_act"));

  if (!ins_act) {
    return <div>No data available.</div>;
  }

  // Function to handle the purchase
  const handlePurchase = () => {
    const accessToken = localStorage.getItem("token");
    const apiUrl = "http://127.0.0.1:5000/buy-insurance";

    axios.post(apiUrl, ins_act, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      // Handle the response here
      // You can add your logic to handle the success response
      console.log(response)
    })
    .catch((error) => {
      // Handle errors (e.g., display an error message)
      console.error('Error:', error);
    });
  };

  return (
    <div className="card">
      <div className="card-wrapper">
        <div className="card-content">
          <div className="card-body">
            <h5 className="card-title">User Information</h5>
            <p className="card-text">
              <strong>User Name:</strong> {ins_act.userName}
            </p>
            <p className="card-text">
              <strong>User Age:</strong> {ins_act.userAge}
            </p>
            <p className="card-text">
              <strong>User Amount:</strong> {ins_act.userAmount}
            </p>
          </div>
          {ins_act.hasPartner && ins_act.partnerInfo && (
            <div className="card-body">
              <h5 className="card-title">Partner Information</h5>
              <p className="card-text">
                <strong>Partner Name:</strong> {ins_act.partnerInfo.name}
              </p>
              <p className="card-text">
                <strong>Partner Age:</strong> {ins_act.partnerInfo.age}
              </p>
              <p className="card-text">
                <strong>Partner Amount:</strong> {ins_act.partnerInfo.amount}
              </p>
            </div>
          )}
          <div className="card-body">
            <h5 className="card-title">Children Information</h5>
            {ins_act.children.map((child, index) => (
              <div key={index} className="child-card">
                <p className="card-text">
                  <strong>Child {child.index} Name:</strong> {child.name}
                </p>
                <p className="card-text">
                  <strong>Child {child.index} Age:</strong> {child.age}
                </p>
                <p className="card-text">
                  <strong>Child {child.index} Amount:</strong> {child.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="total-sum">
          Total : <b>{ins_act.total}</b>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handlePurchase}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default GuestCard;
