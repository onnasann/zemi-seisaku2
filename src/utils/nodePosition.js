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
    // プラス → 予測より多く輩出 → 高コスパ (厳格に左側: x < centerX, angle > 90°)
    // マイナス → 予測より少なく輩出 → 低コスパ (厳格に右側: x > centerX, angle < 90°)
    // ========================================

    const clubs = data.map((club) => ({
        ...club,
        costPerformance:
            club.playerCount - (club.predictedPlayers ?? 0)
    }));

    // ========================================
    // ② コスパ度の最大・最小
    // ========================================

    const costValues = clubs.map((club) => club.costPerformance);
    const minCost = costValues.length ? Math.min(...costValues) : -1;
    const maxCost = costValues.length ? Math.max(...costValues) : 1;

    // ========================================
    // ③ 基本位置を計算（半円内の各領域へ厳密にマッピング）
    // ========================================

    const nodes = clubs.map((club) => {
        // ノードの大きさ (4px ~ 22px)
        const nodeRadius = Math.max(4, Math.min(22, 4 + club.playerCount * 1.5));

        // ========================================
        // コスパ度 → 角度
        // プラス (高コスパ) = 左側 (91度 〜 176度)
        // マイナス (低コスパ) = 右側 (4度 〜 89度)
        // 0 = 完全に中央 (90度)
        // ========================================

        let baseAngle;

        if (club.costPerformance > 0) {
            const ratio = maxCost > 0 ? club.costPerformance / maxCost : 0;
            baseAngle = 91 + Math.min(1, Math.max(0, ratio)) * 82;
        } else if (club.costPerformance < 0) {
            const ratio = minCost < 0 ? Math.abs(club.costPerformance) / Math.abs(minCost) : 0;
            baseAngle = 89 - Math.min(1, Math.max(0, ratio)) * 82;
        } else {
            baseAngle = 90;
        }

        // ========================================
        // クラブパワー → 半径 (中心からの距離)
        // ========================================

        const powerRatio = Math.max(
            0.05,
            Math.min(1, (club.power - minPower) / (maxPower - minPower))
        );

        const safeRadius = Math.max(20, maxRadius - nodeRadius - 10);
        const radius = powerRatio * safeRadius;

        // 初期XY座標
        const rad = (baseAngle * Math.PI) / 180;
        let x = centerX + radius * Math.cos(rad);
        let y = centerY - radius * Math.sin(rad);

        // 境界線の厳密な遵守（初期配置）
        if (club.costPerformance > 0 && x > centerX - 1) {
            x = centerX - 1;
        } else if (club.costPerformance < 0 && x < centerX + 1) {
            x = centerX + 1;
        }

        const normalizedArea = normalizeArea(club.area);
        const areaInfo = areaConfig[normalizedArea] || {
            id: "other",
            name: normalizedArea,
            color: "#2563eb",
            bgLight: "#eff6ff",
            border: "#bfdbfe"
        };

        return {
            ...club,
            normalizedArea,
            areaColor: areaInfo.color,
            areaClass: `area-${areaInfo.id}`,
            nodeRadius,
            radius,
            baseAngle,
            angle: baseAngle,
            x,
            y
        };
    });

    // ========================================
    // ④ ノードの重なりを解消（境界線を絶対にまたがない）
    // ========================================

    const MAX_ANGLE_MOVE = 10;

    for (let loop = 0; loop < 60; loop++) {
        let moved = false;

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 0.01;
                const minDistance = a.nodeRadius + b.nodeRadius + 2;

                if (distance >= minDistance) {
                    continue;
                }

                moved = true;
                const overlap = minDistance - distance;

                // 角度調整
                let newAngleA = a.angle + 0.8;
                let newAngleB = b.angle - 0.8;

                // 各ノードの所属領域（プラス側 / マイナス側）を厳格に制限
                if (a.costPerformance > 0) {
                    newAngleA = Math.max(
                        91,
                        Math.min(
                            176,
                            Math.max(a.baseAngle - MAX_ANGLE_MOVE, Math.min(a.baseAngle + MAX_ANGLE_MOVE, newAngleA))
                        )
                    );
                } else if (a.costPerformance < 0) {
                    newAngleA = Math.max(
                        4,
                        Math.min(
                            89,
                            Math.max(a.baseAngle - MAX_ANGLE_MOVE, Math.min(a.baseAngle + MAX_ANGLE_MOVE, newAngleA))
                        )
                    );
                }

                if (b.costPerformance > 0) {
                    newAngleB = Math.max(
                        91,
                        Math.min(
                            176,
                            Math.max(b.baseAngle - MAX_ANGLE_MOVE, Math.min(b.baseAngle + MAX_ANGLE_MOVE, newAngleB))
                        )
                    );
                } else if (b.costPerformance < 0) {
                    newAngleB = Math.max(
                        4,
                        Math.min(
                            89,
                            Math.max(b.baseAngle - MAX_ANGLE_MOVE, Math.min(b.baseAngle + MAX_ANGLE_MOVE, newAngleB))
                        )
                    );
                }

                const radA = (newAngleA * Math.PI) / 180;
                const radB = (newAngleB * Math.PI) / 180;

                const nAX = centerX + a.radius * Math.cos(radA);
                const nAY = centerY - a.radius * Math.sin(radA);
                const nBX = centerX + b.radius * Math.cos(radB);
                const nBY = centerY - b.radius * Math.sin(radB);

                const newDist = Math.sqrt((nBX - nAX) ** 2 + (nBY - nAY) ** 2);

                if (newDist > distance) {
                    a.angle = newAngleA;
                    b.angle = newAngleB;
                    a.x = nAX;
                    a.y = nAY;
                    b.x = nBX;
                    b.y = nBY;
                } else {
                    const pushAmount = overlap * 0.18;
                    const pushX = (dx / distance) * pushAmount;
                    const pushY = (dy / distance) * pushAmount;

                    a.x -= pushX;
                    a.y -= pushY;
                    b.x += pushX;
                    b.y += pushY;
                }

                // 境界線（centerX）の厳格な維持
                if (a.costPerformance > 0 && a.x > centerX - 1) a.x = centerX - 1;
                if (a.costPerformance < 0 && a.x < centerX + 1) a.x = centerX + 1;
                if (b.costPerformance > 0 && b.x > centerX - 1) b.x = centerX - 1;
                if (b.costPerformance < 0 && b.x < centerX + 1) b.x = centerX + 1;
            }
        }

        if (!moved) break;
    }

    // ========================================
    // ⑤ 外周・底辺・境界線のはみ出し防止クランプ
    // ========================================

    nodes.forEach((node) => {
        const dx = node.x - centerX;
        const dy = node.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxSafe = maxRadius - node.nodeRadius - 4;

        if (distance > maxSafe) {
            const ratio = maxSafe / distance;
            node.x = centerX + dx * ratio;
            node.y = centerY + dy * ratio;
        }

        // 底辺（y = centerY）より下に行かない
        if (node.y > centerY - node.nodeRadius - 2) {
            node.y = centerY - node.nodeRadius - 2;
        }

        // 境界線（centerX）の最終保証
        if (node.costPerformance > 0 && node.x > centerX - 1) {
            node.x = centerX - 1;
        } else if (node.costPerformance < 0 && node.x < centerX + 1) {
            node.x = centerX + 1;
        }
    });

    return nodes;
}
