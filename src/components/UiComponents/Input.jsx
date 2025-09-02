export default function Input({ label, value, onChange, ...props }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" value={value} onChange={onChange} {...props} />
    </div>
  );
}
