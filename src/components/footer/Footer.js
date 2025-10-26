import "./footer.scss"

function Footer() {
    return (
        <footer>
            <div className="footer-inner">
            <div className="footer-left">
                <h1 id="contacts">Have questions or need assistance?<br />Contact us:</h1>
                <p>barsik@mail.com<br />+375 (xx) xxx-xx-xx</p>
                <p style={{ marginTop: '80px' }}>© 2025 Barsik Inc. All Rights Reserved.</p>
            </div>

            <div className="footer-right">
                <h1>Learn More:</h1>
                <a href="./about-us.html">About Us</a>
                <a href="./faq.html">FAQ</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms & Conditions</a>
            </div>
            </div>
        </footer>
    )
}

export default Footer;