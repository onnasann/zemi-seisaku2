function BackCircle({
    centerX,
    centerY,
    maxRadius,
    minPower,
    maxPower
}) {
    const powers = [60, 70, 80, 90, 100];

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

            {/* 左側（高コスパゾーン）うっすらグリーン */}
            <path
                d={`
                    M ${centerX - maxRadius} ${centerY}
                    A ${maxRadius} ${maxRadius} 0 0 1 ${centerX} ${centerY - maxRadius}
                    L ${centerX} ${centerY}
                    Z
                `}
                fill="rgba(22, 163, 74, 0.03)"
            />

            {/* 右側（低コスパゾーン）うっすらアンバー */}
            <path
                d={`
                    M ${centerX} ${centerY - maxRadius}
                    A ${maxRadius} ${maxRadius} 0 0 1 ${centerX + maxRadius} ${centerY}
                    L ${centerX} ${centerY}
                    Z
                `}
                fill="rgba(217, 119, 6, 0.03)"
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
                中心のコスパ基準線（垂直破線）
            ================================== */}
            <line
                x1={centerX}
                y1={centerY}
                x2={centerX}
                y2={centerY - maxRadius}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
            />

            {/* ==================================
                パワー同心円目盛り
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
                            fill="#f1f5f9"
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
                            fill="#f1f5f9"
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
                コスパ基準ヘッダーラベル
            ================================== */}
            <g transform={`translate(${centerX}, ${centerY - maxRadius - 12})`}>
                <rect
                    x="-60"
                    y="-12"
                    width="120"
                    height="22"
                    rx="6"
                    fill="#f8fafc"
                    stroke="#cbd5e1"
                    strokeWidth="1"
                />
                <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#475569"
                    fontFamily="Inter, sans-serif"
                >
                    コスパ基準（予測値）
                </text>
            </g>

            {/* ==================================
                左側：高コスパラベル
            ================================== */}
            <g
                transform={`translate(${centerX - maxRadius * 0.6}, ${
                    centerY - maxRadius * 0.2
                })`}
            >
                <rect
                    x="-75"
                    y="-14"
                    width="150"
                    height="28"
                    rx="6"
                    fill="#f0fdf4"
                    stroke="#bbf7d0"
                    strokeWidth="1"
                />
                <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill="#15803d"
                    fontFamily="Inter, sans-serif"
                >
                    高コスパ（選手多数）
                </text>
            </g>

            {/* ==================================
                右側：低コスパラベル
            ================================== */}
            <g
                transform={`translate(${centerX + maxRadius * 0.6}, ${
                    centerY - maxRadius * 0.2
                })`}
            >
                <rect
                    x="-75"
                    y="-14"
                    width="150"
                    height="28"
                    rx="6"
                    fill="#fffbeb"
                    stroke="#fde68a"
                    strokeWidth="1"
                />
                <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill="#b45309"
                    fontFamily="Inter, sans-serif"
                >
                    低コスパ（選手少数）
                </text>
            </g>
        </g>
    );
}

export default BackCircle;