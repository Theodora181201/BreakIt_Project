import "../css/Navbar.css";
import logoImg from "../assets/logo.png";

export default function Navbar() {

    return (

        <header className="navbar">

            <img src={logoImg} alt="Break It Logo" className="logo-image" />

        </header>

    )

}