"use client";

import "../styles/index.scss";

import { ChangeEvent, FormEvent, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import ProjectsBar from "../components/ProjectsBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsToDot, faCircleUser, faDiamond, faDownload, faDownLong, faEraser, faEyeDropper, faEyeDropperEmpty, faFileImport, faFill, faMagnifyingGlassMinus, faMagnifyingGlassPlus, faMapLocation, faPenFancy, faRightLong, faSave, faSquare, faSwatchbook } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState, useRef } from "react";
import { Grid } from "../components/Grid";
import { useAuth } from "../fireconfig/auth";
import useGrid from "../hooks/useGrid";
import ChartItem from "../components/ChartItem";
import downloadCSV from "../utils/downloadCSV";
import hexToRgb from "../utils/hexToRGB";
import readCSVContent from "../utils/readCSVContent";
import EditingTool from "../components/EditingTool";
import isLoggedIn from "../utils/isLoggedIn";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, firestore } from "../fireconfig/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import compileGridData from "../utils/compileGridData";
import initGrid from "../utils/initGrid";
import deepCopyOf from "../utils/deepCopyOf";
import saveProject from "../utils/saveProject";
import { faHandPointer, faImage } from "@fortawesome/free-regular-svg-icons";
import downloadPNG from "../utils/downloadPNG";
import createPNG from "../utils/createPNG";
import LoadingAnimation from "../components/LoadingAnimation";
import TeleportationItem from "../components/TeleportationItem";

const validateDimensions = (width:number, height:number) => {
  const max = 150;
  if (width <= 2 || width > max) {
    return `La largeur n'est pas valide. Minimum: 2 et maximum: ${max}.`;
  } else if (height <= 2 || height > max) {
    return `La hauteur n'est pas valide. Minimum: 2 et maximum: ${max}.`;
  }
  return null;
}

const Page = () => {
  const authState = useAuth();

  const [allProjects, setAllProjects] = useState<CompiledProjectData[]>([]);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(-1); // -1 if no project is selected
  const [loading, setLoading] = useState<boolean>(false);
  const createGridForm = useRef<HTMLFormElement>(null);
  const chartForm = useRef<HTMLFormElement>(null);
  const teleportationsForm = useRef<HTMLFormElement>(null);
  const dimensionsForm = useRef<HTMLFormElement>(null);
  const importCSVInput = useRef<HTMLInputElement>(null);
  const accountForm = useRef<HTMLFormElement>(null);
  const [askingToCreateANewGrid, setAskingToCreateANewGrid] = useState<boolean>(false); // to change to null in production
  const [gridName, setGridName] = useState<string|null>(null); // to change to null in production
  const [formError, setFormError] = useState<string>("");
  const [editingMod, setEditingMod] = useState<EditingMod>("default");
  const changeEditingTool = useCallback((newEditingTool:EditingMod) => setEditingMod(newEditingTool), []);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<Tab>("chart");
  const selectAccountTab = useCallback(() => {
    if (isLeftSidebarOpen) {
      if (selectedTab === "account") {
        return setIsLeftSidebarOpen(false);
      }
    }
    setSelectedTab("account");
    setIsLeftSidebarOpen(true);
  }, [selectedTab, isLeftSidebarOpen]);
  const selectChartTab = useCallback(() => {
    if (isLeftSidebarOpen) {
      if (selectedTab === "chart") {
        return setIsLeftSidebarOpen(false);
      }
    }
    setSelectedTab("chart");
    setIsLeftSidebarOpen(true);
  }, [selectedTab, isLeftSidebarOpen]);
  const selectTeleportationTab = useCallback(() => {
    if (isLeftSidebarOpen) {
      if (selectedTab === "teleportation") {
        return setIsLeftSidebarOpen(false);
      }
    }
    setSelectedTab("teleportation");
    setIsLeftSidebarOpen(true);
  }, [isLeftSidebarOpen, selectedTab]);

  // TODO: Undo/redo system
  // it won't work as expected because grid is also getting modified when index is in the past
  // the solution is to bring `undo` and `redo` in `useGrid`
  //const [registerState, { undo, redo }] = useRegistry(grid, setGrid);

  const [grid, setGrid, drawPixel, setDimensions] = useGrid(25, 25, -1);
  const [teleportations, setTeleportations] = useState<Teleportation[]>([]);
  const [chart, setChart] = useState<Chart>([{color: "#ffffff", x: true, hidden: false}]);
  const [color, setColor] = useState<number>(0);
  const [selectedPos, setSelectedPos] = useState<Pos|null>(null);
  const pickColor = useCallback((colorIndex: number) => setColor(colorIndex), []);
  const hideColor = useCallback((colorIndex: number) => setChart(c => c.map((value, i) => ({...value, hidden: colorIndex === i ? !value.hidden : value.hidden}))), []);
  const onPixelClicked = useCallback((pos: Pos, e:MouseEvent) => {
    if (editingMod === "pick") {
      // select the html ID instead
      // because selecting the grid according to the pos
      // makes the drag color feature impossible
      // as `grid` becomes a dependency of
      const index = (e.target as HTMLDivElement).getAttribute("data-chartindex");
      if (index) {
        const n = parseInt(index, 10);
        if (n === -1) {
          return;
        }
        setColor(n);
        setEditingMod("default");
      }
    } else if (editingMod === "selecting-pos") {
      const cell = (e.target as HTMLDivElement);
      if (cell) {
        const x = cell.dataset.posx;
        const y = cell.dataset.posy;
        if (x && y) {
          const pos = {
            x: parseInt(x, 10),
            y: parseInt(y, 10),
          };
          setSelectedPos(pos);
          setEditingMod("default");
        }
      }
    } else {
      drawPixel(pos, editingMod === "eraser" ? -1 : color, editingMod)
    }
  }, [drawPixel, editingMod, color]);
  const addNewColorToChart = useCallback(() => setChart(v => [...v, {color:"#ffffff",x:true,i:false,hidden:false}]), []);
  const addNewTeleportation = useCallback(() => setTeleportations(v => [...v, {map:"",targetX:0,targetY:0,movX:0,movY:0,color:0}]), []);

  const [pxSize, setPXSize] = useState<number>(15);
  const zoomIn = useCallback(() => setPXSize(v => v + 1), []);
  const zoomOut = useCallback(() => setPXSize(v => v === 0 ? v : v - 1), []);

  useEffect(() => {
    (async () => {
      if (isLoggedIn(authState)) { // the user just logged in
        const user = authState.user!;
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
          const projects: CompiledProjectData[] = data.projects.map(p => ({ ...p, grid: compileGridData(p.grid) }));
          if (projects.length > 0) {
            const firstProject = projects[0];
            setGrid(firstProject.grid);
            setAllProjects(projects);
          }
          setChart(data.chart);
          setTeleportations(data.teleportations ?? []);
        }
      }
    })();
  }, [authState, setChart, setGrid]);

  useEffect(() => {
    const handleEscapeKey = (e:KeyboardEvent) => {
      if (e.key === "Esc" || e.key === "Escape") {
        if (isLeftSidebarOpen) {
          setIsLeftSidebarOpen(false);
        }
      }
    };
    window.addEventListener("keyup", handleEscapeKey);
    return () => {
      window.removeEventListener("keyup", handleEscapeKey);
    };
  }, [isLeftSidebarOpen]);

  const uploadFile = useCallback(() => importCSVInput.current!.click(), []);
  const handleImportedFile = useCallback((e:ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] ?? null;
    if (uploadedFile) {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        const content = event.target!.result;
        if (typeof content !== "string") {
          throw new Error("Expected plain text as content for imported file.");
        }
        const result = readCSVContent(content);
        switch (result.type) {
          case "map": setGrid(result.result as Grid); break;
          case "chart": setChart(result.result as Chart); break;
          case "teleportations": setTeleportations(result.result as Teleportation[]); break;
        }
      });
      reader.readAsText(uploadedFile);
    }
  }, [setGrid]);

  const exportToCSV = useCallback(() => {
    const ANSIGrid: number[][] = [];
    const numColumns = grid[0].length;
    for (let y = 0; y < grid.length; y++) {
      ANSIGrid[y] = [];
      for (let x = 0; x < numColumns; x++) {
        ANSIGrid[y][x] = grid[y][x] ?? 0;
      }
    }
    let csv = "a0";
    for (let i = 1; i < numColumns; i++) csv += ",a" + i;
    csv += "\n";
    ANSIGrid.forEach((row) => csv += row.join(',') + "\n");
    downloadCSV(gridName!, csv);
  }, [grid, gridName]);

  const exportToPNG = useCallback(() => {
    if ((gridName === null && selectedProjectIndex === -1) || askingToCreateANewGrid) {
      return;
    }
    downloadPNG(createPNG(grid, chart), gridName!)
  }, [gridName, selectedProjectIndex, askingToCreateANewGrid, grid, chart]);

  const initApp = useCallback((e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createGridForm.current) {
      return;
    }
    const data = new FormData(createGridForm.current);
    const name = (data.get("name") as string).trim();
    if (name.length == 0 || name.length > 35) {
      return setFormError("Le nom de la grille n'est pas correcte.");
    }
    const width = parseInt(data.get("width") as string, 10);
    const height = parseInt(data.get("height") as string, 10);
    const validation = validateDimensions(width, height);
    if (validation != null) {
      return setFormError(validation);
    }
    setFormError("");
    setGridName(name);
    setAskingToCreateANewGrid(false);
    setAllProjects(p => {
      const newGrid = initGrid(width, height, -1);
      p.push({
        name,
        grid: newGrid,
        creationDate: new Date().getTime(),
        lastModifiedDate: new Date().getTime()
      });
      setSelectedProjectIndex(p.length-1);
      setGrid(newGrid);
      return deepCopyOf(p);
    });
  }, [setGrid]);

  const saveChart = useCallback(async (e?:FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const chartItems = Array.from(chartForm.current!.querySelectorAll(".chart-item")) as HTMLDivElement[];
    const newChart: Chart = [];
    for (let element of chartItems) {
      const colorInput = element.querySelector("input[type='text']") as HTMLInputElement;
      const xInput = element.querySelector("label.color-x input[type='checkbox']") as HTMLInputElement;
      newChart.push({color: colorInput.value, x: xInput.checked });
    }
    if (isLoggedIn(authState)) {
      setLoading(true);
      try {
        const user = authState.user!;
        const docRef = doc(firestore, "users", user.uid);
        await updateDoc(docRef, { chart: newChart });
      } catch (e) {
        console.warn("Cannot save the chart due to error '" + (e as any).code + "'. Skipping.");
      } finally {
        setLoading(false);
      }
    }
    setChart(c => newChart.map((value, index) => ({ ...value, hidden: c[index].hidden })));
  }, [authState]);

  const saveTeleportations = useCallback(async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const data = new FormData(teleportationsForm.current!);
    const entries = Array.from(data.entries());
    const newTeleportations: Teleportation[] = [];
    for (let i = 0; i < entries.length; i+=6) {
      newTeleportations.push({
        color: parseInt(entries[i][1] as string),
        map: entries[i + 1][1] as string,
        movX: parseInt(entries[i + 2][1] as string),
        movY: parseInt(entries[i + 3][1] as string),
        targetX: parseInt(entries[i + 4][1] as string),
        targetY: parseInt(entries[i + 5][1] as string),
      });
    }
    if (isLoggedIn(authState)) {
      setLoading(true);
      try {
        const user = authState.user!;
        const docRef = doc(firestore, "users", user.uid);
        await updateDoc(docRef, { teleportations: newTeleportations });
      } catch (e) {
        console.warn("Cannot save the teleportations due to error '" + (e as any).code + "'. Skipping.");
      } finally {
        setLoading(false);
      }
    }
    setTeleportations(newTeleportations);
    return newTeleportations;
  }, [authState]);

  const downloadChart = useCallback(async () => {
    await saveChart();
    setChart(c => {
      const lines = ["index,x,r,g,b"];
      for (let i = 0; i < c.length; i++) {
        lines.push(
          i + ',' + (c[i].x ? '1' : '0') + ',' + hexToRgb(c[i].color).join(',')
        );
      }
      downloadCSV("0-colors", lines.join('\n'));
      return c;
    });
  }, [saveChart]);

  const downloadTeleportations = useCallback(async () => {
    const saved = await saveTeleportations();
    const lines = ["color,map,movX,movY,x,y"];
    for (let i = 0; i < saved.length; i++) {
      lines.push(
        saved[i].color + ',' + saved[i].map + ',' + saved[i].movX + ',' + saved[i].movY + ',' + saved[i].targetX + ',' + saved[i].targetY
      );
    }
    downloadCSV("0-teleportations", lines.join('\n'));
  }, [saveTeleportations]);

  const onDimensionsChanged = useCallback((e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(dimensionsForm.current!);
    const width = parseInt(data.get("width") as string, 10);
    const height = parseInt(data.get("height") as string, 10);
    const validation = validateDimensions(width, height);
    if (validation != null) {
      return; // TODO: we ignore the error message for now
    }
    setDimensions(width, height);
  }, [setDimensions]);

  const login = useCallback(async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(accountForm.current!);
    const email = (data.get("email") as string).trim();
    const password = data.get("password") as string;
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return setFormError("Adresse email incorrecte");
    }
    if (password.length < 5 || password.length > 255) {
      return setFormError("Mot de passe invalide.");
    }
    setFormError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch(e) {
      // The user wants to create an account
      if ((e as any).code === "auth/user-not-found") {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = credential.user;
        const uid = user.uid;
        await setDoc(doc(firestore, "users", uid), {
          chart: [],
          projects: [],
          registrationDate: new Date().getTime()
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const leave = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Cannot sign out the user due to error '" + (e as any).code + "'. Skipping.");
    } finally {
      setLoading(false);
    }
  }, []);

  const save = async () => {
    try {
      setLoading(true);
      const updatedProjects = deepCopyOf(allProjects) as CompiledProjectData[];
      updatedProjects[selectedProjectIndex] = {
        ...updatedProjects[selectedProjectIndex],
        grid,
        lastModifiedDate: new Date().getTime(),
      };
      const savedProjects = updatedProjects.map(p => saveProject(p.name, p.grid, p.creationDate));
      if (isLoggedIn(authState)) {
        const user = authState.user!;
        const docRef = doc(firestore, "users", user.uid);
        await updateDoc(docRef, { chart: deepCopyOf(chart).map((v:ChartItemDesc) => { if (v.hidden !== undefined) delete v.hidden; return v; }), projects: savedProjects });
      }
      setAllProjects((all) => {
        all[selectedProjectIndex] = updatedProjects[selectedProjectIndex];
        return deepCopyOf(all);
      });
    } catch (e) {
      console.warn("Cannot save the projects due to error '" + (e as any).code + "'. Skipping.");
    } finally {
      setLoading(false);
    }
  };

  const onProjectSelected = async (index:number) => {
    if (index === selectedProjectIndex) {
      return;
    }
    if (selectedProjectIndex >= 0) {
      await save();
    }
    setGrid(allProjects[index].grid);
    setGridName(allProjects[index].name);
    setSelectedProjectIndex(index);
    setAskingToCreateANewGrid(false);
  };

  const createNewGrid = useCallback(() => {
    setSelectedProjectIndex(-1);
    setAskingToCreateANewGrid(true);
  }, []);

  const removeTeleportation = useCallback((index:number) => {
    setTeleportations(c => {
      c.splice(index,1);
      return deepCopyOf(c);
    });
  }, []);

  // TODO: the buttons inside the chart container are still focusable even though the container is hidden

  return <div className="page">
    <aside className="toolsbar">
      <button title="Votre compte" onClick={selectAccountTab}>
        <FontAwesomeIcon icon={faCircleUser} />
      </button>
      <button className="import-button" title="Importer un fichier CSV" onClick={uploadFile}>
        <input ref={importCSVInput} type="file" accept="text/csv, .csv" onChange={handleImportedFile} />
        <FontAwesomeIcon icon={faFileImport} />
      </button>
      <button title="Ouvrir la charte de couleurs" onClick={selectChartTab}>
        <FontAwesomeIcon icon={faSwatchbook} />
      </button>
      <button title="Ouvrir les passerelles" onClick={selectTeleportationTab}>
        <FontAwesomeIcon icon={faMapLocation} />
      </button>
      <button title="Exporter au format CSV" onClick={exportToCSV}>
        <FontAwesomeIcon icon={faDownload} />
      </button>
      <button title="Exporter au format PNG" onClick={exportToPNG}>
        <FontAwesomeIcon icon={faImage} />
      </button>
    </aside>
    {selectedTab === "account"
      ? <aside className={"left-sidebar container-account" + (isLeftSidebarOpen ? " open" : "")}>
        <h2>Votre compte</h2>
        {isLoggedIn(authState)
          ? <div>
            <p>You are logged in!!</p>
            <Button loading={loading} onClick={leave}>Se déconnecter</Button>
          </div>
          : <form ref={accountForm} onSubmit={login} className="login-form">
              <p>Te créer un compte peut être utile pour sauvegarder ton travail et pour y travailler sur une autre machine plus tard.</p>
              <Input type="email" label="Adresse mail" name="email" />
              <Input type="password" label="Mot de passe" name="password" />
              <Button loading={loading} type="submit">Connexion/Inscription</Button>
              <span className="formError">{formError}</span>
          </form>
        }
      </aside>
      : (selectedTab === "teleportation"
        ? <aside className={"left-sidebar container-teleportations" + (isLeftSidebarOpen ? " open" : "")}>
          <h2>Les passerelles entre les maps</h2>
          <p>Défini les cases qui peuvent servir de passerelle vers une autre carte. Défini le mouvement nécessaire pour y accéder et à quelle position le joueur apparaît sur la nouvelle carte.</p>
          <form ref={teleportationsForm} onSubmit={saveTeleportations}>
            {teleportations.map((teleportation, i) => 
              <TeleportationItem
                key={i + "-" + teleportation}
                index={i}
                teleportation={teleportation}
                maps={allProjects.map(v => v.name)}
                currentColorIndex={color}
                onTeleportationRemoved={removeTeleportation}
              />
            )}
            <Button secondary onClick={addNewTeleportation}>Ajouter une passerelle</Button>
            <Button type="submit" loading={loading}>Enregistrer les modifications</Button>
            <Button onClick={downloadTeleportations}>Télécharger le CSV</Button>
          </form>
        </aside>
        : <aside className={"left-sidebar container-chart" + (isLeftSidebarOpen ? " open" : "")}>
          <h2>Votre charte de couleurs</h2>
          <form ref={chartForm} onSubmit={saveChart}>
            {chart.map((color, i) =>
              <ChartItem
                key={i + "-" + color}
                n={i}
                color={color}
                onPick={pickColor}
                onHide={hideColor}
              />
            )}
            <Button secondary onClick={addNewColorToChart}>Ajouter une couleur</Button>
            <Button type="submit" loading={loading}>Enregistrer les modifications</Button>
            <Button onClick={downloadChart}>Télécharger la charte</Button>
          </form>
        </aside>
      )
    }
    <main>
      {(gridName === null && selectedProjectIndex === -1) || askingToCreateANewGrid
        ?
        <form ref={createGridForm} onSubmit={initApp}>
          <Input className="label-new-name" type="text" label="Nom de la nouvelle grille" name="name" required maxLength={35} />
          <Input className="label-width" type="number" label="Largeur" name="width" required />
          <Input className="label-height" type="number" label="Hauteur" name="height" required />
          <Button type="submit">Créer</Button>
          <span className="formError">{formError}</span>
        </form>
        :
        <div className="grid-container">
          <Grid pxSize={pxSize} uid="unique-id" grid={grid} chart={chart} onPixelClicked={onPixelClicked} />
          <div className="grid-sidebar">
            <EditingTool icon={faPenFancy} mode="default" enabled={editingMod === "default"} onClick={changeEditingTool} />
            <EditingTool icon={faSquare} mode="square" enabled={editingMod === "square"} onClick={changeEditingTool} />
            <EditingTool icon={faEraser} mode="eraser" enabled={editingMod === "eraser"} onClick={changeEditingTool} />
            <EditingTool icon={faDiamond} mode="circle" enabled={editingMod === "circle"} onClick={changeEditingTool} />
            <EditingTool icon={faRightLong} mode="line" enabled={editingMod === "line"} onClick={changeEditingTool} />
            <EditingTool icon={faDownLong} mode="vertical-line" enabled={editingMod === "vertical-line"} onClick={changeEditingTool} />
            <EditingTool icon={faFill} mode="fill" enabled={editingMod === "fill"} onClick={changeEditingTool} />
            <EditingTool icon={faHandPointer} mode="selecting-pos" enabled={editingMod === "selecting-pos"} onClick={changeEditingTool} />
            <EditingTool icon={faEyeDropperEmpty} mode="pick" enabled={editingMod === "pick"} onClick={changeEditingTool} />
            <button onClick={zoomIn}><FontAwesomeIcon icon={faMagnifyingGlassPlus} /></button>
            <button onClick={save} disabled={loading}>
              {loading
                ? <LoadingAnimation opposite />
                : <FontAwesomeIcon icon={faSave} />
              }
            </button>
            <button onClick={zoomOut}><FontAwesomeIcon icon={faMagnifyingGlassMinus} /></button>
            <p className="selected-pos">
              {selectedPos != null
                ? `you selected (${selectedPos.x};${selectedPos.y})`
                : null
              }
            </p>
          </div>
          <form ref={dimensionsForm} onSubmit={onDimensionsChanged} className="grid-dimensions-settings">
            <Input label="Largeur" type="number" name="width" />
            <Input label="Hauteur" type="number" name="height" />
            <Button type="submit"><FontAwesomeIcon icon={faArrowsToDot} /></Button>
          </form>
        </div>
      }
    </main>
    <ProjectsBar
      selectedProjectIndex={selectedProjectIndex}
      projects={allProjects}
      chart={chart}
      onProjectSelected={onProjectSelected}
      onCreateGrid={createNewGrid}
    />
  </div>
};

export default Page;