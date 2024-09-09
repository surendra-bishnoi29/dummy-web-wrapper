import React, { useRef, useEffect } from 'react';

const EmbeddedDisplay = ({port}) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleFocus = () => {
      console.log('Iframe focused');
      if (iframeRef.current) {
        iframeRef.current.focus();
      }
    };

    const handleClick = (e) => {
      console.log('Iframe clicked');
      if (iframeRef.current && e.target === iframeRef.current) {
        iframeRef.current.focus();
      }
    };

    window.addEventListener('focus', handleFocus, true);
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('focus', handleFocus, true);
      window.removeEventListener('click', handleClick, true);
    };
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <iframe
        ref={iframeRef}
        src={`http://34.18.95.25:${port}/`}
        title="Embedded Display"
        style={{ height: '100%', width: '100%', border: 'none', position: 'absolute', top: 0, left: 0, zIndex: 10 }}
        tabIndex="0"
      />
    </div>
  );
};

export default EmbeddedDisplay;
