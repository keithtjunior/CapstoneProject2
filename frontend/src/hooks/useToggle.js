import { useState } from "react";

export const useToggle = (initialVal) => {
  const [value, setValue] = useState(initialVal);

  const toggle = () => setValue(val => !val);
  return [value, toggle];
}