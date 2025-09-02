export default function Incrementer({ value, setValue }) {
  return (
    <div className="flex items-center gap-2">
      <button className="btn btn-primary px-3" onClick={() => setValue(Math.max(0, value - 1))} type="button">
        -
      </button>
      <span className="px-3">{value}</span>
      <button className="btn btn-primary px-3" onClick={() => setValue(value + 1)} type="button">
        +
      </button>
    </div>
  );
}
