import "../styles/_common.scss";

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useTranslation } from 'react-i18next';

function AboutUs() {
	const { t } = useTranslation();
	return (
		<>
			<Header />

			<div className="wrap">
				<p dangerouslySetInnerHTML={{ __html: t('about.welcome', 'Welcome to <strong>Paw & Home</strong> — a neighbourhood pet-sitting service that looks after your pets with care, consistency and kindness. Whether you need daily visits, overnight stays, or long-term care, our team treats every animal as if they were our own.') }} />

				<h1>{t('about.what.title', 'What we do')}</h1>
				<ul>
					<li>{t('about.what.item1', 'Pet sitting — tailored visits to check, feed and play with your pet.')}</li>
					<li>{t('about.what.item2', 'Pet boarding — safe overnight care in a home environment.')}</li>
					<li>{t('about.what.item3', 'Dog walking — regular walks and exercise for dogs of all ages.')}</li>
					<li>{t('about.what.item4', 'Pet taxi — secure transportation to vet or groomer.')}</li>
					<li>{t('about.what.item5', 'Pet grooming — basic grooming and freshening for healthy coats.')}</li>
				</ul>

				<h1>{t('about.why.title', 'Why choose us')}</h1>
				<ul>
					<li>{t('about.why.item1', 'Insured and background-checked sitters')}</li>
					<li>{t('about.why.item2', 'Personalised plans for each pet')}</li>
					<li>{t('about.why.item3', 'Clear, friendly communication')}</li>
				</ul>
			</div>

			<Footer />
		</>
	)
}

export default AboutUs;