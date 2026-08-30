import { useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { areaConfig, normalizeArea } from "../data/areas";

function InsightsView({ data, players, onSelectClub }) {
    // 1. 高コスパクラブ (Top 5)
    const topHighCostClubs = useMemo(() => {
        return [...data]
            .sort((a, b) => b.costPerformance - a.costPerformance)
            .slice(0, 5);
    }, [data]);

    // 2. 低コスパクラブ (Top 5)
    const topLowCostClubs = useMemo(() => {
        return [...data]
            .sort((a, b) => a.costPerformance - b.costPerformance)
            .slice(0, 5);
    }, [data]);

    // 3. 最多選手輩出クラブ (Top 5)
    const topPlayerClubs = useMemo(() => {
        return [...data]
            .sort((a, b) => b.playerCount - a.playerCount)
            .slice(0, 5);
    }, [data]);

    // 4. エリア別集計
    const areaStats = useMemo(() => {
        const stats = {};
        Object.keys(areaConfig).forEach((area) => {
            stats[area] = {
                clubs: 0,
                players: 0,
                totalPower: 0,
                bestClub: null
            };
        });

        data.forEach((club) => {
            const area = normalizeArea(club.area);
            if (stats[area]) {
                stats[area].clubs++;
                stats[area].players += club.playerCount;
                stats[area].totalPower += club.power;

                if (
                    !stats[area].bestClub ||
                    club.costPerformance > stats[area].bestClub.costPerformance
                ) {
                    stats[area].bestClub = club;
                }
            }
        });

        return stats;
    }, [data]);

    return (
        <Stack spacing={3}>
            {/* エリア別サマリー */}
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, color: "#0f172a" }}>
                    エリア別サマリー
                </Typography>

                <Grid container spacing={2}>
                    {Object.entries(areaConfig).map(([areaName, config]) => {
                        const s = areaStats[areaName] || { clubs: 0, players: 0, totalPower: 0, bestClub: null };
                        const avgPower = s.clubs > 0 ? (s.totalPower / s.clubs).toFixed(1) : "-";

                        return (
                            <Grid item xs={12} sm={6} md={2.4} key={areaName}>
                                <Card
                                    sx={{
                                        bgcolor: "#ffffff",
                                        border: `1px solid ${config.border}`,
                                        borderRadius: 2.5,
                                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)"
                                    }}
                                >
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: config.textColor, mb: 1 }}>
                                            {config.name}
                                        </Typography>

                                        <Stack spacing={0.5}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <Typography variant="caption" sx={{ color: "#64748b" }}>クラブ数</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 700 }}>{s.clubs} チーム</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <Typography variant="caption" sx={{ color: "#64748b" }}>総選手数</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: "#0f172a" }}>{s.players} 名</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <Typography variant="caption" sx={{ color: "#64748b" }}>平均パワー</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: "#2563eb" }}>{avgPower}</Typography>
                                            </Box>

                                            {s.bestClub && (
                                                <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid #f1f5f9" }}>
                                                    <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", fontSize: "0.68rem" }}>
                                                        最高コスパクラブ:
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: "#0f172a",
                                                            cursor: "pointer",
                                                            "&:hover": { color: "#2563eb" }
                                                        }}
                                                        onClick={() => onSelectClub(s.bestClub)}
                                                    >
                                                        {s.bestClub.club}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            {/* ランキング3列グリッド */}
            <Grid container spacing={2.5}>
                {/* 1. 高コスパクラブ Top 5 */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: "#ffffff", border: "1px solid #e2e8f0", height: "100%" }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#15803d", mb: 0.3 }}>
                                高コスパクラブ TOP 5
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 2 }}>
                                予測選手数よりも多く選手を輩出
                            </Typography>

                            <Stack spacing={1}>
                                {topHighCostClubs.map((club, idx) => (
                                    <Paper
                                        key={club.club}
                                        onClick={() => onSelectClub(club)}
                                        sx={{
                                            p: 1.2,
                                            px: 1.5,
                                            bgcolor: "#f8fafc",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: 2,
                                            cursor: "pointer",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            "&:hover": { bgcolor: "#f0fdf4", borderColor: "#bbf7d0" }
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: "#d97706", minWidth: 20 }}>
                                                #{idx + 1}
                                            </Typography>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                                                    {club.club}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: "#64748b" }}>
                                                    パワー: {club.power} / 選手: {club.playerCount}名
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={`+${club.costPerformance.toFixed(2)}`}
                                            size="small"
                                            sx={{
                                                bgcolor: "#f0fdf4",
                                                color: "#15803d",
                                                fontWeight: 800,
                                                fontSize: "0.72rem",
                                                border: "1px solid #bbf7d0",
                                                height: 22
                                            }}
                                        />
                                    </Paper>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 2. 最多選手輩出クラブ Top 5 */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: "#ffffff", border: "1px solid #e2e8f0", height: "100%" }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#2563eb", mb: 0.3 }}>
                                選手数上位クラブ TOP 5
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 2 }}>
                                登録された選手の総数順
                            </Typography>

                            <Stack spacing={1}>
                                {topPlayerClubs.map((club, idx) => (
                                    <Paper
                                        key={club.club}
                                        onClick={() => onSelectClub(club)}
                                        sx={{
                                            p: 1.2,
                                            px: 1.5,
                                            bgcolor: "#f8fafc",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: 2,
                                            cursor: "pointer",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            "&:hover": { bgcolor: "#eff6ff", borderColor: "#bfdbfe" }
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: "#d97706", minWidth: 20 }}>
                                                #{idx + 1}
                                            </Typography>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                                                    {club.club}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: "#64748b" }}>
                                                    パワー: {club.power} ({club.area})
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={`${club.playerCount} 名`}
                                            size="small"
                                            sx={{
                                                bgcolor: "#eff6ff",
                                                color: "#2563eb",
                                                fontWeight: 800,
                                                fontSize: "0.72rem",
                                                border: "1px solid #bfdbfe",
                                                height: 22
                                            }}
                                        />
                                    </Paper>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 3. 低コスパクラブ Top 5 */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: "#ffffff", border: "1px solid #e2e8f0", height: "100%" }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#b45309", mb: 0.3 }}>
                                低コスパクラブ TOP 5
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 2 }}>
                                パワーに対して選手数が控えめ
                            </Typography>

                            <Stack spacing={1}>
                                {topLowCostClubs.map((club, idx) => (
                                    <Paper
                                        key={club.club}
                                        onClick={() => onSelectClub(club)}
                                        sx={{
                                            p: 1.2,
                                            px: 1.5,
                                            bgcolor: "#f8fafc",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: 2,
                                            cursor: "pointer",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            "&:hover": { bgcolor: "#fffbeb", borderColor: "#fde68a" }
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: "#d97706", minWidth: 20 }}>
                                                #{idx + 1}
                                            </Typography>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                                                    {club.club}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: "#64748b" }}>
                                                    パワー: {club.power} / 選手: {club.playerCount}名
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={`${club.costPerformance.toFixed(2)}`}
                                            size="small"
                                            sx={{
                                                bgcolor: "#fffbeb",
                                                color: "#b45309",
                                                fontWeight: 800,
                                                fontSize: "0.72rem",
                                                border: "1px solid #fde68a",
                                                height: 22
                                            }}
                                        />
                                    </Paper>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
}

export default InsightsView;
