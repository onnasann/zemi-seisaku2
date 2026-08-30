import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { areaConfig } from "../data/areas";
import {
    SearchIcon,
    CloseIcon,
    RadarIcon,
    TableChartIcon,
    InsightsIcon
} from "./Icons";

function FilterControls({
    searchText,
    setSearchText,
    selectedAreas,
    toggleArea,
    toggleAllAreas,
    minPlayers,
    setMinPlayers,
    costFilter,
    setCostFilter,
    activeTab,
    setActiveTab,
    matchedCount,
    totalCount,
    areaCounts
}) {
    const allAreasSelected = Object.keys(areaConfig).every((a) =>
        selectedAreas.includes(a)
    );

    return (
        <Card
            sx={{
                mb: 3,
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
            }}
        >
            {/* 上部: 表示タブ & 検索バー */}
            <Box
                sx={{
                    px: { xs: 2, md: 3 },
                    pt: 1.5,
                    pb: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    borderBottom: "1px solid #f1f5f9"
                }}
            >
                {/* タブ切り替え */}
                <Tabs
                    value={activeTab}
                    onChange={(e, v) => setActiveTab(v)}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                        minHeight: 42,
                        "& .MuiTab-root": {
                            minHeight: 42,
                            fontWeight: 700,
                            fontSize: "0.88rem",
                            px: 2,
                            color: "#64748b",
                            "&.Mui-selected": {
                                color: "#2563eb"
                            }
                        }
                    }}
                >
                    <Tab
                        icon={<RadarIcon sx={{ fontSize: 18 }} />}
                        iconPosition="start"
                        label="半円グラフ"
                    />
                    <Tab
                        icon={<TableChartIcon sx={{ fontSize: 18 }} />}
                        iconPosition="start"
                        label="クラブ一覧"
                    />
                    <Tab
                        icon={<InsightsIcon sx={{ fontSize: 18 }} />}
                        iconPosition="start"
                        label="ランキング・分析"
                    />
                </Tabs>

                {/* 検索入力 */}
                <Box sx={{ width: { xs: "100%", sm: 280, md: 320 } }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="クラブ名を検索..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchText ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setSearchText("")}
                                        edge="end"
                                    >
                                        <CloseIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </InputAdornment>
                            ) : null
                        }}
                    />
                </Box>
            </Box>

            {/* 下部: フィルター項目 */}
            <CardContent sx={{ p: { xs: 2, md: 3 }, pt: { xs: 2, md: 2 } }}>
                <Stack spacing={2}>
                    {/* エリアフィルター */}
                    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#64748b",
                                fontWeight: 700,
                                minWidth: 50
                            }}
                        >
                            エリア:
                        </Typography>

                        <Chip
                            label="すべて"
                            size="small"
                            onClick={toggleAllAreas}
                            sx={{
                                cursor: "pointer",
                                fontWeight: 700,
                                bgcolor: allAreasSelected ? "#2563eb" : "#f1f5f9",
                                color: allAreasSelected ? "#ffffff" : "#64748b",
                                "&:hover": {
                                    bgcolor: allAreasSelected ? "#1d4ed8" : "#e2e8f0"
                                }
                            }}
                        />

                        {Object.entries(areaConfig).map(([areaName, config]) => {
                            const isSelected = selectedAreas.includes(areaName);
                            const count = areaCounts[areaName] || 0;
                            return (
                                <Chip
                                    key={areaName}
                                    label={`${config.name} (${count})`}
                                    size="small"
                                    onClick={() => toggleArea(areaName)}
                                    sx={{
                                        cursor: "pointer",
                                        fontWeight: 600,
                                        bgcolor: isSelected ? config.bgLight : "#f8fafc",
                                        color: isSelected ? config.textColor : "#94a3b8",
                                        border: `1px solid ${isSelected ? config.border : "#e2e8f0"}`,
                                        "&:hover": {
                                            bgcolor: config.bgLight,
                                            color: config.textColor
                                        }
                                    }}
                                />
                            );
                        })}
                    </Box>

                    <Divider sx={{ borderColor: "#f1f5f9" }} />

                    {/* スライダー & コスパ種別 */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: { xs: "stretch", md: "center" },
                            justifyContent: "space-between",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 2.5
                        }}
                    >
                        {/* 選手数スライダー */}
                        <Box sx={{ flex: 1, maxWidth: { xs: "100%", md: 450 } }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5, alignItems: "center" }}>
                                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                                    選手数絞り込み:
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "#2563eb" }}>
                                    {minPlayers} 人以上
                                </Typography>
                            </Box>
                            <Box sx={{ px: 1 }}>
                                <Slider
                                    value={minPlayers}
                                    min={1}
                                    max={15}
                                    step={1}
                                    valueLabelDisplay="auto"
                                    onChange={(e, val) => setMinPlayers(val)}
                                    marks={[
                                        { value: 1, label: "1人~" },
                                        { value: 5, label: "5人" },
                                        { value: 10, label: "10人" },
                                        { value: 15, label: "15人" }
                                    ]}
                                    sx={{
                                        "& .MuiSlider-markLabel": {
                                            fontSize: "0.72rem",
                                            color: "#94a3b8"
                                        }
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* コスパ種別フィルター */}
                        <Box>
                            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block", mb: 0.5 }}>
                                コスパ度:
                            </Typography>
                            <ButtonGroup size="small">
                                <Button
                                    variant={costFilter === "all" ? "contained" : "outlined"}
                                    onClick={() => setCostFilter("all")}
                                    sx={{
                                        borderColor: "#cbd5e1",
                                        fontWeight: 600
                                    }}
                                >
                                    すべて
                                </Button>
                                <Button
                                    variant={costFilter === "high" ? "contained" : "outlined"}
                                    onClick={() => setCostFilter("high")}
                                    sx={{
                                        borderColor: "#cbd5e1",
                                        fontWeight: 600,
                                        color: costFilter === "high" ? "#ffffff" : "#16a34a",
                                        bgcolor: costFilter === "high" ? "#16a34a" : "transparent",
                                        "&:hover": {
                                            bgcolor: costFilter === "high" ? "#15803d" : "#f0fdf4"
                                        }
                                    }}
                                >
                                    高コスパ
                                </Button>
                                <Button
                                    variant={costFilter === "low" ? "contained" : "outlined"}
                                    onClick={() => setCostFilter("low")}
                                    sx={{
                                        borderColor: "#cbd5e1",
                                        fontWeight: 600,
                                        color: costFilter === "low" ? "#ffffff" : "#d97706",
                                        bgcolor: costFilter === "low" ? "#d97706" : "transparent",
                                        "&:hover": {
                                            bgcolor: costFilter === "low" ? "#b45309" : "#fffbeb"
                                        }
                                    }}
                                >
                                    低コスパ
                                </Button>
                            </ButtonGroup>
                        </Box>

                        {/* 該当件数表示 */}
                        <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                            <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                                表示中
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                                {matchedCount} <Typography component="span" variant="caption" sx={{ color: "#64748b" }}>/ {totalCount} クラブ</Typography>
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default FilterControls;
