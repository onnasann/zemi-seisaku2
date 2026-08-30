import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { lightTheme } from "./theme";
import FilterControls from "./components/FilterControls";
import CircleGraph from "./components/CircleGraph";
import ClubDetail from "./components/ClubDetail";
import { normalizeArea } from "./data/areas";

import "./CircleGraph.css";

function App() {
    // ========================================
    // データ状態
    // ========================================
    const [data, setData] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    // ========================================
    // フィルター状態
    // ========================================
    const [searchText, setSearchText] = useState("");
    const [minPlayers, setMinPlayers] = useState(1);

    // ========================================
    // クラブ詳細パネル
    // ========================================
    const [selectedClub, setSelectedClub] = useState(null);

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

                        // 単回帰分析: クラブパワー (x) → 選手数 (y)
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

    const handleResetFilters = () => {
        setSearchText("");
        setMinPlayers(1);
    };

    const isFiltered =
        Boolean(searchText) || minPlayers > 1;

    const searchOptions = useMemo(
        () => data.map((club) => club.club).sort((a, b) => a.localeCompare(b, "ja")),
        [data]
    );

    // フィルター適用クラブ一覧
    const filteredData = useMemo(() => {
        return data.filter((club) => {
            if (club.playerCount < minPlayers) return false;
            if (searchText) {
                const q = searchText.toLowerCase();
                const matchClub = club.club.toLowerCase().includes(q);
                if (!matchClub) return false;
            }
            return true;
        });
    }, [data, minPlayers, searchText]);

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

            <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1.5, md: 3 } }}>
                <Box sx={{ mb: 2 }}>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            color: "#0f172a",
                            fontWeight: 800,
                            letterSpacing: "-0.02em"
                        }}
                    >
                        最強クラブ分析
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                        クラブパワーと選手数による輩出力分析
                    </Typography>
                </Box>

                {/* フィルターバー */}
                <FilterControls
                    searchText={searchText}
                    setSearchText={setSearchText}
                    searchOptions={searchOptions}
                    minPlayers={minPlayers}
                    setMinPlayers={setMinPlayers}
                    matchedCount={filteredData.length}
                    totalCount={totalClubs}
                    totalPlayers={totalPlayers}
                    avgPower={avgPower}
                    isFiltered={isFiltered}
                    onResetFilters={handleResetFilters}
                />

                {/* メイン半円グラフ */}
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
                        <CircularProgress color="primary" size={36} />
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                            データを読み込み中...
                        </Typography>
                    </Box>
                ) : (
                    <CircleGraph
                        data={data}
                        players={players}
                        minPlayers={minPlayers}
                        searchText={searchText}
                        selectedClub={selectedClub}
                        setSelectedClub={setSelectedClub}
                    />
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
        </ThemeProvider>
    );
}

export default App;
