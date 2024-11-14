import React from "react";
import {createRoot} from "react-dom/client";
import {IPhoneShow} from "./react/components/IPhoneShow"

document.addEventListener("turbo:load", () => {
  const dataJSON = document.getElementById('catalog-data').textContent
  const data = JSON.parse(dataJSON)

  const root = createRoot(document.getElementById("root"))
  root.render(<IPhoneShow catalogData={data}/>);
});

