import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { areaConfig } from "../data/areas";
import { HelpIcon } from "./Icons";

function GuideDialog({ open, onClose, regressionModel }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2.5,
                    bgcolor: "#ffffff",
                    p: 0.5
                }
            }}
        >
            <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1.2 }}>
                <Box
                    sx={{
                        p: 0.8,
                        borderRadius: 1.5,
                        bgcolor: "#eff6ff",
                        color: "#2563eb",
                        display: "flex"
                    }}
                >
                    <HelpIcon />
                </Box>
                <div>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                        半円グラフの見方
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                        クラブパワーと選手数による分析の見方
                    </Typography>
                </div>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: "#f1f5f9", py: 2.5 }}>
                <Stack spacing={2.5}>
                    {/* 輩出力計算の解説 */}
                    <Paper
                        sx={{
                            p: 2,
                            bgcolor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: 2
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ color: "#0f172a", fontWeight: 700, mb: 0.8 }}>
                            輩出力とは？
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6, fontSize: "0.85rem" }}>
                            全クラブの「クラブパワー」と「選手数」から回帰直線を計算し、
                            クラブパワー相応に予測される選手数と実際の選手数を比較しています。
                            予測より多ければ<strong>高輩出力（左側）</strong>、
                            少なければ<strong>低輩出力（右側）</strong>となります。
                        </Typography>
                        {regressionModel && (
                            <Box sx={{ mt: 1, p: 1, bgcolor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 1 }}>
                                <Typography variant="caption" sx={{ fontFamily: "monospace", color: "#2563eb", fontWeight: 600 }}>
                                    予測選手数 = {regressionModel.slope.toFixed(3)} × クラブパワー + ({regressionModel.intercept.toFixed(2)})
                                </Typography>
                            </Box>
                        )}
                    </Paper>

                    {/* 4つの見方 */}
                    <Grid container spacing={1.5}>
                        {/* 半径 */}
                        <Grid item xs={12} sm={6}>
                            <Paper sx={{ p: 1.5, height: "100%", bgcolor: "#ffffff", border: "1px solid #e2e8f0" }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#2563eb", mb: 0.3 }}>
                                    1. 中心からの距離（半径）
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#64748b", lineHeight: 1.5, display: "block" }}>
                                    <strong>クラブパワー（50〜100）</strong>を表します。外側ほどクラブパワーの高い強豪クラブです。
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* 角度 */}
                        <Grid item xs={12} sm={6}>
                            <Paper sx={{ p: 1.5, height: "100%", bgcolor: "#ffffff", border: "1px solid #e2e8f0" }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#16a34a", mb: 0.3 }}>
                                    2. 左右の位置（角度）
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#64748b", lineHeight: 1.5, display: "block" }}>
                                    <strong>輩出力</strong>を表します。左側ほど予測より多くの選手を輩出しています。
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* 円のサイズ */}
                        <Grid item xs={12} sm={6}>
                            <Paper sx={{ p: 1.5, height: "100%", bgcolor: "#ffffff", border: "1px solid #e2e8f0" }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.3 }}>
                                    3. 円の大きさ
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#64748b", lineHeight: 1.5, display: "block" }}>
                                    <strong>出場選手数</strong>を表します。円が大きいほど選手数が多くなります。
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* エリア色 */}
                        <Grid item xs={12} sm={6}>
                            <Paper sx={{ p: 1.5, height: "100%", bgcolor: "#ffffff", border: "1px solid #e2e8f0" }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.3 }}>
                                    4. 円の色（エリア）
                                </Typography>
                                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                                    {Object.entries(areaConfig).map(([name, conf]) => (
                                        <Chip
                                            key={name}
                                            label={name}
                                            size="small"
                                            sx={{
                                                bgcolor: conf.bgLight,
                                                color: conf.textColor,
                                                border: `1px solid ${conf.border}`,
                                                fontSize: "0.68rem",
                                                fontWeight: 600,
                                                height: 20
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 1.5 }}>
                <Button variant="contained" onClick={onClose} sx={{ px: 2.5 }}>
                    閉じる
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default GuideDialog;
