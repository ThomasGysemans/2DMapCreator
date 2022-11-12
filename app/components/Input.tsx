import type React from "react";

interface Props {
  label:string;
  name:string;
  type:"text"|"number";
  className?:string;
  maxLength?:number;
  required?:boolean;
}

const Input: React.FC<Props> = ({label, name, type, className, maxLength, required}) => {
  return <label className={className}>
    {label}
    <input type={type} name={name} autoComplete="off" maxLength={maxLength} required={required} />
  </label>
};

export default Input;