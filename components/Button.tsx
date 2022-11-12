import type React from "react";
import type { MouseEventHandler } from "react";

interface Props {
  secondary?:boolean;
  type?:"submit"|"button";
  children: React.ReactNode;
  onClick?:MouseEventHandler<HTMLButtonElement>;
}

const Input: React.FC<Props> = ({ secondary=false, type="button", children, onClick }) => {
  return <button type={type} onClick={onClick} className={secondary ? "button-secondary" : "button-primary"}>
    {children}
  </button>
};

export default Input;