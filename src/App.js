import React, { useEffect, useState } from "react";
import "./App.css";

import { IndexContext } from "./IndexContext";

import Interface from "./components/Interface";

function App() {
  const [value, setValue] = useState([0]);

  return (
    <IndexContext.Provider value = {{value, setValue}}>
      <Interface />
    </IndexContext.Provider>
  );
}

export default App;
