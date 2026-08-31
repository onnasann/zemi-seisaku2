import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { areaConfig } from "../data/areas";

function Legend({ data = [], selectedAreas, toggleArea }) {
    return (
        <Paper
            elevation={0}
            sx={{
                position: "absolute",
                top: 16,
                left: 16,
                p: 1.5,
                bgcolor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                maxWidth: 200,
                zIndex: 10
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    display: "block",
                    mb: 0.8
                }}
            >
                エリア別（複数選択可）
            </Typography>

            <Stack spacing={0.5}>
                {Object.entries(areaConfig).map(([areaName, config]) => {
                    const count = data.filter(
                        (club) => (club.normalizedArea || club.area) === areaName
                    ).length;
                    const isSelected = selectedAreas.includes(areaName);

                    return (
                        <Box
                            key={areaName}
                            onClick={() => toggleArea(areaName)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 1,
                                py: 0.4,
                                borderRadius: 1,
                                bgcolor: isSelected ? "#f8fafc" : "transparent",
                                opacity: isSelected ? 1 : 0.35,
                                cursor: "pointer",
                                "&:hover": { bgcolor: "#f1f5f9", opacity: 1 }
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        bgcolor: config.color
                                    }}
                                />
                                <Typography variant="caption" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                    {config.name}
                                </Typography>
                            </Box>

                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: "monospace",
                                    color: "#64748b",
                                    fontWeight: 700
                                }}
                            >
                                {count}
                            </Typography>
                        </Box>
                    );
                })}
            </Stack>
        </Paper>
    );
}

export default Legend;
