import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#2563eb", // Royal Blue
            light: "#3b82f6",
            dark: "#1d4ed8",
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#059669", // Emerald
            light: "#10b981",
            dark: "#047857",
            contrastText: "#ffffff"
        },
        background: {
            default: "#f8fafc", // Very soft light gray
            paper: "#ffffff"
        },
        text: {
            primary: "#1e293b",
            secondary: "#64748b"
        },
        divider: "#e2e8f0",
        action: {
            hover: "#f1f5f9",
            selected: "#e0f2fe"
        }
    },
    typography: {
        fontFamily: [
            '"Plus Jakarta Sans"',
            '"Inter"',
            '"Noto Sans JP"',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            'sans-serif'
        ].join(','),
        h4: {
            fontWeight: 700,
            color: "#0f172a"
        },
        h5: {
            fontWeight: 700,
            color: "#0f172a"
        },
        h6: {
            fontWeight: 700,
            color: "#0f172a"
        },
        subtitle1: {
            fontWeight: 600
        },
        subtitle2: {
            fontWeight: 600
        },
        button: {
            textTransform: "none",
            fontWeight: 600
        }
    },
    shape: {
        borderRadius: 10
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#f8fafc",
                    color: "#1e293b"
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none"
                    }
                },
                containedPrimary: {
                    backgroundColor: "#2563eb",
                    "&:hover": {
                        backgroundColor: "#1d4ed8"
                    }
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 6
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                        backgroundColor: "#ffffff",
                        "& fieldset": {
                            borderColor: "#cbd5e1"
                        },
                        "&:hover fieldset": {
                            borderColor: "#94a3b8"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#2563eb"
                        }
                    }
                }
            }
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    color: "#2563eb"
                },
                thumb: {
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                    "&:hover, &.Mui-focusVisible": {
                        boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)"
                    }
                }
            }
        }
    }
});
