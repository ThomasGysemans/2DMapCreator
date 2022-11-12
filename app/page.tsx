"use client";

import "../styles/index.scss";

import type { NextPage } from "next";
import type { ChangeEvent, FormEvent } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import ProjectsBar from "../components/ProjectsBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsToDot, faCircleUser, faDiamond, faDownload, faFileImport, faPenFancy, faSquare, faSwatchbook } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState, useRef } from "react";
import { Grid } from "../components/Grid";
import useGrid from "../hooks/useGrid";
import ChartItem from "../components/ChartItem";
import downloadCSV from "../utils/downloadCSV";
import hexToRgb from "../utils/hexToRGB";
import readCSVContent from "../utils/readCSVContent";
import EditingTool from "../components/EditingTool";

const validateDimensions = (width:number, height:number) => {
  if (width <= 2 || width > 100) {
    return "La largeur n'est pas valide. Minimum: 2 et maximum: 1000.";
  } else if (height <= 2 || height > 100) {
    return "La hauteur n'est pas valide. Minimum: 2 et maximum: 1000.";
  }
  return null;
}

const Page: NextPage = () => {
  const createGridForm = useRef<HTMLFormElement>(null);
  const chartForm = useRef<HTMLFormElement>(null);
  const dimensionsForm = useRef<HTMLFormElement>(null);
  const importCSVInput = useRef<HTMLInputElement>(null);
  const [gridName, setGridName] = useState<string|null>("Grille actuelle"); // to change to null in production
  const [formError, setFormError] = useState<string>("");
  const [editingMod, setEditingMod] = useState<EditingMod>("default");
  const changeEditingTool = useCallback((newEditingTool:EditingMod) => setEditingMod(newEditingTool), []);

  // TODO: Undo/redo system
  // it won't work as expected because grid is also getting modified when index is in the past
  // the solution is to bring `undo` and `redo` in `useGrid`
  //const [registerState, { undo, redo }] = useRegistry(grid, setGrid);

  const [grid, setGrid, drawPixel, setDimensions] = useGrid(25, 25, null);
  const [chart, setChart] = useState<string[]>(["#ffffff"]);
  const [color, setColor] = useState<string>("#ffffff");
  const [isChartOpen, setIsChartOpen] = useState<boolean>(false);
  const onPixelClicked = useCallback((pos: Pos) => drawPixel(pos, chart.findIndex(chartColor => color === chartColor), editingMod), [drawPixel, editingMod, chart, color]);
  const pickColor = useCallback((colorIndex: number) => setColor(chart[colorIndex]), [chart]);
  const toggleChartContainer = useCallback(() => setIsChartOpen(v => !v), []);
  const addNewColorToChart = useCallback(() => setChart(v => [...v, "#ffffff"]), []);

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
        if (result.type === "map") {
          setGrid(result.result as Grid);
        } else {
          setChart(result.result as string[]);
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
    let csv = "d0,d1"; // metadata
    for (let i = 0; i < numColumns; i++) csv += ",a" + i;
    csv += "\n";
    ANSIGrid.forEach((row) => csv += "0,0," + row.join(',') + "\n");
    downloadCSV(gridName!, csv);
  }, [grid, gridName]);

  const createGrid = useCallback((e:FormEvent<HTMLFormElement>) => {
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
    setDimensions(width, height);
  }, [setDimensions]);

  const saveChart = useCallback((e?:FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const data = Array.from(new FormData(chartForm.current!).entries());
    setChart(() => {
      const newChart: string[] = [];
      for (let i = 0; i < data.length; i++) {
        newChart[i] = data[i][1].toString();
      }
      return newChart;
    });
  }, []);

  const downloadChart = useCallback(() => {
    saveChart();
    let csv = "index,r,g,b\n";
    for (let i = 0; i < chart.length; i++) {
      csv += i + ",";
      csv += hexToRgb(chart[i]).join(',') + "\n";
    }
    downloadCSV("0-colors", csv);
  }, [saveChart, chart]);

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

  // TODO: the buttons inside the chart container are still focusable even though the container is hidden

  return <div className="page">
    <aside className="toolsbar">
      <button title="Se connecter">
        <FontAwesomeIcon icon={faCircleUser} />
      </button>
      <button className="import-button" title="Importer un fichier CSV" onClick={uploadFile}>
        <input ref={importCSVInput} type="file" accept="text/csv, .csv" onChange={handleImportedFile} />
        <FontAwesomeIcon icon={faFileImport} />
      </button>
      <button title="Ouvrir la charte de couleurs" onClick={toggleChartContainer}>
        <FontAwesomeIcon icon={faSwatchbook} />
      </button>
      <button title="Exporter au format CSV" onClick={exportToCSV}>
        <FontAwesomeIcon icon={faDownload} />
      </button>
    </aside>
    <aside className={"container-chart" + (isChartOpen ? " open" : "")}>
      <h2>Votre charte de couleurs</h2>
      <form ref={chartForm} onSubmit={saveChart}>
        {chart.map((color, i) =>
          <ChartItem
            key={i + "-" + color}
            n={i}
            color={color}
            onPick={pickColor}
          />
        )}
        <Button secondary onClick={addNewColorToChart}>Ajouter une couleur</Button>
        <Button type="submit">Enregistrer les modifications</Button>
        <Button onClick={downloadChart}>Télécharger la charte</Button>
      </form>
    </aside>
    <main>
      {gridName === null
        ?
        <form ref={createGridForm} onSubmit={createGrid}>
          <Input className="label-new-name" type="text" label="Nom de la nouvelle grille" name="name" required maxLength={35} />
          <Input className="label-width" type="number" label="Largeur" name="width" required />
          <Input className="label-height" type="number" label="Hauteur" name="height" required />
          <Button type="submit">Créer</Button>
          <span className="formError">{formError}</span>
        </form>
        :
        <div className="grid-container">
          <Grid uid="unique-id" grid={grid} chart={chart} onPixelClicked={onPixelClicked} />
          <div className="grid-sidebar">
            <EditingTool icon={faPenFancy} mode="default" enabled={editingMod === "default"} onClick={changeEditingTool} />
            <EditingTool icon={faSquare} mode="square" enabled={editingMod === "square"} onClick={changeEditingTool} />
            <EditingTool icon={faDiamond} mode="circle" enabled={editingMod === "circle"} onClick={changeEditingTool} />
          </div>
          <form ref={dimensionsForm} onSubmit={onDimensionsChanged} className="grid-dimensions-settings">
            <Input label="Largeur" type="number" name="width" />
            <Input label="Hauteur" type="number" name="height" />
            <Button type="submit"><FontAwesomeIcon icon={faArrowsToDot} /></Button>
          </form>
        </div>
      }
    </main>
    <ProjectsBar />
  </div>
};

export default Page;