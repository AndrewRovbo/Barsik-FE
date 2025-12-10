import "../styles/main.scss";

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useTranslation } from 'react-i18next';

import petSitting from "../img/pet-sitting-img.png";
import petBoarding from "../img/pet-boarding-img.png";
import dogWalking from "../img/dog-walking-img.png";
import petTaxi from "../img/pet-taxi-img.png";
import petGrooming from "../img/pet-grooming-img.png";

function Home() {
	const { t } = useTranslation();
	return (
		<>
			<Header />

			<section className="hero">
				<div className="main-wrap">
					<div className="left">
						<form className="finder" aria-label="find a sitter">
							<label>{t('finder.im_looking', "I'm looking for:")}</label>
							<div className="field">
								<select aria-label="service" defaultValue="">
									<option value="" disabled hidden>{t('finder.choose_service', 'Choose service')}</option>
									<option value="boarding">{t('service.boarding', 'Pet Boarding')}</option>
									<option value="sitting">{t('service.sitting', 'Pet Sitting')}</option>
									<option value="walking">{t('service.walking', 'Dog Walking')}</option>
									<option value="taxi">{t('service.taxi', 'Taxi')}</option>
									<option value="grooming">{t('service.grooming', 'Grooming')}</option>
								</select>
							</div>
							<label>{t('finder.near', 'Near:')}</label>
							<div className="field">
								<input type="search" placeholder={t('finder.search_location', 'Search location...')} />
							</div>

							<a className="cta" href="search.html">{t('finder.find_a_sitter', 'FIND A SITTER!')}</a>
						</form>
					</div>

					<div className="right">
						<h1><i>{t('hero.the_trust', 'The Trust')}</i><br />{t('hero.your_pet_deserves', 'Your Pet Deserves')}</h1>
					</div>
				</div>
			</section>

			<main>
				<h1 className="services-title">{t('services.title', 'Our Services')}</h1>
				<section className="services">
					<a className="card big" href="#"><img src={petBoarding} alt={t('service.boarding','Pet boarding')} /><span className="label">{t('service.boarding', 'PET BOARDING')}</span></a>
					<a className="card big" href="#"><img src={petSitting} alt={t('service.sitting','Pet sitting')} /><span className="label">{t('service.sitting', 'PET SITTING')}</span></a>

					<div className="grid-row" style={{ gridColumn: '1 / -1' }}>
						<a className="card small" href="#"><img src={dogWalking} alt={t('service.walking','Dog walking')} /><span className="label">{t('service.walking', 'DOG WALKING')}</span></a>
						<a className="card small" href="#"><img src={petTaxi} alt={t('service.taxi','Pet taxi')} /><span className="label">{t('service.taxi', 'PET TAXI')}</span></a>
						<a className="card small" href="#"><img src={petGrooming} alt={t('service.grooming','Pet grooming')} /><span className="label">{t('service.grooming', 'PET GROOMING')}</span></a>
					</div>
				</section>

				<section className="how">
					<h1>{t('how.title', 'How it works')}</h1>
					<div className="cols">
						<div>
							<h3>{t('how.find_sitter.title', 'Find a suitable sitter')}</h3>
							<p>{t('how.find_sitter.desc', 'Browse profiles, compare experience, reviews and availability to choose the right match for your pet.')}</p>
						</div>
						<div>
							<h3>{t('how.make_request.title', 'Make a request')}</h3>
							<p>{t('how.make_request.desc', 'Send a booking request, discuss details in chat, and confirm time, place and payment.')}</p>
						</div>
						<div>
							<h3>{t('how.meet_updates.title', 'Meet and get updates')}</h3>
							<p>{t('how.meet_updates.desc', 'Arrange a meet-and-greet, hand over instructions, and receive regular photo and text updates during the care.')}</p>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</>
	)
}

export default Home;