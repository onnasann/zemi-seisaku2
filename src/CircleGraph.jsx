import { useState } from "react";
import Legend from "./Legend";
import BackCircle from "./BackCircle";

function CircleGraph({ data, visiblePower, togglePower }) {
    const width = window.innerWidth;
    const height = window.innerHeight * 0.8;
    const [hoverClub, setHoverClub] = useState(null);
    const centerX = width / 2;
    const centerY = height - 50;

    const maxRadius = Math.min(width / 2 - 50, height - 100);

    // 半円5分割
    const areas = {
        "北中米": [180, 150],
        "南アメリカ": [150, 115],
        "ヨーロッパ": [115, 50],
        "アジア": [50, 20],
        "アフリカ": [20, 0]
    };



    const areaData = {};

    data.forEach(club => {
        if (!areaData[club.area]) {
            areaData[club.area] = [];
        }
        areaData[club.area].push(club);
    });

    Object.values(areaData).forEach(clubs => {
        clubs.sort((a, b) => a.rank - b.rank);
    });

    const powerGroups = {};

    data.forEach(club => {
        const key = club.area + "_" + club.power;

        if (!powerGroups[key]) {
            powerGroups[key] = [];
        }

        powerGroups[key].push(club);
    });

    const minPower = 50;
    const maxPower = 100;
    const nodes = data.map(club => {
        const range =
            areas[club.area];

        if (!range) {
            return null;
        }

        const baseAngle = (range[0] + range[1]) / 2;
        const digit = club.rank % 10;

        // 左右の基本位置
        let offset;

        if (digit <= 4) {
            // 0〜4 左側
            offset = -30 + digit * 5;
        } else {
            // 5〜9 右側
            offset = 5 + (digit - 5) * 5;
        }


        // パワーによって散らす範囲を変更
        let spread;

        if (club.power < 65) {
            spread = 18;       // 中心付近 → 大きく散らす
        } else if (club.power < 80) {
            spread = 10;
        } else {
            spread = 5;        // 外側 → あまり散らさない
        }


        // ランクから決まる疑似乱数
        offset += Math.sin(club.rank * 17) * spread;
        const angle = Math.max(
            range[1] + 3,
            Math.min(
                range[0] - 3,
                baseAngle + offset
            )
        );

        const radius =
            ((club.power - minPower) /
                (maxPower - minPower))
            * maxRadius;
        const rad =
            angle * Math.PI / 180;
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


        return {
            ...club,
            powerClass,
            x: centerX + radius * Math.cos(rad),
            y: centerY - radius * Math.sin(rad)
        };


    }).filter(Boolean);


    const boundaryAngles = [
        ...Object.values(areas).map(range => range[0]),
        0
    ];


    return (
        <div className="graph-container">
            <svg
                width={width}
                height={height}
            >

                <BackCircle
                    centerX={centerX}
                    centerY={centerY}
                    maxRadius={maxRadius}
                    minPower={minPower}
                    maxPower={maxPower}
                    areas={areas}
                    boundaryAngles={boundaryAngles}
                />
                {/* クラブの点 */}

                {
                    nodes.map((club, index) => (
                        <circle
                            key={index}
                            cx={club.x}
                            cy={club.y}
                            r={5 + club.playerCount * 1.5}
                            className={club.powerClass}
                            style={{
                                opacity: visiblePower.includes(club.powerClass)
                                    ? 0.7
                                    : 0,

                                transition: "opacity 0.5s ease",

                                pointerEvents: visiblePower.includes(club.powerClass)
                                    ? "auto"
                                    : "none"
                            }}
                            onMouseEnter={() => setHoverClub(club)}
                            onMouseLeave={() => setHoverClub(null)}
                        >
                        </circle>
                    ))
                }


            </svg>
            {hoverClub && (
                <div className="tooltip">
                    <h3>{hoverClub.club}</h3>
                    <p>選手数：{hoverClub.playerCount}</p>
                    <p>チームパワー：{hoverClub.power}</p>
                    <p>ランキング：{hoverClub.rank}</p>
                    <p>エリア：{hoverClub.area}</p>
                </div>
            )}
            <Legend
                visiblePower={visiblePower}
                togglePower={togglePower}
            />

        </div>
    );


}


export default CircleGraph;