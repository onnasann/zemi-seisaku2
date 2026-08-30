import { useState, useRef, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import BackCircle from "./BackCircle";
import ClubCircle from "./ClubCircle";
import Legend from "./Legend";
import { createNodes } from "../utils/nodePosition";
import { areaConfig } from "../data/areas";
import { TrophyIcon } from "./Icons";

function CircleGraph({
    data,
    players,
    selectedAreas,
    toggleArea,
    areaCounts,
    minPlayers,
    costFilter,
    searchText,
    selectedClub,
    setSelectedClub
}) {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
    const [hoverClub, setHoverClub] = useState(null);

    // リサイズ自動追従
    useEffect(() => {
        if (!containerRef.current) return;

        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const w = Math.max(600, rect.width);
                const h = Math.max(480, Math.min(window.innerHeight * 0.72, 680));
                setDimensions({ width: w, height: h });
            }
        };

        updateDimensions();
        const observer = new ResizeObserver(() => updateDimensions());
        observer.observe(containerRef.current);
        window.addEventListener("resize", updateDimensions);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

    const { width, height } = dimensions;

    // 半円の中心・半径
    const centerX = width / 2;
    const centerY = height - 40;
    const maxRadius = Math.min(width / 2 - 40, height - 70);

    const minPower = 50;
    const maxPower = 100;

    // ノード計算
    const nodes = useMemo(() => {
        return createNodes(
            data,
            centerX,
            centerY,
            maxRadius,
            minPower,
            maxPower
        );
    }, [data, centerX, centerY, maxRadius, minPower, maxPower]);

    const hoverAreaInfo = hoverClub
        ? areaConfig[hoverClub.normalizedArea || hoverClub.area] || { color: "#2563eb", bgLight: "#eff6ff", textColor: "#1d4ed8" }
        : null;

    return (
        <Card
            ref={containerRef}
            sx={{
                position: "relative",
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
                minHeight: 520
            }}
        >
            {/* SVG半円グラフ */}
            <svg
                width={width}
                height={height}
                style={{
                    display: "block",
                    userSelect: "none"
                }}
            >
                {/* 背景ガイド・同心円 */}
                <BackCircle
                    centerX={centerX}
                    centerY={centerY}
                    maxRadius={maxRadius}
                    minPower={minPower}
                    maxPower={maxPower}
                />

                {/* クラブノード */}
                {nodes.map((club) => (
                    <ClubCircle
                        key={club.club}
                        club={club}
                        selectedAreas={selectedAreas}
                        minPlayers={minPlayers}
                        costFilter={costFilter}
                        searchText={searchText}
                        hoverClub={hoverClub}
                        setHoverClub={setHoverClub}
                        selectedClub={selectedClub}
                        setSelectedClub={setSelectedClub}
                    />
                ))}
            </svg>

            {/* 左上: 凡例 */}
            <Legend
                selectedAreas={selectedAreas}
                toggleArea={toggleArea}
                areaCounts={areaCounts}
            />

            {/* 右上: ホバー情報ツールチップ */}
            {hoverClub && (
                <Paper
                    elevation={0}
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        width: 260,
                        p: 2,
                        bgcolor: "rgba(255, 255, 255, 0.98)",
                        border: "1px solid #cbd5e1",
                        borderRadius: 2,
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                        zIndex: 10,
                        pointerEvents: "none"
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.8 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
                            {hoverClub.club}
                        </Typography>
                        {hoverAreaInfo && (
                            <Chip
                                label={hoverClub.normalizedArea || hoverClub.area}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: "0.68rem",
                                    bgcolor: hoverAreaInfo.bgLight,
                                    color: hoverAreaInfo.textColor,
                                    fontWeight: 700
                                }}
                            />
                        )}
                    </Box>

                    {hoverClub.rank && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.2 }}>
                            <TrophyIcon sx={{ fontSize: 14, color: "#d97706" }} />
                            <Typography variant="caption" sx={{ color: "#b45309", fontWeight: 700 }}>
                                世界ランキング #{hoverClub.rank} 位
                            </Typography>
                        </Box>
                    )}

                    <Stack spacing={0.6}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption" sx={{ color: "#64748b" }}>チームパワー</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: "#2563eb" }}>
                                {hoverClub.power}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption" sx={{ color: "#64748b" }}>出場選手数</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: "#0f172a" }}>
                                {hoverClub.playerCount} 名
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption" sx={{ color: "#64748b" }}>予測選手数</Typography>
                            <Typography variant="caption" sx={{ color: "#475569" }}>
                                {hoverClub.predictedPlayers != null ? hoverClub.predictedPlayers.toFixed(2) : "-"} 名
                            </Typography>
                        </Box>

                        {/* コスパ度 */}
                        <Box
                            sx={{
                                mt: 0.8,
                                p: 0.8,
                                borderRadius: 1.5,
                                bgcolor: hoverClub.costPerformance > 0 ? "#f0fdf4" : "#fffbeb",
                                border: `1px solid ${hoverClub.costPerformance > 0 ? "#bbf7d0" : "#fde68a"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 700,
                                    color: hoverClub.costPerformance > 0 ? "#15803d" : "#b45309"
                                }}
                            >
                                {hoverClub.costPerformance > 0 ? "高コスパ" : "低コスパ"}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 800,
                                    fontFamily: "monospace",
                                    color: hoverClub.costPerformance > 0 ? "#15803d" : "#b45309"
                                }}
                            >
                                {hoverClub.costPerformance > 0 ? `+${hoverClub.costPerformance.toFixed(2)}` : hoverClub.costPerformance.toFixed(2)}
                            </Typography>
                        </Box>
                    </Stack>

                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            textAlign: "center",
                            color: "#94a3b8",
                            fontSize: "0.68rem",
                            mt: 1
                        }}
                    >
                        クリックで所属選手一覧を表示
                    </Typography>
                </Paper>
            )}
        </Card>
    );
}

export default CircleGraph;