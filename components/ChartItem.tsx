"use client";

import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEyeDropperEmpty } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

interface Props {
  n:number;
  color:string; // hexadecimal
  onPick:(colorIndex:number)=>void;
}

const isValidColorFormat = (color:string) => {
  return /^#[a-f\d]{6}$/i.test(color);
};

const ChartItem: React.FC<Props> = ({n, color, onPick}) => {
  const [isValidColor, setIsValidColor] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<string>(color);
  const onColorPicked = useCallback(() => onPick(n), [n, onPick]);
  const handleSelectedColor = useCallback((input:ChangeEvent<HTMLInputElement>) => {
    const value = input.target.value;
    setIsValidColor(isValidColorFormat(value));
    setSelectedColor(input.target.value)
  }, []);

  return <div className="chart-item">
    <span>{n} - </span>
    <input className={!isValidColor ? 'unvalid-color' : ''} type="text" name={"name-" + n} value={selectedColor} onChange={handleSelectedColor} />
    <input type="color" value={(isValidColor ? selectedColor : "#000000")} onChange={handleSelectedColor} />
    <Button onClick={onColorPicked}><FontAwesomeIcon icon={faEyeDropperEmpty} /></Button>
  </div>;
};

export default ChartItem;