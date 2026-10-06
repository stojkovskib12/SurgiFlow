import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./app/AppWrapper/AppWrapper.logic";
import "./styles.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWrapper isStandaloneApp baseRouteName="" />
  </React.StrictMode>,
);
