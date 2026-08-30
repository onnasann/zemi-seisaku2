import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { SoccerBallIcon, HelpIcon, RefreshIcon } from "./Icons";

function Header({
    totalClubs,
    totalPlayers,
    avgPower,
    onOpenGuide,
    onResetFilters,
    isFiltered
}) {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: "#ffffff",
                borderBottom: "1px solid #e2e8f0",
                color: "#1e293b",
                zIndex: 1100
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: "space-between",
                    py: 1,
                    px: { xs: 2, md: 4 },
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >
                {/* ロゴ & タイトル */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "10px",
                            bgcolor: "#2563eb",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <SoccerBallIcon sx={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                        <Typography
                            variant="h6"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                color: "#0f172a",
                                lineHeight: 1.2,
                                fontSize: { xs: "1.1rem", sm: "1.25rem" }
                            }}
                        >
                            最強クラブ分析
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#64748b",
                                display: { xs: "none", sm: "block" },
                                fontWeight: 500
                            }}
                        >
                            チームパワーと選手数によるコスパ分析
                        </Typography>
                    </Box>
                </Box>

                {/* 統計バッジ & アクション */}
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                    {totalClubs > 0 && (
                        <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
                            <Chip
                                label={`クラブ数: ${totalClubs}`}
                                size="small"
                                sx={{
                                    bgcolor: "#f1f5f9",
                                    color: "#475569",
                                    fontWeight: 600
                                }}
                            />
                            <Chip
                                label={`総選手数: ${totalPlayers.toLocaleString()}名`}
                                size="small"
                                sx={{
                                    bgcolor: "#f1f5f9",
                                    color: "#475569",
                                    fontWeight: 600
                                }}
                            />
                            <Chip
                                label={`平均パワー: ${avgPower.toFixed(1)}`}
                                size="small"
                                sx={{
                                    bgcolor: "#eff6ff",
                                    color: "#2563eb",
                                    fontWeight: 600
                                }}
                            />
                        </Stack>
                    )}

                    {isFiltered && (
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={onResetFilters}
                            startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                borderColor: "#cbd5e1",
                                color: "#e11d48",
                                bgcolor: "#fff1f2",
                                "&:hover": {
                                    borderColor: "#fecdd3",
                                    bgcolor: "#ffe4e6"
                                }
                            }}
                        >
                            条件リセット
                        </Button>
                    )}

                    <Button
                        size="small"
                        variant="outlined"
                        onClick={onOpenGuide}
                        startIcon={<HelpIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            borderColor: "#cbd5e1",
                            color: "#334155",
                            bgcolor: "#ffffff",
                            "&:hover": {
                                borderColor: "#94a3b8",
                                bgcolor: "#f8fafc"
                            }
                        }}
                    >
                        使い方
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
