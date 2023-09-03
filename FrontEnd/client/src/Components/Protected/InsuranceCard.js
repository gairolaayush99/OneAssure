import React, { useState } from "react";
import axios from 'axios';
import "./InsuranceCard.css"

import { useNavigate } from 'react-router-dom';

function InsuranceCard() {
  // State variables to store user input
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userAmount, setUserAmount] = useState("");
  const [hasPartner, setHasPartner] = useState(false); // Checkbox state
  const [isTier1, setIsTier1] = useState(true)
  const [partnerInfo, setPartnerInfo] = useState({
    name: "",
    age: "",
    amount: "",
  });
  const [children, setChildren] = useState([]);
  const [childInfo, setChildInfo] = useState({ name: "", age: "", amount: "" });
  const [childIndexToEdit, setChildIndexToEdit] = useState(-1); // Index of the child to edit, -1 if none
  const [nextChildIndex, setNextChildIndex] = useState(1); // Index for the next child to be added

  const api='http://localhost:5000'
  
  const navigate = useNavigate();
  // Function to handle adding a child
  const addChild = () => {
    if (childIndexToEdit === -1) {
      // Add a new child if not in edit mode
      setChildren([...children, { ...childInfo, index: nextChildIndex }]);
      setNextChildIndex(nextChildIndex + 1);
    } else {
      // Edit an existing child
      const updatedChildren = [...children];
      updatedChildren[childIndexToEdit] = {
        ...childInfo,
        index: updatedChildren[childIndexToEdit].index,
      };
      setChildren(updatedChildren);
      setChildIndexToEdit(-1); // Reset the edit mode
    }
    setChildInfo({ name: "", age: "", amount: "" });
  };

 

  // Function to handle form submission (you can send this data to the server)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Include the input of the currently displayed child (childInfo) with the other children
    const allChildren = [...children];
    if (childInfo.name || childInfo.age || childInfo.amount) {
      allChildren.push({ ...childInfo, index: nextChildIndex });
    }

    // Include partner's information if the checkbox is checked
    const userPartnerInfo = hasPartner ? { ...partnerInfo } : null;


    // Here, you can send the user's input, including the currently displayed child and partner info, to the server or perform any necessary actions

    const formData = {
        userName,
        userAge,
        userAmount,
        hasPartner,
        partnerInfo: hasPartner ? { ...partnerInfo } : null,
        children: [...allChildren],
    };
    const url = `${api}/addInsurance`;
    const accessToken = localStorage.getItem("token");
    console.log(formData)
    axios.post(url, formData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,   
        },
    })
    .then((response) => {
        formData["total"]=response.data
        sessionStorage.setItem("ins_act",JSON.stringify(formData))
        console.log('Response from server:', response.data);
        
        navigate("/guest-cart")
        
    })
    .catch((error) => {
        // Handle errors (e.g., display an error message)
        console.error('Error:', error);
    });


  };

  return (
    <div className="family-card">
      <div className="family-card-body">
        <h2>Family Information</h2>

        {/* User information input fields */}
        <form onSubmit={handleSubmit} class="card-body">
          <div className="input-information">
            <div className="form-group">
              <label htmlFor="userName">User Name:</label>
              <input
                type="text"
                id="userName"
                className="form-control"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="userAge">User Age:</label>
              <input
                type="number"
                id="userAge"
                className="form-control"
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="userAmount">User Amount:</label>
              <input
                type="number"
                id="userAmount"
                className="form-control"
                value={userAmount}
                onChange={(e) => setUserAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="tier-check">
            <p> <b> <i>Tier 1</i></b></p>
            <input
              type="checkbox"
              className="tier-check-input"
              checked={isTier1}
              onChange={() => setIsTier1(!isTier1)}
            />
            
          </div>
        
          {/* Partner checkbox */}
          <div className="form-check">
            <p> <b> <i>Has Partner</i></b></p>
            <input
              type="checkbox"
              id="hasPartner"
              className="form-check-input"
              checked={hasPartner}
              onChange={() => setHasPartner(!hasPartner)}
            />
            
          </div>

          

          {/* Partner information input fields */}
          {hasPartner && (
            <div className="input-information">
              <div className="form-group">
                <label htmlFor="partnerName">Partner Name:</label>
                <input
                  type="text"
                  id="partnerName"
                  className="form-control"
                  value={partnerInfo.name}
                  onChange={(e) =>
                    setPartnerInfo({ ...partnerInfo, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="partnerAge">Partner Age:</label>
                <input
                  type="number"
                  id="partnerAge"
                  className="form-control"
                  value={partnerInfo.age}
                  onChange={(e) =>
                    setPartnerInfo({ ...partnerInfo, age: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="partnerAmount">Partner Amount:</label>
                <input
                  type="number"
                  id="partnerAmount"
                  className="form-control"
                  value={partnerInfo.amount}
                  onChange={(e) =>
                    setPartnerInfo({ ...partnerInfo, amount: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Children information */}
          <div className="child-information">
            <h3 htmlFor="children">Children:</h3>
            {children.map((child, index) => (
              <div key={index} className="child-info ">
                <p>Child {child.index}:</p>
                <div></div>
                <div className="input-information">
                  {/* Child name input */}
                  <div className="form-group">
                    <label htmlFor={`childName${index}`}>Name:</label>
                    <input
                      type="text"
                      id={`childName${index}`}
                      className="form-control"
                      value={child.name}
                    />
                  </div>
                  {/* Child age input */}
                  <div className="form-group">
                    <label htmlFor={`childAge${index}`}>Age:</label>
                    <input
                      type="number"
                      id={`childAge${index}`}
                      className="form-control"
                      value={child.age}
                    />
                  </div>
                  {/* Child amount input */}
                  <div className="form-group">
                    <label htmlFor={`childAmount${index}`}>Amount:</label>
                    <input
                      type="number"
                      id={`childAmount${index}`}
                      className="form-control"
                      value={child.amount}
                    />
                  </div>
                </div>
                
                <p>Child {child.index +1}:</p>
              </div>
            ))}
          </div>

          {/* Child input fields */}
          <div className="input-information">
          <div className="form-group">
            <label htmlFor="childName">Child Name:</label>
            <input
              type="text"
              id="childName"
              className="form-control"
              value={childInfo.name}
              onChange={(e) =>
                setChildInfo({ ...childInfo, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="childAge">Child Age:</label>
            <input
              type="number"
              id="childAge"
              className="form-control"
              value={childInfo.age}
              onChange={(e) =>
                setChildInfo({ ...childInfo, age: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="childAmount">Child Amount:</label>
            <input
              type="number"
              id="childAmount"
              className="form-control"
              value={childInfo.amount}
              onChange={(e) =>
                setChildInfo({ ...childInfo, amount: e.target.value })
              }
            />
          </div>

          </div>
          
          {/* Buttons */}
          <button type="button" className="btn btn-primary" onClick={addChild}>
            Add Child
          </button>
          
          <button type="submit" className="btn btn-primary">
           Add to Cart
          </button>
        </form>
      </div>
    </div>
  );
}

export default InsuranceCard;
