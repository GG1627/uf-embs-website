import React, { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // 'success', 'error', 'warning', 'info'
    customColor: null, // For custom colors
  });

  // Enhanced showSnackbar function with options
  const showSnackbar = (message, options = {}) => {
    const { severity = "info", customColor = null } = options;

    setSnackbar({
      open: true,
      message,
      severity,
      customColor,
    });
  };

  // Simplified version that still works with old syntax
  const showSimpleSnackbar = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
      customColor: null,
    });
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Get custom styles based on custom color or default severity
  const getAlertStyles = () => {
    if (snackbar.customColor) {
      return {
        backgroundColor: snackbar.customColor,
        color: "#fff",
        "& .MuiAlert-icon": {
          color: "#fff",
        },
        "& .MuiAlert-action": {
          "& .MuiIconButton-root": {
            color: "#fff",
          },
        },
        width: "100%",
      };
    }
    return { width: "100%" };
  };

  const value = {
    showSnackbar,
    showSimpleSnackbar, // Keep the old simple version for backward compatibility
    hideSnackbar,
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 5000000 }}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbar.customColor ? "info" : snackbar.severity} // Use 'info' as base when custom color
          sx={getAlertStyles()}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
