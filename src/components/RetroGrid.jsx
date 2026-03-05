import './RetroGrid.css';

const RetroGrid = ({ angle = 65, cellSize = 60, opacity = 0.5, lightLineColor = 'rgba(212,175,55,0.3)', darkLineColor = 'rgba(139,0,0,0.2)' }) => {
  return (
    <div
      className="retro-grid"
      style={{
        '--grid-angle': `${angle}deg`,
        '--cell-size': `${cellSize}px`,
        '--grid-opacity': opacity,
        '--light-line': lightLineColor,
        '--dark-line': darkLineColor,
      }}
    >
      <div className="retro-grid-inner" />
    </div>
  );
};

export default RetroGrid;
