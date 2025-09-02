export default function Dropdown({ label, value, onChange, options }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-input" value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
