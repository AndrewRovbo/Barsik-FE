import "../styles/main.scss";

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

import petSitting from "../img/pet-sitting-img.png";
import petBoarding from "../img/pet-boarding-img.png";
import dogWalking from "../img/dog-walking-img.png";
import petTaxi from "../img/pet-taxi-img.png";
import petGrooming from "../img/pet-grooming-img.png";

function Home() {
    return (
        <>
            <Header />

            <section className="hero">
                <div className="main-wrap">
                    <div className="left">
                        <form className="finder" aria-label="find a sitter">
                            <label>I'm looking for:</label>
                            <div className="field">
                                <select aria-label="service" defaultValue="">
                                    <option value="" disabled hidden>Choose service</option>
                                    <option value="boarding">Pet Boarding</option>
                                    <option value="sitting">Pet Sitting</option>
                                    <option value="walking">Dog Walking</option>
                                    <option value="taxi">Taxi</option>
                                    <option value="grooming">Grooming</option>
                                </select>
                            </div>

                            <label>Near:</label>
                            <div className="field">
                                <input type="search" placeholder="Search location..." />
                            </div>

                            <a className="cta" href="search.html">FIND A SITTER!</a>
                        </form>
                    </div>

                    <div className="right">
                        <h1><i>The Trust</i><br />Your Pet Deserves</h1>
                    </div>
                </div>
            </section>

            <main>
                <h1 className="services-title">Our Services</h1>
                <section className="services">
                    <a className="card big" href="#"><img src={petBoarding} alt="Pet boarding" /><span className="label">PET BOARDING</span></a>
                    <a className="card big" href="#"><img src={petSitting} alt="Pet sitting" /><span className="label">PET SITTING</span></a>

                    <div className="grid-row" style={{ gridColumn: '1 / -1' }}>
                        <a className="card small" href="#"><img src={dogWalking} alt="Dog walking" /><span className="label">DOG WALKING</span></a>
                        <a className="card small" href="#"><img src={petTaxi} alt="Pet taxi" /><span className="label">PET TAXI</span></a>
                        <a className="card small" href="#"><img src={petGrooming} alt="Pet grooming" /><span className="label">PET GROOMING</span></a>
                    </div>
                </section>

                <section className="how">
                    <h1>How it works</h1>
                    <div className="cols">
                        <div>
                            <h3>Find a suitable sitter</h3>
                            <p>Browse profiles, compare experience, reviews and availability to choose the right match for your pet.</p>
                        </div>
                        <div>
                            <h3>Make a request</h3>
                            <p>Send a booking request, discuss details in chat, and confirm time, place and payment.</p>
                        </div>
                        <div>
                            <h3>Meet and get updates</h3>
                            <p>Arrange a meet-and-greet, hand over instructions, and receive regular photo and text updates during the care.</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}

export default Home;