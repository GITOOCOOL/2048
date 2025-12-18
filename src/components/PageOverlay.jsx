import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PageOverlay = ({ title, children }) => {
  const navigate = useNavigate();

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [navigate]);

  return (
    <div className="page-overlay-wrapper">
      <div className="page-overlay-backdrop" onClick={() => navigate('/')}></div>
      <div className="page-overlay-content">
        <div className="overlay-header">
          <button className="back-btn" onClick={() => navigate('/')}>
             &#8592; {/* Left Arrow */}
          </button>
          <span className="overlay-title">{title}</span>
        </div>
        <div className="overlay-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageOverlay;
