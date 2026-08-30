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
import Divider from "@mui/material/Divider";
import {
    SearchIcon,
    CloseIcon,
    RefreshIcon
} from "./Icons";

function FilterControls({
    searchText,
    setSearchText,
    searchOptions,
    minPlayers,
    setMinPlayers,
    matchedCount,
    totalCount,
    totalPlayers,
    avgPower,
    isFiltered,
    onResetFilters
}) {
    return (
        <Card
            sx={{
                mb: 2,
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 2.5,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
            }}
        >
            {/* 上部: 統計サマリー & 検索バー & リセット */}
            <Box
                sx={{
                    px: { xs: 2, md: 2.5 },
                    py: 1.2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1.5,
                    borderBottom: "1px solid #f1f5f9"
                }}
            >
                {/* 統計バッジ */}
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    {totalCount > 0 && (
                        <>
                            <Chip
                                label={`クラブ数: ${totalCount}`}
                                size="small"
                                sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, height: 26 }}
                            />
                            <Chip
                                label={`総選手数: ${totalPlayers.toLocaleString()}名`}
                                size="small"
                                sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, height: 26 }}
                            />
                            <Chip
                                label={`平均クラブパワー: ${avgPower.toFixed(1)}`}
                                size="small"
                                sx={{ bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 600, height: 26 }}
                            />
                        </>
                    )}
                </Stack>

                {/* 検索バー & リセットボタン & 該当数 */}
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                    {isFiltered && (
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={onResetFilters}
                            startIcon={<RefreshIcon sx={{ fontSize: 14 }} />}
                            sx={{
                                height: 32,
                                fontSize: "0.75rem",
                                borderColor: "#fecdd3",
                                color: "#e11d48",
                                bgcolor: "#fff1f2",
                                "&:hover": {
                                    borderColor: "#fda4af",
                                    bgcolor: "#ffe4e6"
                                }
                            }}
                        >
                            リセット
                        </Button>
                    )}

                    {/* 検索入力 */}
                    <Box sx={{ width: { xs: "100%", sm: 220, md: 260 } }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="クラブ名を検索..."
                            value={searchText}
                            onChange={(event) => setSearchText(event.target.value)}
                            inputProps={{ list: "club-search-options" }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    height: 34,
                                    fontSize: "0.85rem"
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchText ? (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setSearchText("")}
                                            edge="end"
                                        >
                                            <CloseIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                            }}
                        />
                        <datalist id="club-search-options">
                            {searchOptions.map((option) => (
                                <option key={option} value={option} />
                            ))}
                        </datalist>
                    </Box>

                    {/* 該当件数 */}
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
                        表示中: {matchedCount} <Typography component="span" variant="caption" sx={{ color: "#64748b" }}>/ {totalCount}</Typography>
                    </Typography>
                </Stack>
            </Box>

            {/* 下部: 選手数フィルター */}
            <CardContent sx={{ p: { xs: 2, md: 2.5 }, pt: { xs: 1.5, md: 1.5 } }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: { xs: "stretch", md: "center" },
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2
                    }}
                >
                    {/* 選手数スライダー */}
                    <Box sx={{ width: { xs: "100%", md: 360 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.2, alignItems: "center" }}>
                            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                                出場選手数:
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
                </Box>
            </CardContent>
        </Card>
    );
}

export default FilterControls;
