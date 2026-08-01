function BackCircle({
    centerX,
    centerY,
    maxRadius,
    minPower,
    maxPower,
    areas,
    boundaryAngles
}) {
    return (
        <>
            {/* 外側半円 */}
            <path
                d={`M ${centerX - maxRadius} ${centerY}
                    A ${maxRadius} ${maxRadius} 0 0 1
                    ${centerX + maxRadius} ${centerY}`}
                fill="none"
                stroke="black"
                strokeWidth="3"
            />

            {/* 目盛り円 */}
            {[60, 70, 80, 90, 100].map(power => {
                const r =
                    ((power - minPower) /
                        (maxPower - minPower))
                    * maxRadius;

                return (
                    <g key={power}>
                        <circle
                            cx={centerX}
                            cy={centerY}
                            r={r}
                            fill="none"
                            stroke="gray"
                            strokeDasharray="5 5"
                        />
                        {/*左*/}
                        <line
                            x1={centerX - r}
                            y1={centerY}
                            x2={centerX - r - 8}
                            y2={centerY}
                            stroke="gray"
                        />
                        <text
                            x={centerX - r - 12}
                            y={centerY + 15}
                            textAnchor="end"
                            fontSize="13"
                        >
                            {power}
                        </text>
                        {/*右*/}
                        <line
                            x1={centerX + r}
                            y1={centerY}
                            x2={centerX + r + 8}
                            y2={centerY}
                            stroke="gray"
                        />

                        <text
                            x={centerX + r + 12}
                            y={centerY + 15}
                            textAnchor="start"
                            fontSize="13"
                        >
                            {power}
                        </text>
                    </g>
                );
            })}

            <text
                x={centerX}
                y={centerY + 18}
                textAnchor="middle"
                fontSize="13"
            >
                50
            </text>

            {/* エリア名 */}
            {Object.entries(areas).map(([name, range]) => {

                let angle = (range[0] + range[1]) / 2;
                const rad = angle * Math.PI / 180;
                let labelRadius = maxRadius + 40;

                if (name === "アジア・オセアニア") {
                    angle -= 10;
                    labelRadius = maxRadius + 70;
                }
                return (
                    <text
                        key={name}
                        x={centerX + labelRadius * Math.cos(rad)}
                        y={centerY - labelRadius * Math.sin(rad)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="18"
                        fontWeight="bold"
                    >
                        {
                            name === "アジア・オセアニア"
                                ? (
                                    <>
                                        <tspan
                                            x={centerX + labelRadius * Math.cos(rad)}
                                            dy="-10"
                                        >
                                            アジア
                                        </tspan>
                                        <tspan
                                            x={centerX + labelRadius * Math.cos(rad)}
                                            dy="25"
                                        >
                                            オセアニア
                                        </tspan>
                                    </>
                                )
                                : name
                        }
                    </text>
                );
            })}

            {/* 境界線 */}
            {boundaryAngles.map((angle, index) => {
                const rad = angle * Math.PI / 180;

                return (
                    <line
                        key={index}
                        x1={centerX}
                        y1={centerY}
                        x2={centerX + maxRadius * Math.cos(rad)}
                        y2={centerY - maxRadius * Math.sin(rad)}
                        stroke="black"
                    />
                );
            })}
        </>
    );
}

export default BackCircle;