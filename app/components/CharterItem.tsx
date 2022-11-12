"use client";

import type React from "react";
import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEyeDropperEmpty } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

interface Props {
  n:number;
  color:string; // hexadecimal
  onPick:(color:string)=>void;
}

const CharterItem: React.FC<Props> = ({n, color, onPick}) => {
  const [selectedColor, setSelectedColor] = useState<string>(color);
  const onColorPicked = useCallback(() => onPick(selectedColor), [selectedColor, onPick]);
  const handleSelectedColor = useCallback((input:ChangeEvent<HTMLInputElement>) => setSelectedColor(input.target.value), []);

  return <div className="charter-item">
    <span>{n} - </span>
    <input type="text" name={"name-" + n} value={selectedColor} onChange={handleSelectedColor} />
    <input type="color" value={selectedColor} onChange={handleSelectedColor} />
    <Button onClick={onColorPicked}><FontAwesomeIcon icon={faEyeDropperEmpty} /></Button>
  </div>;
};

export default CharterItem;