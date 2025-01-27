import React from 'react';
import { useLanguage } from './LanguageContext';
import './Header.css';

function Header() {
    const { t, language, setLanguage } = useLanguage();

    return (
        <header>
            <div className="changeLanguage">
                <button 
                    className={`language-button ${language === 'en' ? 'active' : ''}`} 
                    onClick={() => setLanguage('en')}
                >
                    EN
                </button>
                <button 
                    className={`language-button ${language === 'pl' ? 'active' : ''}`} 
                    onClick={() => setLanguage('pl')}
                >
                    PL
                </button>
            </div>
        </header>
    );
}

export default Header;