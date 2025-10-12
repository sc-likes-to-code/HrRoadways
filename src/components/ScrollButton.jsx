
import React, { useEffect, useState } from 'react';

function ScrollButton() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            if (window.scrollY > 200) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', checkScroll);
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    const handleScroll = () => {
        window.scrollTo({ top: 0, behavior: 'smooth'});
    };

    return (
        showButton && (
            <button
            onClick={handleScroll}
            style={{
                position: 'fixed',
                bottom: '22px',
                right: '22px',
                backgroundColor: '#161b33',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 2)',
                cursor: 'pointer',
                transition: 'opacity 0.3s ease',
                zIndex: 9999,
            }}

            aria-label="Go to top"
            >
            <i class="fa-solid fa-arrow-up"></i>
            </button>
        )
    );
 }

 export default ScrollButton;