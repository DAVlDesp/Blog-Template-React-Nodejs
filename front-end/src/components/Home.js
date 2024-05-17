import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../elements/header.js';

const Home = () => {
  return (
    <div>
      <Header />
      <h1>Home</h1>
      <Link to="/register">Go to Register</Link>
      <br />
      <br />
      <br />
      
      <Link to="/login">Go to login</Link>
      <br />
      <br />
      <br />
          </div>
  );
};

export default Home;
