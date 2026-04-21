import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#F08A2A" },
    secondary: { main: "#D6D0C7" },
    background: {
      default: "#050708",
      paper: "#111416",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
});