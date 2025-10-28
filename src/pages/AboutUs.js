import "../styles/_common.scss";

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

function AboutUs() {
    return (
        <>
            <Header />

            <div className="wrap">
                <p>Welcome to <strong>Paw & Home</strong> — a neighbourhood pet-sitting service that looks after your pets with care, consistency and kindness. Whether you need daily visits, overnight stays, or long-term care, our team treats every animal as if they were our own.</p>

                <h1>What we do</h1>
                <ul>
                    <li>Pet sitting — tailored visits to check, feed and play with your pet.</li>
                    <li>Pet boarding — safe overnight care in a home environment.</li>
                    <li>Dog walking — regular walks and exercise for dogs of all ages.</li>
                    <li>Pet taxi — secure transportation to vet or groomer.</li>
                    <li>Pet grooming — basic grooming and freshening for healthy coats.</li>
                </ul> 

                <h1>Why choose us</h1>
                <ul>
                    <li>Insured and background-checked sitters</li>
                    <li>Personalised plans for each pet</li>
                    <li>Clear, friendly communication</li>
                </ul>
            </div>

            <Footer />
        </>
    )
}

export default AboutUs;