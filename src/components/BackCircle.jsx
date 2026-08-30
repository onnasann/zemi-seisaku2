function BackCircle({
    centerX,
    centerY,
    maxRadius,
    minPower = 50,
    maxPower = 100,
    minCost = -3.76,
    maxCost = 14.25
}) {
    const powers = [60, 70, 80, 90, 100];

    // コスパ度の境界線（境界値の定義）
    const costBoundaries = [
        { value: 10, label: "コスパ +10" },
        { value: 5, label: "コスパ +5" },
        { value: 2, label: "コスパ +2" },
        { value: 0, label: "コスパ 0（基準）", isBase: true },
        { value: -2, label: "コスパ -2" }
    ];

    // コスパ度から角度への変換（nodePosition.jsと完全一致）
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
                Power 50
            </text>

            {/* ==================================
                コスパ度 境界線 & ラベル
            ================================== */}
            {costBoundaries.map((boundary) => {
                const angle = getAngle(boundary.value);
                const rad = (angle * Math.PI) / 180;

                // 境界線の終点（外周）
                const endX = centerX + maxRadius * Math.cos(rad);
                const endY = centerY - maxRadius * Math.sin(rad);

                // 外側のラベル位置
                const labelRadius = maxRadius + 16;
                const labelX = centerX + labelRadius * Math.cos(rad);
                const labelY = centerY - labelRadius * Math.sin(rad);

                const isBase = boundary.isBase;

                return (
                    <g key={boundary.value}>
                        {/* 放射状の境界線 */}
                        <line
                            x1={centerX}
                            y1={centerY}
                            x2={endX}
                            y2={endY}
                            stroke={isBase ? "#475569" : "#94a3b8"}
                            strokeWidth={isBase ? 2 : 1.2}
                            strokeDasharray={isBase ? "none" : "3 3"}
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
                                stroke={isBase ? "#475569" : "#cbd5e1"}
                                strokeWidth={isBase ? 1.5 : 1}
                            />
                            <text
                                x="0"
                                y="4"
                                textAnchor="middle"
                                fontSize="9.5"
                                fontWeight={isBase ? 800 : 600}
                                fill={isBase ? "#0f172a" : "#475569"}
                                fontFamily="Inter, sans-serif"
                            >
                                {boundary.label}
                            </text>
                        </g>
                    </g>
                );
            })}
        </g>
    );
}

export default BackCircle;