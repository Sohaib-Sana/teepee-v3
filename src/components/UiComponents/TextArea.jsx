export default function TextArea({ label, value, onChange, ...props }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea className="form-input h-28" value={value} onChange={onChange} {...props} />
    </div>
  );
}
