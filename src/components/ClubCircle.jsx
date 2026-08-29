function ClubCircle({
    club,
    visiblePower,
    minPlayers,
    hoverClub,
    setHoverClub,
    selectedClub,
    setSelectedClub
}) {

    // 表示するかどうか
    const isVisible =
        visiblePower.includes(club.powerClass) &&
        club.playerCount >= minPlayers;

    // ホバーしているか
    const isHovered =
        hoverClub?.club === club.club;

    return (
        <circle

            /* =========================
               位置
            ========================= */
            cx={club.x}
            cy={club.y}

            /* =========================
               選手数によって円の大きさを変更
            ========================= */
            r={
                5 +
                club.playerCount * 1.5
            }

            /* =========================
               チームパワーによる色
            ========================= */
            className={club.powerClass}

            /* =========================
               ホバーした円に黒いふち
            ========================= */
            stroke={
                isHovered
                    ? "black"
                    : "none"
            }

            strokeWidth={
                isHovered
                    ? 4
                    : 0
            }

            /* =========================
               表示・非表示
            ========================= */
            style={{

                opacity:
                    isVisible
                        ? 0.7
                        : 0,

                transition:
                    "opacity 0.5s ease",

                pointerEvents:
                    isVisible
                        ? "auto"
                        : "none"
            }}

            /* =========================
               マウスを乗せた
            ========================= */
            onMouseEnter={() =>
                setHoverClub(club)
            }

            /* =========================
               マウスを離した
            ========================= */
            onMouseLeave={() =>
                setHoverClub(null)
            }

            /* =========================
               クリック
               同じクラブなら閉じる
               違うクラブなら切り替える
            ========================= */
            onClick={() =>
                setSelectedClub(
                    selectedClub?.club === club.club
                        ? null
                        : club
                )
            }

        />
    );
}

export default ClubCircle;