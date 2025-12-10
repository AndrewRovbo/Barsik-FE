import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import ruCommon from './locales/ru/common.json';
import beCommon from './locales/be/common.json';
import zhCommon from './locales/zh/common.json';

const resources = {
	en: { common: enCommon },
	ru: { common: ruCommon },
	be: { common: beCommon },
	zh: { common: zhCommon }
};

function storedToLng() {
	const saved = localStorage.getItem('siteLang');
	if (!saved) return 'en';
	const map = { EN: 'en', RU: 'ru', BE: 'be', ZH: 'zh' };
	return map[saved] || saved.toLowerCase() || 'en';
}

i18n.use(initReactI18next).init({
	resources,
	lng: storedToLng(),
	fallbackLng: 'en',
	ns: ['common'],
	defaultNS: 'common',
	interpolation: { escapeValue: false },
	react: { useSuspense: false }
});

export default i18n;