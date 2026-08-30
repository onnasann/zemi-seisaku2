function BackCircle({
    centerX,
    centerY,
    maxRadius,
    minPower = 50,
    maxPower = 100,
    minCost = -3.76,
    maxCost = 14.25,
    costRange = null  // { min, max } — 範囲選択モード時。null のとき通常表示
}) {
    const powers = [60, 70, 80, 90, 100];

    // 輩出力の境界線（境界値の定義）
    const costBoundaries = [
        { value: 10, label: "輩出力 +10" },
        { value: 5, label: "輩出力 +5" },
        { value: 2, label: "輩出力 +2" },
        { value: 0, label: "輩出力 0（基準）", isBase: true },
        { value: -2, label: "輩出力 -2" }
    ];

    // 輩出力から角度への変換（nodePosition.jsと完全一致）
    const getAngle = (cost) => {
        if (cost > 0) {
            const ratio = maxCost > 0 ? cost / maxCost : 0;
            return 91 + Math.min(1, Math.max(0, ratio)) * 82;
        } else if (cost < 0) {
            const ratio = minCost < 0 ? Math.abs(cost) / Math.abs(minCost) : 0;
            return 89 - Math.min(1, Math.max(0, ratio)) * 82;
        }
        return 90;
    };

    return (
        <g className="back-circle-group">
            {/* ==================================
                半円の背景面（クリーンな白）
            ================================== */}
            <path
                d={`
                    M ${centerX - maxRadius} ${centerY}
                    A ${maxRadius} ${maxRadius} 0 0 1 ${centerX + maxRadius} ${centerY}
                    Z
                `}
                fill="#ffffff"
            />

            {/* ==================================
                外周アーチ
            ================================== */}
            <path
                d={`
                    M ${centerX - maxRadius} ${centerY}
                    A ${maxRadius} ${maxRadius} 0 0 1 ${centerX + maxRadius} ${centerY}
                `}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.5"
            />

            {/* 底辺ライン */}
            <line
                x1={centerX - maxRadius - 20}
                y1={centerY}
                x2={centerX + maxRadius + 20}
                y2={centerY}
                stroke="#cbd5e1"
                strokeWidth="1.5"
            />

            {/* ==================================
                パワー同心円目盛り (60, 70, 80, 90, 100)
            ================================== */}
            {powers.map((power) => {
                const r = ((power - minPower) / (maxPower - minPower)) * maxRadius;

                return (
                    <g key={power}>
                        {/* 目盛りアーチ */}
                        <path
                            d={`
                                M ${centerX - r} ${centerY}
                                A ${r} ${r} 0 0 1 ${centerX + r} ${centerY}
                            `}
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="1.2"
                            strokeDasharray="4 4"
                        />

                        {/* 左側パワーラベル */}
                        <rect
                            x={centerX - r - 14}
                            y={centerY + 6}
                            width="28"
                            height="18"
                            rx="4"
                            fill="#f8fafc"
                            stroke="#cbd5e1"
                            strokeWidth="1"
                        />
                        <text
                            x={centerX - r}
                            y={centerY + 19}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="600"
                            fill="#64748b"
                            fontFamily="Inter, sans-serif"
                        >
                            {power}
                        </text>

                        {/* 右側パワーラベル */}
                        <rect
                            x={centerX + r - 14}
                            y={centerY + 6}
                            width="28"
                            height="18"
                            rx="4"
                            fill="#f8fafc"
                            stroke="#cbd5e1"
                            strokeWidth="1"
                        />
                        <text
                            x={centerX + r}
                            y={centerY + 19}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="600"
                            fill="#64748b"
                            fontFamily="Inter, sans-serif"
                        >
                            {power}
                        </text>
                    </g>
                );
            })}

            {/* 中心パワー 50 */}
            <circle cx={centerX} cy={centerY} r="3.5" fill="#2563eb" />
            <text
                x={centerX}
                y={centerY + 20}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#2563eb"
                fontFamily="Inter, sans-serif"
            >
                Club Power 50
            </text>

            {/* ==================================
                輩出力 境界線 & ラベル（通常モードのみ）
            ================================== */}
            {!costRange && costBoundaries.map((boundary) => {
                const angle = getAngle(boundary.value);
                const rad = (angle * Math.PI) / 180;

                // 境界線の終点（外周）
                const endX = centerX + maxRadius * Math.cos(rad);
                const endY = centerY - maxRadius * Math.sin(rad);

                // 外側のラベル位置
                const labelRadius = maxRadius + 16;
                const labelX = centerX + labelRadius * Math.cos(rad);
                const labelY = centerY - labelRadius * Math.sin(rad);

                return (
                    <g key={boundary.value}>
                        {/* 放射状の境界線 */}
                        <line
                            x1={centerX}
                            y1={centerY}
                            x2={endX}
                            y2={endY}
                            stroke="#94a3b8"
                            strokeWidth="1.2"
                            strokeDasharray="3 3"
                        />

                        {/* 境界値ラベル */}
                        <g transform={`translate(${labelX}, ${labelY})`}>
                                <rect
                                    x="-36"
                                    y="-10"
                                    width="72"
                                    height="20"
                                    rx="4"
                                    fill="#ffffff"
                                    stroke="#cbd5e1"
                                    strokeWidth="1"
                                />
                                <text
                                    x="0"
                                    y="4"
                                    textAnchor="middle"
                                    fontSize="9.5"
                                    fontWeight="600"
                                    fill="#475569"
                                    fontFamily="Inter, sans-serif"
                                >
                                    {boundary.label}
                                </text>
                        </g>
                    </g>
                );
            })}

            {/* ==================================
                範囲選択モード: 両端ラベル
                右端(0°) = 最小輩出力, 左端(180°) = 最大輩出力
            ================================== */}
            {costRange && (() => {
                const minRad = 0;
                const maxRad = Math.PI;
                const labelRadius = maxRadius + 16;

                const minEndX = centerX + maxRadius * Math.cos(minRad);
                const minEndY = centerY - maxRadius * Math.sin(minRad);
                const minLabelX = centerX + labelRadius * Math.cos(minRad);
                const minLabelY = centerY - labelRadius * Math.sin(minRad);

                const maxEndX = centerX + maxRadius * Math.cos(maxRad);
                const maxEndY = centerY - maxRadius * Math.sin(maxRad);
                const maxLabelX = centerX + labelRadius * Math.cos(maxRad);
                const maxLabelY = centerY - labelRadius * Math.sin(maxRad);

                // 中間参照線（90°）
                const midCost = (costRange.min + costRange.max) / 2;
                const midEndX = centerX;
                const midEndY = centerY - maxRadius;
                const midLabelX = centerX;
                const midLabelY = centerY - maxRadius - 16;

                return (
                    <g>
                        {/* 右端ライン: 最小輩出力 (0°) */}
                        <line x1={centerX} y1={centerY} x2={minEndX} y2={minEndY}
                            stroke="#f97316" strokeWidth="2" strokeDasharray="5 3" />
                        <g transform={`translate(${minLabelX}, ${minLabelY})`}>
                            <rect x="-38" y="-11" width="76" height="22" rx="5"
                                fill="#fff7ed" stroke="#f97316" strokeWidth="1.5" />
                            <text x="0" y="4" textAnchor="middle" fontSize="9.5" fontWeight="800"
                                fill="#c2410c" fontFamily="Inter, sans-serif">
                                {costRange.min >= 0 ? "+" : ""}{costRange.min.toFixed(1)}（低）
                            </text>
                        </g>

                        {/* 左端ライン: 最大輩出力 (180°) */}
                        <line x1={centerX} y1={centerY} x2={maxEndX} y2={maxEndY}
                            stroke="#6366f1" strokeWidth="2" strokeDasharray="5 3" />
                        <g transform={`translate(${maxLabelX}, ${maxLabelY})`}>
                            <rect x="-38" y="-11" width="76" height="22" rx="5"
                                fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" />
                            <text x="0" y="4" textAnchor="middle" fontSize="9.5" fontWeight="800"
                                fill="#4338ca" fontFamily="Inter, sans-serif">
                                {costRange.max >= 0 ? "+" : ""}{costRange.max.toFixed(1)}（高）
                            </text>
                        </g>

                        {/* 中間参照ライン (90°) */}
                        <line x1={centerX} y1={centerY} x2={midEndX} y2={midEndY}
                            stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                        <g transform={`translate(${midLabelX}, ${midLabelY})`}>
                            <rect x="-32" y="-9" width="64" height="18" rx="4"
                                fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
                            <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="600"
                                fill="#64748b" fontFamily="Inter, sans-serif">
                                中間 {midCost >= 0 ? "+" : ""}{midCost.toFixed(1)}
                            </text>
                        </g>
                    </g>
                );
            })()}
        </g>
    );
}

export default BackCircle;
