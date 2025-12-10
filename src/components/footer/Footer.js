import "./footer.scss"
import { NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function Footer() {
    const { t } = useTranslation();
    return (
        <footer>
            <div className="footer-inner">
            <div className="footer-left">
                <h1 id="contacts">{t('footer.contact_heading', 'Have questions or need assistance?')}<br />{t('footer.contact_us', 'Contact us:')}</h1>
                <p>{t('footer.email', 'barsik@mail.com')}<br />{t('footer.phone', '+375 (xx) xxx-xx-xx')}</p>
                <p style={{ marginTop: '80px' }}>{t('footer.copyright', '© 2025 Barsik Inc. All Rights Reserved.')}</p>
            </div>

            <div className="footer-right">
                <h1>{t('footer.learn_more', 'Learn More:')}</h1>
                <NavLink to="/about-us">{t('nav.about', 'About Us')}</NavLink>
                <NavLink to="/faq">{t('nav.faq', 'FAQ')}</NavLink>
                <a href="#">{t('footer.privacy', 'Privacy Policy')}</a>
                <a href="#">{t('footer.terms', 'Terms & Conditions')}</a>
            </div>
            </div>
        </footer>
    )
}

export default Footer;