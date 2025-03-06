declare global {
  interface Window {
    bfsOpen: boolean;
    bfsCallback: () => void;
    setBFScolor: (color: string) => void;
  }
}

export {};
