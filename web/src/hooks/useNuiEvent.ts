import { createEffect, createSignal } from "solid-js";
import { noop } from "../utils/misc";

interface NuiMessageData<T = unknown> {
  action: string;
  data: T;
}

interface MutableRefObject<T> {
  current: T;
}

type NuiHandlerSignature<T> = (data: T) => void;

/**
 * A hook that manage events listeners for receiving data from the client scripts
 * @param action The specific `action` that should be listened for.
 * @param handler The callback function that will handle data relayed by this hook
 *
 * @example
 * useNuiEvent<{visibility: true, wasVisible: 'something'}>('setVisible', (data) => {
 *   // whatever logic you want
 * })
 *
 **/

export const useNuiEvent = <T = any>(
  action: string,
  handler: (data: T) => void
) => {
  let savedHandler: MutableRefObject<NuiHandlerSignature<T>> = {
    current: noop,
  };

  // Make sure we handle for a reactive handler
  createEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  createEffect(() => {
    const eventListener = (event: MessageEvent<NuiMessageData<T>>) => {
      const { action: eventAction, data } = event.data;

      if (savedHandler.current) {
        if (eventAction === action) {
          savedHandler.current(data);
        }
      }
    };

    window.addEventListener("message", eventListener);
    // Remove Event Listener on component cleanup
    return () => window.removeEventListener("message", eventListener);
  }, [action]);
};
