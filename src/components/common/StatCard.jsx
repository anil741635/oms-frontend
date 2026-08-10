import Icon from "./Icon";

function StatCard({ icon, label, value, tone = "default" }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-icon">
        <Icon name={icon} size={22} />
      </div>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
