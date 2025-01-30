import React from 'react';

const recommendations = [
  {
    id: 1,
    name: 'Cancha La Bombonera',
    type: 'Fútbol 11',
    price: '$25.000/h',
    rating: '4.8',
    img: "../examples/cancha2.jpg"
  },
  {
    id: 2,
    name: 'Estadio Monumental',
    type: 'Canchas Sintéticas',
    price: '$30.000/h',
    rating: '4.9',
    img: "../examples/cancha1.jpg"
  },
  {
    id: 3,
    name: 'Club Atlético Boca Juniors',
    type: 'Canchas de Cesped Natural',
    price: '$15.000/h',
    rating: '4.7',
    img: "../examples/cancha3.jpg"
  },
];

const RecommendationsSection = () => {
  return (
    <section className="recommendations-section">
      <h2>Recomendaciones</h2>
      <div className="recommendations-grid">
        {recommendations.map((item) => (
          <div key={item.id} className="recommendation-card">
            <div className="card-image">
                <img src={item.img} alt="cancha" />
            </div>
            <h3>{item.name}</h3>
            <p>{item.type}</p>
            <div className="card-footer">
              <span>{item.price}</span>
              <span>⭐ {item.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendationsSection;