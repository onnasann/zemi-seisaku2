import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { lightTheme } from "./theme";
import Header from "./components/Header";
import FilterControls from "./components/FilterControls";
import CircleGraph from "./components/CircleGraph";
import ClubTable from "./components/ClubTable";
import InsightsView from "./components/InsightsView";
import ClubDetail from "./components/ClubDetail";
import GuideDialog from "./components/GuideDialog";
import { areaConfig, normalizeArea } from "./data/areas";

import "./CircleGraph.css";

function App() {
    // ========================================
    // データ状態
    // ========================================
    const [data, setData] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [regressionModel, setRegressionModel] = useState(null);

    // ========================================
    // フィルター & 表示状態
    // ========================================
    const [searchText, setSearchText] = useState("");
    const [selectedAreas, setSelectedAreas] = useState([
        "ヨーロッパ",
        "南アメリカ",
        "北中米",
        "アジア・オセアニア",
        "アフリカ"
    ]);
    const [minPlayers, setMinPlayers] = useState(1);
    const [costFilter, setCostFilter] = useState("all"); // 'all' | 'high' | 'low'
    const [activeTab, setActiveTab] = useState(0); // 0: Radar, 1: Table, 2: Insights

    // ========================================
    // ダイアログ & ドロワー
    // ========================================
    const [selectedClub, setSelectedClub] = useState(null);
    const [guideOpen, setGuideOpen] = useState(false);

    // ========================================
    // CSVデータの読み込み & 回帰分析
    // ========================================
    useEffect(() => {
        fetch("/soccer_players.csv")
            .then((res) => res.text())
            .then((csv) => {
                Papa.parse(csv, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        const rawPlayers = result.data.map((p) => {
                            const country = p["国"] || p["﻿国"] || "";
                            return {
                                ...p,
                                "国": country.trim()
                            };
                        });

                        setPlayers(rawPlayers);

                        // クラブごとに集計
                        const clubs = {};

                        rawPlayers.forEach((player) => {
                            const clubName = player["所属チーム名"]?.trim();
                            if (!clubName) return;

                            if (!clubs[clubName]) {
                                const rawArea = player["エリア"]?.trim() || "";
                                const normalized = normalizeArea(rawArea);

                                clubs[clubName] = {
                                    club: clubName,
                                    playerCount: 0,
                                    power: Number(player["チームパワー"]) || 50,
                                    rank: Number(player["チームランキング"]) || 999,
                                    area: rawArea,
                                    normalizedArea: normalized
                                };
                            }

                            clubs[clubName].playerCount++;
                        });

                        const clubList = Object.values(clubs);

                        // 単回帰分析: パワー (x) → 選手数 (y)
                        const n = clubList.length;
                        if (n > 0) {
                            const meanPower =
                                clubList.reduce((sum, c) => sum + c.power, 0) / n;
                            const meanPlayers =
                                clubList.reduce((sum, c) => sum + c.playerCount, 0) / n;

                            let numerator = 0;
                            let denominator = 0;

                            clubList.forEach((c) => {
                                numerator +=
                                    (c.power - meanPower) *
                                    (c.playerCount - meanPlayers);
                                denominator +=
                                    (c.power - meanPower) *
                                    (c.power - meanPower);
                            });

                            const slope = denominator === 0 ? 0 : numerator / denominator;
                            const intercept = meanPlayers - slope * meanPower;

                            setRegressionModel({
                                slope,
                                intercept,
                                meanPower,
                                meanPlayers
                            });

                            const enrichedList = clubList.map((c) => {
                                const predicted = slope * c.power + intercept;
                                const costPerf = c.playerCount - predicted;

                                return {
                                    ...c,
                                    predictedPlayers: predicted,
                                    costPerformance: costPerf
                                };
                            });

                            enrichedList.sort((a, b) => a.rank - b.rank);
                            setData(enrichedList);
                        }

                        setLoading(false);
                    },
                    error: () => {
                        setLoading(false);
                    }
                });
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    // フィルター操作
    const toggleArea = (area) => {
        if (selectedAreas.includes(area)) {
            setSelectedAreas(selectedAreas.filter((a) => a !== area));
        } else {
            setSelectedAreas([...selectedAreas, area]);
        }
    };

    const toggleAllAreas = () => {
        const all = Object.keys(areaConfig);
        if (selectedAreas.length === all.length) {
            setSelectedAreas([]);
        } else {
            setSelectedAreas(all);
        }
    };

    const handleResetFilters = () => {
        setSearchText("");
        setSelectedAreas(Object.keys(areaConfig));
        setMinPlayers(1);
        setCostFilter("all");
    };

    const isFiltered =
        Boolean(searchText) ||
        selectedAreas.length < Object.keys(areaConfig).length ||
        minPlayers > 1 ||
        costFilter !== "all";

    // エリア別クラブ件数
    const areaCounts = useMemo(() => {
        const counts = {};
        Object.keys(areaConfig).forEach((a) => (counts[a] = 0));
        data.forEach((club) => {
            const area = club.normalizedArea || club.area;
            if (counts[area] != null) {
                counts[area]++;
            }
        });
        return counts;
    }, [data]);

    // フィルター適用クラブ一覧
    const filteredData = useMemo(() => {
        return data.filter((club) => {
            if (!selectedAreas.includes(club.normalizedArea)) return false;
            if (club.playerCount < minPlayers) return false;
            if (costFilter === "high" && club.costPerformance <= 0) return false;
            if (costFilter === "low" && club.costPerformance >= 0) return false;
            if (searchText) {
                const q = searchText.toLowerCase();
                const matchClub = club.club.toLowerCase().includes(q);
                const matchArea = (club.area || "").toLowerCase().includes(q);
                if (!matchClub && !matchArea) return false;
            }
            return true;
        });
    }, [data, selectedAreas, minPlayers, costFilter, searchText]);

    const totalClubs = data.length;
    const totalPlayers = players.length;
    const avgPower = useMemo(() => {
        if (!data.length) return 0;
        return data.reduce((sum, c) => sum + c.power, 0) / data.length;
    }, [data]);

    // 選択クラブの所属選手一覧
    const selectedPlayers = useMemo(() => {
        if (!selectedClub) return [];
        return players.filter(
            (p) => p["所属チーム名"]?.trim() === selectedClub.club
        );
    }, [selectedClub, players]);

    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />

            {/* ヘッダー */}
            <Header
                totalClubs={totalClubs}
                totalPlayers={totalPlayers}
                avgPower={avgPower}
                onOpenGuide={() => setGuideOpen(true)}
                onResetFilters={handleResetFilters}
                isFiltered={isFiltered}
            />

            <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, md: 3 } }}>
                {/* コントロールバー */}
                <FilterControls
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedAreas={selectedAreas}
                    toggleArea={toggleArea}
                    toggleAllAreas={toggleAllAreas}
                    minPlayers={minPlayers}
                    setMinPlayers={setMinPlayers}
                    costFilter={costFilter}
                    setCostFilter={setCostFilter}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    matchedCount={filteredData.length}
                    totalCount={totalClubs}
                    areaCounts={areaCounts}
                />

                {/* メインコンテンツ */}
                {loading ? (
                    <Box
                        sx={{
                            py: 12,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2
                        }}
                    >
                        <CircularProgress color="primary" size={40} />
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                            データを読み込み中...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* Tab 0: 半円グラフ */}
                        {activeTab === 0 && (
                            <CircleGraph
                                data={data}
                                players={players}
                                selectedAreas={selectedAreas}
                                toggleArea={toggleArea}
                                areaCounts={areaCounts}
                                minPlayers={minPlayers}
                                costFilter={costFilter}
                                searchText={searchText}
                                selectedClub={selectedClub}
                                setSelectedClub={setSelectedClub}
                            />
                        )}

                        {/* Tab 1: クラブ一覧 */}
                        {activeTab === 1 && (
                            <ClubTable
                                data={filteredData}
                                onSelectClub={(club) => setSelectedClub(club)}
                            />
                        )}

                        {/* Tab 2: 分析インサイト */}
                        {activeTab === 2 && (
                            <InsightsView
                                data={data}
                                players={players}
                                onSelectClub={(club) => setSelectedClub(club)}
                            />
                        )}
                    </>
                )}
            </Container>

            {/* クラブ詳細パネル */}
            {selectedClub && (
                <ClubDetail
                    club={selectedClub}
                    players={selectedPlayers}
                    onClose={() => setSelectedClub(null)}
                />
            )}

            {/* ガイドモーダル */}
            <GuideDialog
                open={guideOpen}
                onClose={() => setGuideOpen(false)}
                regressionModel={regressionModel}
            />
        </ThemeProvider>
    );
}

export default App;