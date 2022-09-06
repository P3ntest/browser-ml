export function Slider({ onChange, value, max, children }) {
  return (
    <>
      <label htmlFor="">
        {children}: {value}
      </label>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </>
  );
}
