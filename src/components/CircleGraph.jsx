import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import BackCircle from "./BackCircle";
import ClubCircle from "./ClubCircle";
import { createNodes } from "../utils/nodePosition";
import { TrophyIcon } from "./Icons";

function CircleGraph({
    data,
    players,
    minPlayers,
    searchText,
    selectedClub,
    setSelectedClub
}) {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
    const [hoverClub, setHoverClub] = useState(null);

    // ──────────────────────────────────────
    // 2点範囲選択モード状態
    // ──────────────────────────────────────
    const [isRangeMode, setIsRangeMode] = useState(false);
    // rangeEndpoints: クリックした順に最大2つのクラブオブジェクト
    const [rangeEndpoints, setRangeEndpoints] = useState([]);

    // リサイズ自動追従
    useEffect(() => {
        if (!containerRef.current) return;

        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const w = Math.max(600, rect.width);
                const h = Math.max(480, Math.min(window.innerHeight * 0.76, 720));
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

    const centerX = width / 2;
    const centerY = height - 40;
    const maxRadius = Math.min(width / 2 - 55, height - 75);

    const minPower = 50;
    const maxPower = 100;

    // 輩出力の最小・最大値（通常モード用）
    const { minCost, maxCost } = useMemo(() => {
        const costs = data.map((c) => c.costPerformance).filter((c) => c != null);
        return {
            minCost: costs.length ? Math.min(...costs) : -3.76,
            maxCost: costs.length ? Math.max(...costs) : 14.25
        };
    }, [data]);

    // ──────────────────────────────────────
    // 2点範囲選択: アクティブな costRange
    // rangeEndpoints が 2つ & 輩出力が異なる場合のみ有効
    // ──────────────────────────────────────
    const activeCostRange = useMemo(() => {
        if (!isRangeMode || rangeEndpoints.length < 2) return null;
        const cost1 = rangeEndpoints[0].costPerformance;
        const cost2 = rangeEndpoints[1].costPerformance;
        if (cost1 === cost2) return null; // 輩出力が完全に同じ場合だけ無効
        return {
            min: Math.min(cost1, cost2),
            max: Math.max(cost1, cost2)
        };
    }, [isRangeMode, rangeEndpoints]);

    // ──────────────────────────────────────
    // 2点範囲選択: ノードクリックハンドラ
    // ──────────────────────────────────────
    const handleRangeClick = useCallback((club) => {
        setRangeEndpoints(prev => {
            const idx = prev.findIndex(e => e.club === club.club);
            if (idx >= 0) {
                // 既に選択中 → 解除
                return prev.filter((_, i) => i !== idx);
            }
            if (prev.length >= 2) {
                // 3つ目は古い方を破棄
                return [prev[1], club];
            }
            return [...prev, club];
        });
    }, []);

    // 範囲モード ON/OFF トグル
    const toggleRangeMode = useCallback(() => {
        setIsRangeMode(prev => {
            if (prev) {
                // 終了: 選択をリセット
                setRangeEndpoints([]);
                return false;
            }
            setSelectedClub(null);
            return true;
        });
    }, [setSelectedClub]);

    // 2点範囲フィルタ
    const filteredForNodes = useMemo(() => {
        if (activeCostRange) {
            return data.filter(c =>
                c.costPerformance >= activeCostRange.min &&
                c.costPerformance <= activeCostRange.max
            );
        }
        return data;
    }, [data, activeCostRange]);

    // ③ ノード計算（範囲モード時は costRange を渡す → 線形マッピング）
    const nodes = useMemo(() => {
        return createNodes(
            filteredForNodes,
            centerX,
            centerY,
            maxRadius,
            minPower,
            maxPower,
            activeCostRange  // null = 通常モード, { min, max } = 範囲モード
        );
    }, [filteredForNodes, centerX, centerY, maxRadius, minPower, maxPower, activeCostRange]);

    // 範囲モードのステータスメッセージ
    const rangeModeMessage = (() => {
        if (!isRangeMode) return null;
        if (rangeEndpoints.length === 0) return "輩出力の異なるノードを2つクリックして範囲を設定";
        if (rangeEndpoints.length === 1) return `「${rangeEndpoints[0].club}」を選択済み。もう1つクリックしてください`;
        if (!activeCostRange) return "同じ輩出力のノードは選択できません。別のノードを選んでください";
        return null;
    })();

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
            {/* ─── 上部バナー: 範囲選択アクティブ ─── */}
            {isRangeMode && activeCostRange && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        bgcolor: "rgba(99,102,241,0.92)",
                        color: "#fff",
                        borderRadius: 2,
                        px: 2,
                        py: 0.7,
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        boxShadow: "0 2px 10px rgba(99,102,241,0.35)",
                        backdropFilter: "blur(4px)",
                        pointerEvents: "none",
                        whiteSpace: "nowrap"
                    }}
                >
                    <Box
                        sx={{
                            px: 1,
                            py: 0.2,
                            bgcolor: "rgba(249,115,22,0.9)",
                            borderRadius: 1,
                            fontSize: "0.72rem"
                        }}
                    >
                        {activeCostRange.min >= 0 ? "+" : ""}{activeCostRange.min.toFixed(1)}
                    </Box>
                    〜
                    <Box
                        sx={{
                            px: 1,
                            py: 0.2,
                            bgcolor: "rgba(255,255,255,0.25)",
                            borderRadius: 1,
                            fontSize: "0.72rem"
                        }}
                    >
                        {activeCostRange.max >= 0 ? "+" : ""}{activeCostRange.max.toFixed(1)}
                    </Box>
                    の範囲を表示中（{nodes.length} クラブ）
                </Box>
            )}

            {/* ─── 上部バナー: 範囲選択操作中 ─── */}
            {isRangeMode && !activeCostRange && rangeModeMessage && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 20,
                        bgcolor: "rgba(15,23,42,0.85)",
                        color: "#fff",
                        borderRadius: 2,
                        px: 2,
                        py: 0.7,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        backdropFilter: "blur(4px)",
                        pointerEvents: "none",
                        whiteSpace: "nowrap"
                    }}
                >
                    {rangeModeMessage}
                </Box>
            )}

            {/* SVG半円グラフ */}
            <svg
                width={width}
                height={height}
                style={{
                    display: "block",
                    userSelect: "none"
                }}
            >
                {/* 背景ガイド・同心円 & 輩出力境界線 */}
                <BackCircle
                    centerX={centerX}
                    centerY={centerY}
                    maxRadius={maxRadius}
                    minPower={minPower}
                    maxPower={maxPower}
                    minCost={minCost}
                    maxCost={maxCost}
                    costRange={activeCostRange}
                />

                {/* クラブノード */}
                {nodes.map((club) => (
                    <ClubCircle
                        key={club.club}
                        club={club}
                        minPlayers={minPlayers}
                        searchText={searchText}
                        hoverClub={hoverClub}
                        setHoverClub={setHoverClub}
                        selectedClub={selectedClub}
                        setSelectedClub={setSelectedClub}
                        isRangeMode={isRangeMode}
                        rangeEndpoints={rangeEndpoints}
                        activeCostRange={activeCostRange}
                        onRangeClick={handleRangeClick}
                    />
                ))}
            </svg>

            {/* ─── 右下ボタン群 ─── */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 48,
                    right: 16,
                    zIndex: 15,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 1
                }}
            >
                {/* 範囲選択モード: リセットボタン（範囲確定後） */}
                {isRangeMode && rangeEndpoints.length > 0 && (
                    <Box
                        onClick={() => setRangeEndpoints([])}
                        sx={{
                            bgcolor: "#ffffff",
                            border: "1.5px solid #6366f1",
                            color: "#6366f1",
                            borderRadius: 2,
                            px: 1.5,
                            py: 0.5,
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            boxShadow: "0 2px 6px rgba(99,102,241,0.15)",
                            "&:hover": { bgcolor: "#eef2ff" },
                            transition: "background 0.15s"
                        }}
                    >
                        選択をリセット
                    </Box>
                )}

                {/* 範囲選択モード: 終了ボタン */}
                <Box
                    onClick={toggleRangeMode}
                    sx={{
                        bgcolor: isRangeMode ? "#6366f1" : "#ffffff",
                        border: "1.5px solid #6366f1",
                        color: isRangeMode ? "#ffffff" : "#6366f1",
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.5,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(99,102,241,0.2)",
                        "&:hover": {
                            bgcolor: isRangeMode ? "#4f46e5" : "#eef2ff"
                        },
                        transition: "all 0.15s"
                    }}
                >
                    {isRangeMode ? "範囲選択モードを終了" : "2点範囲選択"}
                </Box>

            </Box>

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
                            <Typography variant="caption" sx={{ color: "#64748b" }}>クラブパワー</Typography>
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
                                sx={{ fontWeight: 700, color: hoverClub.costPerformance > 0 ? "#15803d" : "#b45309" }}
                            >
                                輩出力
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ fontWeight: 800, fontFamily: "monospace", color: hoverClub.costPerformance > 0 ? "#15803d" : "#b45309" }}
                            >
                                {hoverClub.costPerformance > 0 ? `+${hoverClub.costPerformance.toFixed(2)}` : hoverClub.costPerformance.toFixed(2)}
                            </Typography>
                        </Box>
                    </Stack>

                    <Typography
                        variant="caption"
                        sx={{ display: "block", textAlign: "center", color: "#94a3b8", fontSize: "0.68rem", mt: 1 }}
                    >
                        {isRangeMode && !activeCostRange
                            ? "クリックして範囲の端点に選択"
                            : "クリックで所属選手一覧を表示"}
                    </Typography>
                </Paper>
            )}
        </Card>
    );
}

export default CircleGraph;
