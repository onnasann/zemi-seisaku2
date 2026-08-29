export function createNodes(
    filteredData,
    areas,
    centerX,
    centerY,
    maxRadius,
    minPower,
    maxPower
) {

    return filteredData

        .map(club => {

            // =========================
            // エリア
            // =========================

            const area =
                (
                    club.area === "オセアニア" ||
                    club.area === "アジア"
                )
                    ? "アジア・オセアニア"
                    : club.area;


            // =========================
            // エリアの角度範囲
            // =========================

            const range =
                areas[area];

            if (!range) {
                return null;
            }


            // =========================
            // エリアの中心角
            // =========================

            const baseAngle =
                (
                    range[0] +
                    range[1]
                ) / 2;


            // =========================
            // ランキングの下一桁
            // =========================

            const digit =
                club.rank % 10;


            // =========================
            // 左右の基本位置
            // =========================

            let offset;

            if (digit <= 4) {

                offset =
                    -30 +
                    digit * 5;

            } else {

                offset =
                    5 +
                    (digit - 5) * 5;

            }


            // =========================
            // チームパワーによる散らし
            // =========================

            let spread;

            if (club.power < 65) {

                spread = 18;

            } else if (club.power < 80) {

                spread = 10;

            } else {

                spread = 5;

            }


            // =========================
            // ランキングによる疑似乱数
            // =========================

            offset +=
                Math.sin(
                    club.rank * 17
                ) * spread;


            // =========================
            // 最終的な角度
            // =========================

            const angle =
                Math.max(

                    range[1] + 3,

                    Math.min(

                        range[0] - 3,

                        baseAngle +
                        offset

                    )

                );


            // =========================
            // チームパワーから半径を計算
            // =========================

            const radius =
                (
                    (club.power - minPower) /
                    (maxPower - minPower)
                ) * maxRadius;


            // =========================
            // 度 → ラジアン
            // =========================

            const rad =
                angle *
                Math.PI /
                180;


            // =========================
            // パワーによる色分け
            // =========================

            let powerClass;

            if (club.power >= 95) {

                powerClass = "power6";

            } else if (club.power >= 90) {

                powerClass = "power5";

            } else if (club.power >= 80) {

                powerClass = "power4";

            } else if (club.power >= 70) {

                powerClass = "power3";

            } else if (club.power >= 60) {

                powerClass = "power2";

            } else {

                powerClass = "power1";

            }


            // =========================
            // ノードを返す
            // =========================

            return {

                ...club,

                powerClass,

                x:
                    centerX +
                    radius *
                    Math.cos(rad),

                y:
                    centerY -
                    radius *
                    Math.sin(rad)

            };

        })

        .filter(Boolean);
}