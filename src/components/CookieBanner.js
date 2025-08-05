import React, { useState } from 'react';

const CookieBanner = () => {
  const [visible, setVisible] = useState(
    () => !localStorage.getItem('cookiesAccepted')
  );

  const accept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-anix-dark text-white p-4 flex flex-col md:flex-row items-center justify-between z-50">
      <p className="mb-2 md:mb-0">
        Мы используем куки для аналитики и маркетинга.
      </p>
      <button
        onClick={accept}
        className="bg-anix-purple hover:bg-anix-teal text-white px-4 py-2 rounded"
      >
        Принять
      </button>
    </div>
  );
};

export default CookieBanner;
