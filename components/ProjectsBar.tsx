import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";
import GridView from "./GridView";

interface ProjectsBarProps {
  projects:CompiledProjectData[];
  selectedProjectIndex?:number;
  onProjectSelected:(index:number)=>void;
  onCreateGrid:()=>void;
}

interface ProjectProps {
  project: CompiledProjectData;
  onSelect?: (index:number)=>void;
  index?: number;
}

const ProjectsBar: React.FC<ProjectsBarProps> = ({projects, onProjectSelected, onCreateGrid, selectedProjectIndex=0}) => {
  const [minimizedProjectsBar, setMinimizedProjectsBar] = useState(false);
  const minimizeProjectsBar = useCallback(() => setMinimizedProjectsBar(v => !v), []);

  if (selectedProjectIndex === -1) {
    selectedProjectIndex = 0;
  }

  return <aside className={"projects-bar " + (minimizedProjectsBar ? 'minimized' : '')}>
    <button onClick={minimizeProjectsBar} className="remove-project-bar-button">
      <FontAwesomeIcon icon={minimizedProjectsBar ? faAngleLeft : faAngleRight} />
    </button>
    <h2>Vos projets</h2>
    {
      projects.length > selectedProjectIndex
        ? <ProjectComponent onSelect={onProjectSelected} index={selectedProjectIndex} project={projects[selectedProjectIndex]} />
        : null
    }
    <button className="add-project" onClick={onCreateGrid}>
      <FontAwesomeIcon icon={faPlus} />
    </button>
    {projects.map((p,i) => {
      if (i == selectedProjectIndex) {
        return null;
      }
      return <ProjectComponent onSelect={onProjectSelected} index={i} key={p.name} project={p} />
    })}
  </aside>
};

const ProjectComponent: React.FC<ProjectProps> = ({project,index,onSelect}) => {
  const onClick = useCallback(() => onSelect?.(index!), [index, onSelect]);
  return <div className="project" onClick={onClick}>
    <span>{project.name}</span>
    <GridView uid={project.name} grid={project.grid} chart={project.chart}  />
  </div>
};

export default ProjectsBar;