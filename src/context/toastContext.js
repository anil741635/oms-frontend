import { createContext } from "react";

// Split into its own plain module (not .jsx) so ToastProvider.jsx only
// exports a component — keeps React Fast Refresh happy.
export const ToastContext = createContext(null);
