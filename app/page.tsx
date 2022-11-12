"use client";

import "./styles/index.scss";

import type { NextPage } from "next";
import type { FormEvent } from "react";
import Input from "./components/Input";
import Button from "./components/Button";
import ProjectsBar from "./components/ProjectsBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faFileImport, faRedo, faSwatchbook, faTerminal, faUndo } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState, useRef } from "react";
import { Grid } from "./components/Grid";
import useGrid from "./hooks/useGrid";
import hexToANSI from "./utils/hexToANSI";
import CharterItem from "./components/CharterItem";

const Page: NextPage = () => {
  const createGridForm = useRef<HTMLFormElement>(null);
  const charterForm = useRef<HTMLFormElement>(null);
  const [gridName, setGridName] = useState<string>("Grille actuelle");
  /* use theses lines on production
  const [gridWidth, setGridWidth] = useState<number>(1); // invalid values for width and height, it's normal
  const [gridHeight, setGridHeight] = useState<number>(1);
  */
  const [gridWidth, setGridWidth] = useState<number>(25);
  const [gridHeight, setGridHeight] = useState<number>(25);
  const [formError, setFormError] = useState<string>("");

  // Undo/redo system
  // it won't work as expected because grid is also getting modified when index is in the past
  // the solution is to bring `undo` and `redo` in `useGrid`
  //const [registerState, { undo, redo }] = useRegistry(grid, setGrid);

  const [grid, setGrid, drawPixel] = useGrid(25, 25, null);
  const [charter, setCharter] = useState<string[]>(["#ffffff"]);
  const [color, setColor] = useState<string>("#0000ff");
  const [isCharterOpen, setIsCharterOpen] = useState<boolean>(false);
  const onPixelClicked = useCallback((pos:Pos) => drawPixel(pos, color), [drawPixel, color]);
  const pickColor = useCallback((color:string) => setColor(color), []);
  const toggleCharterContainer = useCallback(() => setIsCharterOpen(v => !v), []);
  const addNewColorToCharter = useCallback(() => setCharter(v => [...v, "#ffffff"]), []);

  const exportToCSV = useCallback(() => {
    const ANSIGrid: string[][] = [];
    const numColumns = grid[0].length;
    for (let y = 0; y < grid.length; y++) {
      ANSIGrid[y] = [];
      for (let x = 0; x < grid[y].length; x++) {
        ANSIGrid[y][x] = hexToANSI(grid[y][x] ?? 'ffffff', false);
      }
    }
    let csv = "d0,d1"; // metadata
    for (let i = 0; i < numColumns; i++) csv += ",a" + i;
    ANSIGrid.forEach((row) => csv += "0,0," + row.join(',') + "\n");
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    a.target = '_blank';
    a.download = gridName + '.csv';
    a.click();  
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
    if (width <= 2 || width > 100) {
      return setFormError("La largeur n'est pas valide. Minimum: 2 et maximum: 1000.");
    }
    const height = parseInt(data.get("height") as string, 10);
    if (height <= 2 || height > 100) {
      return setFormError("La hauteur n'est pas valide. Minimum: 2 et maximum: 1000.");
    }
    setFormError("");
    setGridName(name);
    setGridWidth(width);
    setGridHeight(height);
  }, []);

  const onCharterChanged = useCallback((e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Array.from(new FormData(charterForm.current!).entries());
    setCharter(() => {
      const newCharter: string[] = [];
      for (let i = 0; i < data.length; i++) {
        newCharter[i] = data[i][1].toString();
      }
      return newCharter;
    });
  }, []);

  return <div className="page">
    <aside className="toolsbar">
      <button title="Se connecter">
        <FontAwesomeIcon icon={faCircleUser} />
      </button>
      <button title="Importer un fichier CSV">
        <FontAwesomeIcon icon={faFileImport} />
      </button>
      <button title="Ouvrir la charte de couleurs" onClick={toggleCharterContainer}>
        <FontAwesomeIcon icon={faSwatchbook} />
      </button>
      <button title="Exporter au format CSV" onClick={exportToCSV}>
        <FontAwesomeIcon icon={faTerminal} />
      </button>
    </aside>
    <aside className={"container-charter" + (isCharterOpen ? " open" : "")}>
      <h2>Votre charte de couleurs</h2>
      <form ref={charterForm} onSubmit={onCharterChanged}>
        {charter.map((color, i) =>
          <CharterItem
            key={i + "-" + color}
            n={i}
            color={color}
            onPick={pickColor}
          />
        )}
        <Button secondary onClick={addNewColorToCharter}>Ajouter une couleur</Button>
        <Button type="submit">Enregistrer les modifications</Button>
      </form>
    </aside>
    <main>
      {gridWidth == 0
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
          <Grid uid="unique-id" grid={grid} onPixelClicked={onPixelClicked} />
          <div className="grid-sidebar">
            <button>
              <FontAwesomeIcon icon={faUndo} />
              Undo
            </button>
            <button>
              <FontAwesomeIcon icon={faRedo} />
              Redo
            </button>
          </div>
        </div>
      }
    </main>
    <ProjectsBar />
  </div>
};

export default Page;