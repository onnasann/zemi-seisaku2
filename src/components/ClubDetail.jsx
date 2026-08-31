import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { getCountryDisplayName, getCountryFlagCode, positionConfig } from "../data/areas";
import { CloseIcon, TrophyIcon } from "./Icons";

const POSITION_ORDER = {
    FW: 0,
    MF: 1,
    DF: 2,
    GK: 3,
    "FW/MF": 4,
    "MF/FW": 4
};

function ClubDetail({ club, players, onClose }) {
    if (!club) return null;

    const isHighCost = club.costPerformance > 0;
    const sortedPlayers = [...players].sort((a, b) => {
        const positionA = a["ポジション"]?.trim() || "";
        const positionB = b["ポジション"]?.trim() || "";
        return (POSITION_ORDER[positionA] ?? Number.MAX_SAFE_INTEGER) -
            (POSITION_ORDER[positionB] ?? Number.MAX_SAFE_INTEGER);
    });

    return (
        <Drawer
            anchor="right"
            open={Boolean(club)}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 420, md: 460 },
                    bgcolor: "#ffffff",
                    borderLeft: "1px solid #e2e8f0",
                    boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.08)",
                    p: 0
                }
            }}
        >
            {/* ヘッダー */}
            <Box
                sx={{
                    p: 3,
                    bgcolor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    position: "relative"
                }}
            >
                {/* 閉じるボタン */}
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        color: "#64748b",
                        bgcolor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        "&:hover": { bgcolor: "#f1f5f9", color: "#0f172a" }
                    }}
                >
                    <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>

                {/* 順位バッジ */}
                <Stack direction="row" spacing={1} sx={{ mb: 1.2 }} alignItems="center">
                    {club.rank && (
                        <Chip
                            icon={<TrophyIcon sx={{ fontSize: 14, color: "#d97706 !important" }} />}
                            label={`世界第 ${club.rank} 位`}
                            size="small"
                            sx={{
                                bgcolor: "#fffbeb",
                                color: "#b45309",
                                border: "1px solid #fde68a",
                                fontWeight: 700
                            }}
                        />
                    )}
                </Stack>

                {/* クラブ名 */}
                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        fontWeight: 800,
                        color: "#0f172a",
                        mb: 1.2,
                        pr: 4
                    }}
                >
                    {club.club}
                </Typography>

                {/* 輩出力 */}
                <Chip
                    label={
                        isHighCost
                            ? `高輩出力（予測より +${club.costPerformance.toFixed(2)} 人）`
                            : `低輩出力（予測より ${club.costPerformance.toFixed(2)} 人）`
                    }
                    size="small"
                    sx={{
                        bgcolor: isHighCost ? "#f0fdf4" : "#fffbeb",
                        color: isHighCost ? "#15803d" : "#b45309",
                        border: `1px solid ${isHighCost ? "#bbf7d0" : "#fde68a"}`,
                        fontWeight: 700,
                        fontSize: "0.78rem"
                    }}
                />
            </Box>

            {/* スクロールコンテンツ */}
            <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
                <Stack spacing={2.5}>
                    {/* 4項目メトリクス */}
                    <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                            <Paper sx={{ p: 1.5, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                                    出場選手数
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mt: 0.2 }}>
                                    {club.playerCount} 名
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={6}>
                            <Paper sx={{ p: 1.5, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                                    クラブパワー
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "#2563eb", mt: 0.2 }}>
                                    {club.power}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={6}>
                            <Paper sx={{ p: 1.5, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                                    予測選手数
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#475569", mt: 0.2 }}>
                                    {club.predictedPlayers != null ? club.predictedPlayers.toFixed(2) : "-"} 名
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={6}>
                            <Paper
                                sx={{
                                    p: 1.5,
                                    bgcolor: isHighCost ? "#f0fdf4" : "#fffbeb",
                                    border: `1px solid ${isHighCost ? "#bbf7d0" : "#fde68a"}`,
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="caption" sx={{ color: isHighCost ? "#15803d" : "#b45309", fontWeight: 600 }}>
                                    輩出力指数
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        color: isHighCost ? "#15803d" : "#b45309",
                                        mt: 0.2
                                    }}
                                >
                                    {club.costPerformance > 0 ? `+${club.costPerformance.toFixed(2)}` : club.costPerformance.toFixed(2)}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Divider sx={{ borderColor: "#f1f5f9" }} />

                    {/* 所属選手一覧（絞り込みなしで直接表示） */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}>
                            出場選手一覧（{players.length}名）
                        </Typography>

                        <Stack spacing={1}>
                            {sortedPlayers.map((player, idx) => {
                                const rawCountry = player["国"]?.trim() || "";
                                const flagCode = getCountryFlagCode(rawCountry);
                                const countryName = getCountryDisplayName(rawCountry);
                                const pos = player["ポジション"]?.trim() || "MF";
                                const posConf = positionConfig[pos] || {
                                    color: "#475569",
                                    bgLight: "#f1f5f9",
                                    border: "#e2e8f0"
                                };

                                return (
                                    <Paper
                                        key={idx}
                                        sx={{
                                            p: 1.2,
                                            px: 1.6,
                                            bgcolor: "#ffffff",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            "&:hover": {
                                                bgcolor: "#f8fafc",
                                                borderColor: "#cbd5e1"
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            {flagCode ? (
                                                <Box
                                                    component="img"
                                                    src={`https://flagcdn.com/${flagCode}.svg`}
                                                    alt={`${countryName}の国旗`}
                                                    sx={{
                                                        width: 30,
                                                        height: 20,
                                                        objectFit: "cover",
                                                        borderRadius: "2px",
                                                        border: "1px solid #e2e8f0",
                                                        flexShrink: 0
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="h6" sx={{ lineHeight: 1 }}>🌐</Typography>
                                            )}
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                                                    {player["選手名"]}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: "#64748b" }}>
                                                    {countryName}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Chip
                                            label={pos}
                                            size="small"
                                            sx={{
                                                bgcolor: posConf.bgLight,
                                                color: posConf.color,
                                                border: `1px solid ${posConf.border || posConf.color}`,
                                                fontWeight: 700,
                                                fontSize: "0.72rem",
                                                minWidth: 40
                                            }}
                                        />
                                    </Paper>
                                );
                            })}
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </Drawer>
    );
}

export default ClubDetail;
