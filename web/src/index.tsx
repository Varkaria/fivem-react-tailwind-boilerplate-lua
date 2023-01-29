import "uno.css";
import { render } from "solid-js/web";

import App from "./app";
import { VisibilityProvider } from "./providers/VisibilityProvider";

render(
  () => (
    <VisibilityProvider>
      <App />
    </VisibilityProvider>
  ),
  document.getElementById("root") as HTMLElement
);
