import React from 'react';

const Insights = () => {
  const insights = [
    {
      title: 'The Art of Manifesting',
      description: 'With $MANIFEST, master the art of manifesting a 69 billion market cap to surpass @porsche, crafting a legacy of luxury.',
    },
    {
      title: 'Vision of Triumph',
      description: 'Our $MANIFEST vision propels us to flip @porsche, uniting a community in pursuit of extraordinary success.',
    },
    {
      title: 'Manifesting Prosperity',
      description: 'Each $MANIFEST holding ignites prosperity, health, and abundance, empowering your journey to greatness.',
    },
    {
      title: 'The Manifest Odyssey',
      description: 'Embark on a transformative odyssey with $MANIFEST, where every dream is forged through collective strength.',
    },
    {
      title: 'Elevated Living',
      description: '$MANIFEST elevates your existence, manifesting cars, homes, and experiences that embody ultimate prestige.',
    },
    {
      title: 'Unity in Manifestation',
      description: 'The $MANIFEST community is the heartbeat of this movement, driving toward a future of unmatched splendor.',
    },
  ];

  return (
    <section className="insights" id="insights">
      <h2>Manifest Insights</h2>
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