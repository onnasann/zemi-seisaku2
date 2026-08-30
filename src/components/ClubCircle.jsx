import { useMemo } from "react";

function ClubCircle({
    club,
    selectedAreas,
    minPlayers,
    searchText,
    hoverClub,
    setHoverClub,
    selectedClub,
    setSelectedClub
}) {
    // 1. エリアフィルター
    const matchArea = selectedAreas.includes(club.normalizedArea);

    // 2. 選手数フィルター
    const matchPlayers = club.playerCount >= minPlayers;

    // 3. 検索マッチ
    const matchSearch = useMemo(() => {
        if (!searchText) return true;
        const q = searchText.toLowerCase();
        return club.club.toLowerCase().includes(q) || (club.area && club.area.toLowerCase().includes(q));
    }, [searchText, club]);

    const isVisible = matchArea && matchPlayers;
    const isHighlighted = isVisible && matchSearch;
    const isHovered = hoverClub?.club === club.club;
    const isSelected = selectedClub?.club === club.club;

    const baseRadius = club.nodeRadius || (4 + club.playerCount * 1.5);
    const radius = isSelected ? baseRadius + 3 : isHovered ? baseRadius + 2 : baseRadius;

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
            onClick={() => setSelectedClub(isSelected ? null : club)}
        >
            {/* 選択時 / ホバー時の外枠リング */}
            {(isSelected || isHovered) && (
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
                stroke={isSelected ? "#0f172a" : isHovered ? "#0f172a" : "#ffffff"}
                strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.2}
                style={{
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))"
                }}
            />

            {/* 主要クラブ・ホバー時のクラブ名テキスト */}
            {(isHovered || isSelected || (isHighlighted && club.playerCount >= 10)) && (
                <text
                    x={club.x}
                    y={club.y - radius - 4}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize={isHovered || isSelected ? "12px" : "10px"}
                    fontWeight={isHovered || isSelected ? 800 : 600}
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