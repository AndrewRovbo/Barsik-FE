import { useRef, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import "./header.scss";
import logo from "../../img/logo.svg";
import { initNavAnimation, initLanguageSwitch } from '../../scripts/headerScript';

function Header() {
	const navRef = useRef(null);
	const langRef = useRef(null);

	useEffect(() => {
		const cleanupNav = initNavAnimation(navRef.current);
		const cleanupLang = initLanguageSwitch(langRef.current);

		return () => {
			if (typeof cleanupNav === 'function') cleanupNav();
			if (typeof cleanupLang === 'function') cleanupLang();
		};
	}, []);

	return (
		<header>
			<div className="wrap topbar">
				<nav ref={navRef} className="nav">
					<NavLink to="/" end>HOME</NavLink>
					<NavLink to="/about-us" end>ABOUT US</NavLink>
					<NavLink to="/faq" end>FAQ</NavLink>
					<a href="#contacts">CONTACTS</a>
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

					<NavLink className="btn-login" to="/log-in">LOG IN</NavLink>
					<NavLink className="btn-signup" to="/sign-up">SIGN UP</NavLink>
				</div>
			</div>
		</header>
	);
}

export default Header;
