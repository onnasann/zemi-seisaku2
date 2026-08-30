import { useMemo } from "react";

function ClubCircle({
    club,
    minPlayers,
    searchText,
    hoverClub,
    setHoverClub,
    selectedClub,
    setSelectedClub,
    // 範囲選択モード用
    isRangeMode = false,
    rangeEndpoints = [],   // 選択済みの端点クラブ配列 (max 2)
    activeCostRange = null,
    onRangeClick           // 範囲選択モード時のクリックハンドラ
}) {
    // 選手数フィルター
    const matchPlayers = club.playerCount >= minPlayers;

    // 3. 検索マッチ
    const matchSearch = useMemo(() => {
        if (!searchText) return true;
        const q = searchText.toLowerCase();
        return club.club.toLowerCase().includes(q) || (club.area && club.area.toLowerCase().includes(q));
    }, [searchText, club]);

    const isVisible = matchPlayers;
    const isHighlighted = isVisible && matchSearch;
    const isHovered = hoverClub?.club === club.club;
    const isSelected = selectedClub?.club === club.club;

    // 範囲選択モード: このクラブが端点として選択されているか
    const rangeEndpointIndex = rangeEndpoints.findIndex(e => e.club === club.club);
    const isRangeEndpoint = rangeEndpointIndex >= 0;

    // クリック順ではなく、低輩出力端をオレンジ、高輩出力端をパープルにする
    const isLowEndpoint = activeCostRange
        ? club.costPerformance === activeCostRange.min
        : rangeEndpointIndex === 0;
    const rangeRingColor = isLowEndpoint ? "#f97316" : "#6366f1";

    const baseRadius = club.nodeRadius || (4 + club.playerCount * 1.5);
    const radius = (isSelected && !isRangeMode) ? baseRadius + 3
        : isHovered ? baseRadius + 2
        : baseRadius;

    const handleClick = () => {
        if (isRangeMode && !activeCostRange) {
            onRangeClick && onRangeClick(club);
            return;
        }
        setSelectedClub(isSelected ? null : club);
    };

    return (
        <g
            style={{
                cursor: isVisible ? "pointer" : "default",
                opacity: !isVisible ? 0.08 : !isHighlighted ? 0.2 : 0.9,
                transition: "opacity 0.2s ease",
                pointerEvents: isVisible ? "auto" : "none"
            }}
            onMouseEnter={() => setHoverClub(club)}
            onMouseLeave={() => setHoverClub(null)}
            onClick={handleClick}
        >
            {/* 範囲選択モード: 端点ノードの強調リング */}
            {isRangeMode && isRangeEndpoint && (
                <>
                    {/* 外側グロー */}
                    <circle
                        cx={club.x}
                        cy={club.y}
                        r={radius + 9}
                        fill="none"
                        stroke={rangeRingColor}
                        strokeWidth="2"
                        opacity="0.3"
                    />
                    {/* 内側リング */}
                    <circle
                        cx={club.x}
                        cy={club.y}
                        r={radius + 5}
                        fill="none"
                        stroke={rangeRingColor}
                        strokeWidth="2.5"
                    />
                </>
            )}

            {/* 通常の選択時 / ホバー時の外枠リング */}
            {!isRangeMode && (isSelected || isHovered) && (
                <circle
                    cx={club.x}
                    cy={club.y}
                    r={radius + (isSelected ? 5 : 3)}
                    fill="none"
                    stroke={isSelected ? "#2563eb" : "#475569"}
                    strokeWidth={isSelected ? 2 : 1.2}
                    strokeDasharray={isSelected ? "3 3" : "none"}
                />
            )}

            {/* クラブ本体円 */}
            <circle
                cx={club.x}
                cy={club.y}
                r={radius}
                fill={club.areaColor || "#3b82f6"}
                stroke={
                    isRangeMode && isRangeEndpoint ? rangeRingColor
                    : (isSelected && !isRangeMode) ? "#0f172a"
                    : isHovered ? "#0f172a"
                    : "#ffffff"
                }
                strokeWidth={
                    isRangeMode && isRangeEndpoint ? 3
                    : (isSelected && !isRangeMode) ? 2.5
                    : isHovered ? 2
                    : 1.2
                }
                style={{
                    filter: isRangeMode && isRangeEndpoint
                        ? `drop-shadow(0 2px 6px ${rangeRingColor}80)`
                        : "drop-shadow(0 1px 2px rgba(0,0,0,0.15))"
                }}
            />

            {/* 主要クラブ・ホバー時・範囲端点のクラブ名テキスト */}
            {(isHovered || (isSelected && !isRangeMode) || (isRangeMode && isRangeEndpoint) || (isHighlighted && club.playerCount >= 10)) && (
                <text
                    x={club.x}
                    y={club.y - radius - 4}
                    textAnchor="middle"
                    fill={isRangeMode && isRangeEndpoint ? rangeRingColor : "#0f172a"}
                    fontSize={isHovered || (isSelected && !isRangeMode) || (isRangeMode && isRangeEndpoint) ? "12px" : "10px"}
                    fontWeight={isHovered || (isSelected && !isRangeMode) || (isRangeMode && isRangeEndpoint) ? 800 : 600}
                    style={{
                        paintOrder: "stroke",
                        stroke: "#ffffff",
                        strokeWidth: "3px",
                        strokeLinejoin: "round",
                        pointerEvents: "none",
                        fontFamily: "Inter, sans-serif"
                    }}
                >
                    {club.club}
                </text>
            )}
        </g>
    );
}

export default ClubCircle;
