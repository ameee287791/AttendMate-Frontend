import React from 'react';
import { useLanguage } from './LanguageContext';
import './Header.css';

function Header() {
    const { t, language, setLanguage } = useLanguage();

    return (
        <header>
            <div class="changeLanguage">
                <button onClick={() => language === 'en' ? setLanguage('pl') : setLanguage('en')}>{t('changeLanguage')}</button>
            </div>
        </header>
    );
}

export default Header;