import {
  Context,
  createContext,
  createEffect,
  createSignal,
  JSX,
  useContext,
} from "solid-js";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";

type FC<Props = {}> = (props: Props & { children?: any }) => JSX.Element;
const VisibilityCtx = createContext<VisibilityProviderValue | null>(null);

interface VisibilityProviderValue {
  setVisible: (visible: boolean) => void;
  visible: boolean;
}

// This should be mounted at the top level of your application, it is currently set to
// apply a CSS visibility value. If this is non-performant, this should be customized.
export const VisibilityProvider: FC<{ children: any }> = ({ children }) => {
  const [visible, setVisible] = createSignal(false);

  useNuiEvent<boolean>("setVisible", setVisible);

  // Handle pressing escape/backspace
  createEffect(() => {
    // Only attach listener when we are visible
    if (!visible()) return;
    const keyHandler = (e: KeyboardEvent) => {
      if (["Backspace", "Escape"].includes(e.code)) {
        if (!isEnvBrowser()) fetchNui("hideFrame");
        else setVisible(!visible());
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [visible()]);

  return (
    <VisibilityCtx.Provider
      value={{
        visible: visible(),
        setVisible,
      }}
    >
      <div
        style={{ height: "100%" }}
        class={`transition-all duration-500 transform ${
          !visible() && "opacity-0" // Simple fade out
        }`}
      >
        {children}
      </div>
    </VisibilityCtx.Provider>
  );
};

export const useVisibility = () =>
  useContext<VisibilityProviderValue>(
    VisibilityCtx as Context<VisibilityProviderValue>
  );
