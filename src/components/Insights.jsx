import React from 'react';

const Insights = () => {
  const insights = [
    {
      title: 'Movement with Soul',
      description: 'MANIFEST is the first movement coin with a soul mission to $69B.',
    },
    {
      title: 'Ritual Coin',
      description: 'MANIFEST is a ritual coin every buyback, every post, every holder is part of the ritual.',
    },
    {
      title: 'Treasury Strategy',
      description: 'MANIFEST is the world\'s first movement coin with a treasury strategy. Structure + culture.',
    },
    {
      title: 'Belief Into Action',
      description: 'MANIFEST is belief turned into action, and action scaled into freedom.',
    },
    {
      title: 'Cultural Flywheel',
      description: 'MANIFEST is a cultural flywheel, designed to compound belief into $69B.',
    },
    {
      title: 'Mirror of Belief',
      description: 'MANIFEST is a mirror. It\'s the belief you have in yourself, reflected on-chain.',
    },
  ];

  return (
    <section className="insights" id="insights">
      <h2>What is MANIFEST?</h2>
      <div className="insight-grid">
        {insights.map((insight, index) => (
          <div key={index} className="insight-card fade-in">
            <h3>{insight.title}</h3>
            <p>{insight.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Insights;