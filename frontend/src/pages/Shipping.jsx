import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../store/cartSlice";
import "../components/Card.css";

export default function Shipping() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/placeorder");
  };

  return (
    <div className="container slide-in" style={{ maxWidth: "600px" }}>
      <h2 className="terminal-header" style={{ marginBottom: "2rem", textAlign: "center" }}>SHIPPING_COORDINATES</h2>
      
      <div className="card" style={{ padding: "2rem" }}>
        <form onSubmit={submitHandler} style={{ display: "grid", gap: "1.5rem" }}>
          <div className="form-group">
            <label style={{ color: "var(--text-secondary)" }}>ADDRESS_LINE</label>
            <input
              type="text"
              required
              className="terminal-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ENTER_STREET_ADDRESS"
              style={{ width: "100%" }}
            />
          </div>

          <div className="form-group">
            <label style={{ color: "var(--text-secondary)" }}>CITY_SECTOR</label>
            <input
              type="text"
              required
              className="terminal-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="ENTER_CITY"
              style={{ width: "100%" }}
            />
          </div>

          <div className="form-group">
            <label style={{ color: "var(--text-secondary)" }}>POSTAL_CODE</label>
            <input
              type="text"
              required
              className="terminal-input"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="ENTER_ZIP_CODE"
              style={{ width: "100%" }}
            />
          </div>

          <div className="form-group">
            <label style={{ color: "var(--text-secondary)" }}>COUNTRY_REGION</label>
            <input
              type="text"
              required
              className="terminal-input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="ENTER_COUNTRY"
              style={{ width: "100%" }}
            />
          </div>

          <button type="submit" className="btn accent full-width" style={{ marginTop: "1rem", justifyContent: "center" }}>
            PROCEED_TO_CONFIRMATION
          </button>
        </form>
      </div>
    </div>
  );
}
