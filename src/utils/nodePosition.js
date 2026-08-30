
import { areaConfig, normalizeArea } from "../data/areas";

export function createNodes(
    data,
    centerX,
    centerY,
    maxRadius,
    minPower,
    maxPower
) {
    // ========================================
    // ① コスパ度を計算
    // 実際の選手数 - 予測選手数
    //
    // プラス → 予測より多く輩出 → 高コスパ (左側)
    // マイナス → 予測より少なく輩出 → 低コスパ (右側)
    // ========================================

    const clubs = data.map((club) => ({
        ...club,
        costPerformance:
            club.playerCount - (club.predictedPlayers ?? 0)
    }));

    // ========================================
    // ② コスパ度の最大・最小
    // ========================================

    const costValues = clubs.map(
        (club) => club.costPerformance
    );

    const minCost = costValues.length ? Math.min(...costValues) : -1;
    const maxCost = costValues.length ? Math.max(...costValues) : 1;

    // ========================================
    // ③ 基本位置を計算
    // ========================================

    const nodes = clubs.map((club) => {

        // ----------------------------------------
        // ノードの大きさ (4px ~ 24px)
        // ----------------------------------------
        const nodeRadius = Math.max(5, Math.min(26, 5 + club.playerCount * 1.6));

        // ========================================
        // コスパ度 → 左右位置 (角度)
        // 0 = 中央 (90度)
        // プラス (高コスパ) = 左側 (90度〜168度)
        // マイナス (低コスパ) = 右側 (90度〜12度)
        // ========================================

        let angle;

        if (club.costPerformance > 0) {
            // プラス → 高コスパ → 左側
            const ratio = maxCost > 0 ? club.costPerformance / maxCost : 0;
            angle = 90 + Math.min(1, Math.max(0, ratio)) * 76;
        } else if (club.costPerformance < 0) {
            // マイナス → 低コスパ → 右側
            const ratio = minCost < 0 ? Math.abs(club.costPerformance) / Math.abs(minCost) : 0;
            angle = 90 - Math.min(1, Math.max(0, ratio)) * 76;
        } else {
            angle = 90;
        }

        const originalAngle = angle;

        // ========================================
        // クラブパワー → 半径 (中心からの距離)
        // 低パワー(50) → 中心近く
        // 高パワー(100) → 外周近く
        // ========================================

        const powerRatio =
            Math.max(
                0.05,
                Math.min(
                    1,
                    (club.power - minPower) / (maxPower - minPower)
                )
            );

        const safeRadius = Math.max(20, maxRadius - nodeRadius - 15);
        const radius = powerRatio * safeRadius;

        // XY座標
        const rad = (angle * Math.PI) / 180;
        const x = centerX + radius * Math.cos(rad);
        const y = centerY - radius * Math.sin(rad);

        const normalizedArea = normalizeArea(club.area);
        const areaInfo = areaConfig[normalizedArea] || {
            id: "other",
            name: normalizedArea,
            color: "#a855f7",
            glowColor: "rgba(168, 85, 247, 0.4)",
            bgLight: "rgba(168, 85, 247, 0.15)",
            border: "#c084fc"
        };

        return {
            ...club,
            normalizedArea,
            areaColor: areaInfo.color,
            areaGlow: areaInfo.glowColor,
            areaClass: `area-${areaInfo.id}`,
            nodeRadius,
            radius,
            originalAngle,
            angle,
            x,
            y
        };
    });


    // ========================================
    // ⑤ ノードの重なりを解消
    //
    // 重要：
    // ・クラブパワー → 半径は変更しない
    // ・コスパ度 → 左右位置を基本維持
    // ・角度は originalAngle ±10°以内
    // ========================================

    const MAX_ANGLE_MOVE = 10;

    for (let loop = 0; loop < 80; loop++) {

        let moved = false;

        for (let i = 0; i < nodes.length; i++) {

            for (
                let j = i + 1;
                j < nodes.length;
                j++
            ) {

                const a = nodes[i];
                const b = nodes[j];

                // ------------------------------------
                // 現在の距離
                // ------------------------------------

                const dx =
                    b.x - a.x;

                const dy =
                    b.y - a.y;

                let distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );

                // ------------------------------------
                // 必要な最小距離
                // ------------------------------------

                const minDistance =
                    a.nodeRadius +
                    b.nodeRadius +
                    5;

                // 重なっていなければ何もしない
                if (distance >= minDistance) {
                    continue;
                }

                moved = true;

                // ------------------------------------
                // 完全に同じ位置の場合
                // ------------------------------------

                if (distance === 0) {
                    distance = 0.01;
                }

                // ------------------------------------
                // 重なっている量
                // ------------------------------------

                const overlap =
                    minDistance -
                    distance;

                // ====================================
                // まず角度方向に少しだけ移動する
                //
                // ただし originalAngle ±10°まで
                // ====================================

                let angleA =
                    a.angle;

                let angleB =
                    b.angle;

                // Aを少し左へ
                let newAngleA =
                    angleA + 1.0;

                // Bを少し右へ
                let newAngleB =
                    angleB - 1.0;

                // ------------------------------------
                // 角度の移動範囲を制限
                // ------------------------------------

                newAngleA =
                    Math.max(
                        a.originalAngle -
                        MAX_ANGLE_MOVE,

                        Math.min(
                            a.originalAngle +
                            MAX_ANGLE_MOVE,

                            newAngleA
                        )
                    );

                newAngleB =
                    Math.max(
                        b.originalAngle -
                        MAX_ANGLE_MOVE,

                        Math.min(
                            b.originalAngle +
                            MAX_ANGLE_MOVE,

                            newAngleB
                        )
                    );

                // ====================================
                // 新しい座標を計算
                // ====================================

                const radA =
                    newAngleA *
                    Math.PI / 180;

                const radB =
                    newAngleB *
                    Math.PI / 180;

                const newAX =
                    centerX +
                    a.radius *
                    Math.cos(radA);

                const newAY =
                    centerY -
                    a.radius *
                    Math.sin(radA);

                const newBX =
                    centerX +
                    b.radius *
                    Math.cos(radB);

                const newBY =
                    centerY -
                    b.radius *
                    Math.sin(radB);

                // ====================================
                // 新しい位置の方が近づく場合は
                // 角度変更ではなく少し押し出す
                // ====================================

                const newDx =
                    newBX - newAX;

                const newDy =
                    newBY - newAY;

                const newDistance =
                    Math.sqrt(
                        newDx * newDx +
                        newDy * newDy
                    );

                // ------------------------------------
                // 新しい角度で改善する場合
                // ------------------------------------

                if (
                    newDistance > distance
                ) {

                    a.angle =
                        newAngleA;

                    b.angle =
                        newAngleB;

                    a.x =
                        newAX;

                    a.y =
                        newAY;

                    b.x =
                        newBX;

                    b.y =
                        newBY;

                } else {

                    // ==================================
                    // 角度をこれ以上動かせない場合
                    // 少しだけ位置を押し出す
                    // ==================================

                    const pushX =
                        dx / distance;

                    const pushY =
                        dy / distance;

                    const pushAmount =
                        overlap * 0.15;

                    a.x -=
                        pushX *
                        pushAmount;

                    a.y -=
                        pushY *
                        pushAmount;

                    b.x +=
                        pushX *
                        pushAmount;

                    b.y +=
                        pushY *
                        pushAmount;
                }
            }
        }

        if (!moved) {
            break;
        }
    }

    // ========================================
    // ⑥ 半円の外側にはみ出さないようにする
    // ========================================

    nodes.forEach((node) => {

        const dx =
            node.x - centerX;

        const dy =
            node.y - centerY;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        const maxSafe =
            maxRadius -
            node.nodeRadius -
            10;

        // ----------------------------------------
        // 外側にはみ出した場合
        // ----------------------------------------

        if (distance > maxSafe) {

            const ratio =
                maxSafe / distance;

            node.x =
                centerX +
                dx * ratio;

            node.y =
                centerY +
                dy * ratio;
        }

        // ----------------------------------------
        // 半円より下に行かせない
        // ----------------------------------------

        if (
            node.y >
            centerY -
            node.nodeRadius
        ) {

            node.y =
                centerY -
                node.nodeRadius;
        }
    });

    return nodes;
}

