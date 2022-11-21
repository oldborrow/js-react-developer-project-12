import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  return <h1 onClick={() => navigate('/')}>Hexlet Chat</h1>;
}

export default Header;
