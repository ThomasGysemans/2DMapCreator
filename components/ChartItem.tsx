"use client";

import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEyeDropperEmpty } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import Button from "./Button";

interface Props {
  n:number;
  color:ChartItemDesc;
  onPick:(colorIndex:number)=>void;
  onHide:(colorIndex:number)=>void;
}

const isValidColorFormat = (color:string) => {
  return /^#[a-f\d]{6}$/i.test(color);
};

const ChartItem: React.FC<Props> = ({n, color, onPick, onHide}) => {
  const [isValidColor, setIsValidColor] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<string>(color.color);
  const [hidden, setHidden] = useState<boolean>(false);
  const [isX, setIsX] = useState<boolean>(color.x);
  const onColorPicked = useCallback(() => onPick(n), [n, onPick]);
  const hide = useCallback(() => { onHide(n); setHidden(c=>!c); }, [onHide, n]);

  const handleSelectedColor = useCallback((input:ChangeEvent<HTMLInputElement>) => {
    const value = input.target.value;
    setIsValidColor(isValidColorFormat(value));
    setSelectedColor(input.target.value)
  }, []);

  const handleX = useCallback((input:ChangeEvent<HTMLInputElement>) => {
    const value = input.target.checked;
    setIsX(value);
  }, []);


  return <div className="chart-item">
    <span>{n} - </span>
    <input className={!isValidColor ? 'unvalid-color' : ''} type="text" name={"name-" + n} value={selectedColor} onChange={handleSelectedColor} />
    <input type="color" value={(isValidColor ? selectedColor : "#000000")} onChange={handleSelectedColor} />
    <label className="color-x">
      <i>x</i>
      <input type="checkbox" name={"color-x-" + n} checked={isX} onChange={handleX} />
    </label>
    <Button onClick={onColorPicked}><FontAwesomeIcon icon={faEyeDropperEmpty} /></Button>
    <button type="button" className="eye" onClick={hide}>
      <FontAwesomeIcon icon={hidden ? faEyeSlash : faEye} />
    </button>
  </div>;
};

export default ChartItem;