import {useNavigate} from "react-router-dom";

export default () => {
    const navigate = useNavigate()

    return <h1 onClick={() => navigate("/")}>Hexlet Chat</h1>
}