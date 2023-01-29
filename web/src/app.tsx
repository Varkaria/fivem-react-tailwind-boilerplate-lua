import type { Component } from "solid-js";
import { useNuiEvent } from "./hooks/useNuiEvent";
import { debugData } from "./utils/debugData";

const App: Component = () => {
  debugData([
    {
      action: "setVisible",
      data: true,
    },
  ]);
  useNuiEvent("lamo", () => {});
  return <p class="text-4xl text-green-700 text-center py-20">It Worked!!!</p>;
};

export default App;
