import Icon from "./Icon";

function EmptyState({ icon = "box", title = "No records found", message = "" }) {
  return (
    <div className="empty-state">
      <Icon name={icon} size={36} />
      <p className="empty-title">{title}</p>
      {message && <p className="empty-message">{message}</p>}
    </div>
  );
}

export default EmptyState;
