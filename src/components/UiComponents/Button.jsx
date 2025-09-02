export default function Button({ children, ...props }) {
  return (
    <button className="btn btn-primary btn-block" {...props}>
      {children}
    </button>
  );
}
