import { useState } from "react";

export function InputFunction({ inputFunction, setInputFunction }) {
  const [raw, setRaw] = useState("x");

  const setFunction = () => {
    const customFunction = eval(`(x) => ${raw}`);

    setInputFunction(() => customFunction);
  };

  return (
    <>
      <input type="text" value={raw} onChange={(e) => setRaw(e.target.value)} />
      <button onClick={setFunction}>Set Function</button>
    </>
  );
}
