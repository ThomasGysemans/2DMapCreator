import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";

interface Props {
  index: number;
  teleportation: Teleportation;
  maps:String[];
  currentColorIndex: number;
  onTeleportationRemoved: (index:number) => void;
}

const TeleportationItem: React.FC<Props> = ({ index, teleportation, maps, currentColorIndex, onTeleportationRemoved }) => {
  const [colorIndex, setColorIndex] = useState<number>(teleportation.color);
  const removeTeleportation = useCallback(() => onTeleportationRemoved(index), [onTeleportationRemoved, index]);
  const handleColorIndex = useCallback((e:ChangeEvent<HTMLInputElement>) => setColorIndex(parseInt(e.target!.value)), []);
  const useCurrentColor = useCallback(() => setColorIndex(currentColorIndex), [currentColorIndex]);

  return <div className="teleportation-item">
    <div>
      <span>{index} - </span>
      <input value={colorIndex} onChange={handleColorIndex} type="number" min="0" name="color-index" placeholder="couleur" />
      <button type="button" onClick={useCurrentColor}>
        <FontAwesomeIcon icon={faCrosshairs} />
      </button>
      <select defaultValue={teleportation.map} name="map" placeholder="map">
        {maps.map(name => {
          return <option value={name as any} key={name as any}>{name}</option>
        })}
      </select>
    </div>
    <table>
      <tbody>
        <tr>
          <th>movX =</th>
          <td>
            <select defaultValue={teleportation.movX} name="movX">
              <option value="-1">Vers la gauche</option>
              <option value="0">Aucun</option>
              <option value="1">Vers la droite</option>
            </select>
          </td>
        </tr>
        <tr>
          <th>movY =</th>
          <td>
            <select defaultValue={teleportation.movY} name="movY">
              <option value="-1">Vers le haut</option>
              <option value="0">Aucun</option>
              <option value="1">Vers le bas</option>
            </select>
          </td>
        </tr>
        <tr>
          <th>target =</th>
          <td>
            <input defaultValue={teleportation.targetX} type="number" min="0" placeholder="x" name="targetX" />
            <input defaultValue={teleportation.targetY} type="number" min="0" placeholder="y" name="targetY" />
          </td>
        </tr>
        <tr>
          <th>
            <button type="button" onClick={removeTeleportation}>Retirer</button>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
};

export default TeleportationItem;