import { useMemo } from "react";
import { normalizeSearchText } from "../utils/searchText";

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
    const matchArea = selectedAreas.includes(club.normalizedArea);

    // 選手数フィルター
    const matchPlayers = club.playerCount >= minPlayers;

    // 3. 検索マッチ
    const matchSearch = useMemo(() => {
        if (!searchText) return true;
        const q = normalizeSearchText(searchText);
        return normalizeSearchText(club.club).includes(q);
    }, [searchText, club]);

    const isVisible = matchArea && matchPlayers;
    const isHighlighted = isVisible && matchSearch;
    const isSearchActive = Boolean(searchText?.trim());
    const isSearchResult = isVisible && isSearchActive && matchSearch;
    const isHovered = hoverClub?.club === club.club;
    const isSelected = selectedClub?.club === club.club;

    const baseRadius = club.nodeRadius || (4 + club.playerCount * 1.5);
    const radius = isSelected ? baseRadius + 3
        : isHovered ? baseRadius + 2
        : baseRadius;

    const handleClick = () => setSelectedClub(isSelected ? null : club);

    return (
        <g
            style={{
                cursor: isVisible ? "pointer" : "default",
                opacity: !isVisible ? 0 : !isHighlighted ? 0.08 : isSearchResult ? 1 : 0.9,
                transition: "opacity 0.2s ease",
                pointerEvents: isVisible ? "auto" : "none"
            }}
            onMouseEnter={() => setHoverClub(club)}
            onMouseLeave={() => setHoverClub(null)}
            onClick={handleClick}
        >
            {/* 検索に一致したノードの強調リング */}
            {isSearchResult && (
                <>
                    <circle
                        cx={club.x}
                        cy={club.y}
                        r={radius + 9}
                        fill="none"
                        stroke="#e11d48"
                        strokeWidth="2"
                        opacity="0.25"
                    />
                    <circle
                        cx={club.x}
                        cy={club.y}
                        r={radius + 5}
                        fill="none"
                        stroke="#e11d48"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                    />
                </>
            )}

            {/* 通常の選択時 / ホバー時の外枠リング */}
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
                stroke={isSearchResult ? "#e11d48" : isSelected ? "#0f172a" : isHovered ? "#0f172a" : "#ffffff"}
                strokeWidth={isSearchResult ? 3 : isSelected ? 2.5 : isHovered ? 2 : 1.2}
                style={{
                    filter: isSearchResult
                        ? "drop-shadow(0 2px 6px rgba(225,29,72,0.38))"
                        : "drop-shadow(0 1px 2px rgba(0,0,0,0.15))"
                }}
            />

            {/* 主要クラブ・ホバー時のクラブ名テキスト */}
            {(isHovered || isSelected || isSearchResult || (isHighlighted && club.playerCount >= 10)) && (
                <text
                    x={club.x}
                    y={club.y - radius - 4}
                    textAnchor="middle"
                    fill={isSearchResult ? "#be123c" : "#0f172a"}
                    fontSize={isHovered || isSelected || isSearchResult ? "12px" : "10px"}
                    fontWeight={isHovered || isSelected || isSearchResult ? 800 : 600}
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
