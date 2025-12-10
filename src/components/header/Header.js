import { useRef, useEffect } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./header.scss";
import logo from "../../img/logo.svg";
import { initNavAnimation, initLanguageSwitch } from '../../scripts/headerScript';

function Header() {
    const { t } = useTranslation();
    const navRef = useRef(null);
    const langRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const cleanupNav = initNavAnimation(navRef.current, location.pathname);
        const cleanupLang = initLanguageSwitch(langRef.current);

        return () => {
            if (typeof cleanupNav === 'function') cleanupNav();
            if (typeof cleanupLang === 'function') cleanupLang();
        };
    }, [location.pathname]);

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <header>
            <div className="header-wrap topbar">
                <nav ref={navRef} className="nav">
                    <NavLink to="/" end>{t('nav.home', 'HOME')}</NavLink>
                    <NavLink to="/about-us" end>{t('nav.about', 'ABOUT US')}</NavLink>
                    <NavLink to="/faq" end>{t('nav.faq', 'FAQ')}</NavLink>
                    <a href="#contacts">{t('nav.contacts', 'CONTACTS')}</a>
                </nav>

                <div className="logo"><img src={logo} alt="Barsik logo" /></div>

                <div className="actions">
                    <div className="language-switch" ref={langRef}>
                        <button className="btn-language" aria-haspopup="true" aria-expanded="false" type="button">EN</button>

                        <ul className="language-list" role="menu" aria-label="Select language">
                            <li role="menuitemradio" data-lang="EN" aria-checked="false">English</li>
                            <li role="menuitemradio" data-lang="BE" aria-checked="false">Беларуская</li>
                            <li role="menuitemradio" data-lang="RU" aria-checked="false">Русский</li>
                            <li role="menuitemradio" data-lang="ZH" aria-checked="false">中文</li>
                        </ul>
                    </div>

                    {user ? (
                        <>
                            <NavLink className="btn-chat" to="/chat">{t('nav.chat', 'CHAT')}</NavLink>
                            <NavLink className="btn-profile" to="/profile">{t('nav.profile', 'PROFILE')}</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink className="btn-login" to="/log-in">{t('nav.login', 'LOG IN')}</NavLink>
                            <NavLink className="btn-signup" to="/sign-up">{t('nav.signup', 'SIGN UP')}</NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
