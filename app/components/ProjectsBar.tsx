"use client";

import type React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";

const ProjectsBar: React.FC = () => {
  const [minimizedProjectsBar, setMinimizedProjectsBar] = useState(false);
  const minimizeProjectsBar = useCallback(() => setMinimizedProjectsBar((v) => !v), []);

  return <aside className={"projects-bar " + (minimizedProjectsBar ? 'minimized' : '')}>
    <button onClick={minimizeProjectsBar} className="remove-project-bar-button">
      <FontAwesomeIcon icon={minimizedProjectsBar ? faAngleLeft : faAngleRight} />
    </button>
    <h2>Vos projets</h2>
    <div className="project">
      <span>Project actuel</span>
      <div className="project-grid" />
    </div>
    <button className="add-project">
      <FontAwesomeIcon icon={faPlus} />
    </button>
  </aside>;
};

export default ProjectsBar;