import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const microserviceUrl = process.env.REACT_APP_MICROSERVICE_URL;
    console.log(microserviceUrl);
    const response = await axios.get(`${microserviceUrl}/api/data`);
    setData(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const microserviceUrl = process.env.REACT_APP_MICROSERVICE_URL;
    await axios.post(`${microserviceUrl}/api/data`, { name, email });
    fetchData();
  };

  return (
    <div className="App">
      <h1>Redis Data Collection</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <h2>Stored Data</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.name} - {item.email} - {item.ip}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
