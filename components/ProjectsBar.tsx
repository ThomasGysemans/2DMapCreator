import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";
import GridView from "./GridView";

interface ProjectsBarProps {
  projects:CompiledProjectData[];
  chart:Chart;
  selectedProjectIndex?:number;
  onProjectSelected: ((index: number) => void) | ((index:number)=>Promise<void>);
  onCreateGrid:()=>void;
}

interface ProjectProps {
  project: CompiledProjectData;
  chart:Chart;
  onSelect: (index: number)=>void;
  index: number;
  loadingIndex?:number;
}

const ProjectsBar: React.FC<ProjectsBarProps> = ({projects, chart, onProjectSelected, onCreateGrid, selectedProjectIndex=0}) => {
  const [loadingProjectIndex, setLoadingProjectIndex] = useState<number>(-1);
  const [minimizedProjectsBar, setMinimizedProjectsBar] = useState(false);
  const minimizeProjectsBar = useCallback(() => setMinimizedProjectsBar(v => !v), []);

  const onSelect = useCallback(async (index:number) => {
    setLoadingProjectIndex(index);
    try {
      await onProjectSelected?.(index);
    } catch (e) {
      console.warn("Project of index " + index + " couldn't be loaded.");
    } finally {
      setLoadingProjectIndex(-1);
    }
  }, [onProjectSelected]);

  if (selectedProjectIndex === -1) {
    selectedProjectIndex = 0;
  }

  return <div className={"projects-bar " + (minimizedProjectsBar ? "minimized" : "")}>
    <button onClick={minimizeProjectsBar} className="remove-project-bar-button">
      <FontAwesomeIcon icon={minimizedProjectsBar ? faAngleLeft : faAngleRight} />
    </button>
    <aside>
      <h2>Vos projets</h2>
      {
        projects.length > selectedProjectIndex
          ? <ProjectComponent onSelect={onProjectSelected} index={selectedProjectIndex} project={projects[selectedProjectIndex]} chart={chart} />
          : null
      }
      <button className="add-project" onClick={onCreateGrid}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      {projects.map((p, i) => {
        if (i == selectedProjectIndex) {
          return null;
        }
        return <ProjectComponent onSelect={onSelect} index={i} key={p.name} project={p} chart={chart} loadingIndex={loadingProjectIndex} />
      })}
    </aside>
  </div>
};

const ProjectComponent: React.FC<ProjectProps> = ({ project, chart, index, onSelect, loadingIndex = -1 }) => {
  const onClick = useCallback(() => { loadingIndex === -1 ? onSelect(index) : null; }, [index, onSelect, loadingIndex]);
  return <div className={"project" + (loadingIndex === index ? " loading-project" : (loadingIndex >= 0 ? " disabled-project" : ""))} onClick={onClick}>
    <span>{project.name}</span>
    <GridView uid={project.name} grid={project.grid} chart={chart}  />
  </div>
};

export default ProjectsBar;