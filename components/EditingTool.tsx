import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";

interface Props {
  mode:EditingMod;
  enabled:boolean;
  icon:IconDefinition;
  onClick: (selectedMod: EditingMod) => void;
}

const EditingTool: React.FC<Props> = ({mode, icon, enabled, onClick}) => {
  const handleClick = useCallback(() => onClick(mode), [onClick, mode]);

  return <button className={enabled ? 'enabled' : ''} onClick={handleClick}>
    <FontAwesomeIcon icon={icon} />
  </button>
}

export default EditingTool;