import { useCallback, useState } from "react";

type useRegistryHook = [
  (grid:Grid) => Grid,
  {
    undo: () => void; redo: () => void,
    canUndo: () => boolean,
    canRedo: () => boolean,
  }
];

const deepCopyOf = (val:any) => JSON.parse(JSON.stringify(val));

const useRegistry = (initialGrid: Grid, applier: (grid:Grid) => void): useRegistryHook => {
  const [states, setStates] = useState<Grid[]>([deepCopyOf(initialGrid)]);
  const [index, setIndex] = useState<number>(0);

  const registerState = useCallback((grid:Grid) => {
    const copy = deepCopyOf(grid);
    setStates(v => {
      if (index < v.length - 1) {
        v = v.slice(0, index + 1);
      }
      console.log("index =", index + 1);
      v.push(copy);
      console.log("v =", v);
      setIndex(i => ++i);
      return deepCopyOf(v);
    });
    return copy;
  }, [index]);

  const canUndo = useCallback(() => index > 0, [index]);
  const canRedo = useCallback(() => index + 1 < states.length, [index, states.length]);

  const undo = useCallback(() => {
    if (canUndo()) {
      setIndex(i => {
        applier(states[i - 1]);
        console.log("Undoing...", i - 1);
        return i - 1;
      });
    } else {
      console.log("can't undo");
    }
  }, [states, applier, canUndo]);

  const redo = useCallback(() => {
    if (canRedo()) {
      setIndex(i => {
        applier(states[i + 1]);
        console.log("Redoing...", i + 1);
        return i + 1;
      });
    } else {
      console.log("can't redo");
    }
  }, [states, applier, canRedo]);

  return [registerState, {undo, redo, canUndo, canRedo}];
};

export default useRegistry;