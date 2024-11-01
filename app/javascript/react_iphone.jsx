import React, {useEffect, useState} from "react";
import { createRoot } from "react-dom/client";

function IPhone() {
  const [catalogData, setCatalogData] = useState(null)

  useEffect(() => {
    const dataJSON = document.getElementById('catalog-data').textContent
    const data = JSON.parse(dataJSON)

    setCatalogData(data)
  }, [])

  return (<div>
    <div className="text-4xl">Hello</div>
  </div>)
}

document.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(
    document.body.appendChild(document.createElement("div"))
  );
  root.render(<IPhone />);
});
