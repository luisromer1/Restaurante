import React from 'react';
// Si usas Font Awesome:
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUsers, faGlobeAmericas, faClock, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';


// Se elimina la prop 'icon' de los parámetros de la función, ya que no se usaba.
function StatCard({ iconType, value, label, percentage, percentageText }) {
  const percentageClass = parseFloat(percentage) >= 0 ? 'positive' : 'negative';

  let IconComponent;
  // Aquí mapeas iconType a un icono real.
  // Si usaras FontAwesome, sería algo así:
  switch (iconType) {
    case 'people':
      // IconComponent = <FontAwesomeIcon icon={faUsers} />;
      IconComponent = <span role="img" aria-label="people" style={{ fontSize: '1.5em' }}>👥</span>;
      break;
    case 'countries':
      // IconComponent = <FontAwesomeIcon icon={faGlobeAmericas} />;
      IconComponent = <span role="img" aria-label="countries" style={{ fontSize: '1.5em' }}>🌍</span>;
      break;
    case 'hours':
      // IconComponent = <FontAwesomeIcon icon={faClock} />;
      IconComponent = <span role="img" aria-label="hours" style={{ fontSize: '1.5em' }}>⏰</span>;
      break;
    default:
      // IconComponent = <FontAwesomeIcon icon={faQuestionCircle} />;
      IconComponent = <span role="img" aria-label="default" style={{ fontSize: '1.5em' }}>?</span>;
  }


  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${iconType}`}>
        {/* Ahora IconComponent se renderiza directamente basado en iconType */}
        {IconComponent}
      </div>
      <div className="stat-card-info">
        <h3>{value}</h3>
        <p>{label}</p>
        {percentage && (
          <p className={`percentage ${percentageClass}`}>
            {percentage} {percentageText || 'than last week'}
          </p>
        )}
      </div>
    </div>
  );
}

export default StatCard;