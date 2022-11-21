import { useNavigate } from 'react-router-dom';
import React from 'react';

function Header() {
  const navigate = useNavigate();

  return <textbox onClick={() => navigate('/')} onKeyDown={() => navigate('/')}>Hexlet Chat</textbox>;
}

export default Header;
