function Spinner({ label = "Loading..." }) {
  return (
    <div className="spinner-wrap">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export default Spinner;
