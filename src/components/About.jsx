import React, { useState } from 'react';

const About = () => {
  const [copied, setCopied] = useState(false);
  const caText = '0xc466c28d87b3d5cd34f3d5c088751532d71a38d93a8aae4551dd56272cfb4355::manifest::MANIFEST';

  const handleCopy = () => {
    navigator.clipboard.writeText(caText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <section className="about" id="about">
      <h2>About MANIFEST</h2>
      <div className="vision">
        <p>
          Step into a realm of infinite possibilities with $MANIFEST, where every dream is sculpted into reality.
          We are driven to manifest a staggering 69 billion market cap, poised to eclipse @porsche,
          redefining the essence of luxury and freedom. This is not merely a vision—it’s a revolution ignited by your unwavering belief.
        </p>
      </div>
      <div className="movement">
        <p
          onClick={handleCopy}
          style={{
            wordBreak: 'break-all', // Breaks long words on narrow screens
            overflowWrap: 'break-word', // Handles overflow gracefully
            cursor: 'pointer', // Indicates it's clickable
            whiteSpace: 'normal', // Allows natural wrapping
          }}
        >
          CA: {caText}
          {copied && <span style={{ marginLeft: '10px', color: 'green' }}>Copied!</span>}
        </p>
      </div>
      <div className="social-links">
        <a href="https://x.com/manifestsui" target="_blank" rel="noopener noreferrer">X: @manifestsui</a>
        <a href="https://t.me/manifestsui" target="_blank" rel="noopener noreferrer">TG: @manifestsui</a>
      </div>
    </section>
  );
};

export default About;