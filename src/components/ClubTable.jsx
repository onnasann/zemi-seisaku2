import { useState, useMemo } from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { areaConfig } from "../data/areas";

function ClubTable({ data, onSelectClub }) {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("rank");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            let valA = a[orderBy];
            let valB = b[orderBy];

            if (typeof valA === "string") {
                return order === "asc"
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }
            if (valA == null) valA = 0;
            if (valB == null) valB = 0;
            return order === "asc" ? valA - valB : valB - valA;
        });
    }, [data, order, orderBy]);

    const paginatedData = useMemo(() => {
        return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedData, page, rowsPerPage]);

    return (
        <Card
            sx={{
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                overflow: "hidden"
            }}
        >
            <TableContainer sx={{ maxHeight: "calc(100vh - 350px)" }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow
                            sx={{
                                "& th": {
                                    bgcolor: "#f8fafc",
                                    color: "#475569",
                                    fontWeight: 700,
                                    fontSize: "0.8rem",
                                    borderColor: "#e2e8f0",
                                    py: 1.2
                                }
                            }}
                        >
                            <TableCell width={70}>
                                <TableSortLabel
                                    active={orderBy === "rank"}
                                    direction={orderBy === "rank" ? order : "asc"}
                                    onClick={() => handleRequestSort("rank")}
                                >
                                    順位
                                </TableSortLabel>
                            </TableCell>

                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "club"}
                                    direction={orderBy === "club" ? order : "asc"}
                                    onClick={() => handleRequestSort("club")}
                                >
                                    クラブ名
                                </TableSortLabel>
                            </TableCell>

                            <TableCell width={130}>
                                <TableSortLabel
                                    active={orderBy === "area"}
                                    direction={orderBy === "area" ? order : "asc"}
                                    onClick={() => handleRequestSort("area")}
                                >
                                    所属エリア
                                </TableSortLabel>
                            </TableCell>

                            <TableCell align="right" width={110}>
                                <TableSortLabel
                                    active={orderBy === "power"}
                                    direction={orderBy === "power" ? order : "asc"}
                                    onClick={() => handleRequestSort("power")}
                                >
                                    クラブパワー
                                </TableSortLabel>
                            </TableCell>

                            <TableCell align="right" width={110}>
                                <TableSortLabel
                                    active={orderBy === "playerCount"}
                                    direction={orderBy === "playerCount" ? order : "asc"}
                                    onClick={() => handleRequestSort("playerCount")}
                                >
                                    選手数
                                </TableSortLabel>
                            </TableCell>

                            <TableCell align="right" width={120}>
                                <TableSortLabel
                                    active={orderBy === "predictedPlayers"}
                                    direction={orderBy === "predictedPlayers" ? order : "asc"}
                                    onClick={() => handleRequestSort("predictedPlayers")}
                                >
                                    予測選手数
                                </TableSortLabel>
                            </TableCell>

                            <TableCell align="right" width={130}>
                                <TableSortLabel
                                    active={orderBy === "costPerformance"}
                                    direction={orderBy === "costPerformance" ? order : "asc"}
                                    onClick={() => handleRequestSort("costPerformance")}
                                >
                                    輩出力
                                </TableSortLabel>
                            </TableCell>

                            <TableCell align="center" width={90}>
                                操作
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 6, color: "#64748b" }}>
                                    該当するクラブがありません
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((club) => {
                                const areaInfo = areaConfig[club.normalizedArea || club.area] || {
                                    color: "#2563eb",
                                    bgLight: "#eff6ff",
                                    border: "#bfdbfe",
                                    textColor: "#1d4ed8"
                                };
                                const isHighCost = club.costPerformance > 0;

                                return (
                                    <TableRow
                                        key={club.club}
                                        hover
                                        sx={{
                                            "&:hover": { bgcolor: "#f8fafc" },
                                            "& td": { borderColor: "#f1f5f9", py: 1 }
                                        }}
                                    >
                                        {/* 順位 */}
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: club.rank <= 3 ? "#d97706" : "#64748b",
                                                    fontFamily: "monospace"
                                                }}
                                            >
                                                #{club.rank}
                                            </Typography>
                                        </TableCell>

                                        {/* クラブ名 */}
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#0f172a",
                                                    cursor: "pointer",
                                                    "&:hover": { color: "#2563eb" }
                                                }}
                                                onClick={() => onSelectClub(club)}
                                            >
                                                {club.club}
                                            </Typography>
                                        </TableCell>

                                        {/* エリア */}
                                        <TableCell>
                                            <Chip
                                                label={club.normalizedArea || club.area}
                                                size="small"
                                                sx={{
                                                    bgcolor: areaInfo.bgLight,
                                                    color: areaInfo.textColor,
                                                    border: `1px solid ${areaInfo.border}`,
                                                    fontWeight: 600,
                                                    fontSize: "0.72rem",
                                                    height: 22
                                                }}
                                            />
                                        </TableCell>

                                        {/* クラブパワー */}
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: "#2563eb" }}>
                                                {club.power}
                                            </Typography>
                                        </TableCell>

                                        {/* 選手数 */}
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                                                {club.playerCount} 名
                                            </Typography>
                                        </TableCell>

                                        {/* 予測選手数 */}
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ color: "#64748b" }}>
                                                {club.predictedPlayers != null ? club.predictedPlayers.toFixed(2) : "-"}
                                            </Typography>
                                        </TableCell>

                                        {/* 輩出力 */}
                                        <TableCell align="right">
                                            <Chip
                                                label={
                                                    isHighCost
                                                        ? `+${club.costPerformance.toFixed(2)}`
                                                        : club.costPerformance.toFixed(2)
                                                }
                                                size="small"
                                                sx={{
                                                    bgcolor: isHighCost ? "#f0fdf4" : "#fffbeb",
                                                    color: isHighCost ? "#15803d" : "#b45309",
                                                    border: `1px solid ${isHighCost ? "#bbf7d0" : "#fde68a"}`,
                                                    fontWeight: 700,
                                                    fontSize: "0.72rem",
                                                    height: 22
                                                }}
                                            />
                                        </TableCell>

                                        {/* 詳細ボタン */}
                                        <TableCell align="center">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => onSelectClub(club)}
                                                sx={{
                                                    fontSize: "0.72rem",
                                                    py: 0.2,
                                                    px: 1,
                                                    borderRadius: 1,
                                                    borderColor: "#cbd5e1",
                                                    color: "#334155"
                                                }}
                                            >
                                                詳細
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 15, 25, 50]}
                component="div"
                count={sortedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                sx={{
                    borderTop: "1px solid #f1f5f9",
                    color: "#64748b"
                }}
            />
        </Card>
    );
}

export default ClubTable;
