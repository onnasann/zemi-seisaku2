import { useState } from "react";

import BackCircle from "./BackCircle";
import ClubCircle from "./ClubCircle";
import ClubDetail from "./ClubDetail";
import Legend from "./Legend";

import { areas } from "../data/areas";
import { createNodes } from "../utils/nodePosition";

function CircleGraph({
    data,
    players,
    visiblePower,
    togglePower,
    searchText
}) {
    // ホバーしているクラブ
    const [hoverClub, setHoverClub] = useState(null);

    // 選択しているクラブ
    const [selectedClub, setSelectedClub] = useState(null);

    // 出場選手数フィルター
    const [minPlayers, setMinPlayers] = useState(1);

    // 画面サイズ
    const width = window.innerWidth;
    const height = window.innerHeight * 0.8;

    // 半円の中心
    const centerX = width / 2;
    const centerY = height - 50;

    // 最大半径
    const maxRadius = Math.min(
        width / 2 - 50,
        height - 100
    );

    // チームパワーの範囲
    const minPower = 50;
    const maxPower = 100;

    // =========================
    // クラブ名検索
    // =========================
    const filteredData = data.filter(club =>
        club.club
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    // =========================
    // クラブの座標を作成
    // =========================
    const nodes = createNodes(
        filteredData,
        areas,
        centerX,
        centerY,
        maxRadius,
        minPower,
        maxPower
    );

    // =========================
    // 選択したクラブの選手
    // =========================
    const selectedPlayers = players.filter(
        player =>
            player["所属チーム名"] ===
            selectedClub?.club
    );

    // =========================
    // 地域の境界線
    // =========================
    const boundaryAngles = [
        ...Object.values(areas).map(
            range => range[0]
        ),
        0
    ];

    return (
        <div className="graph-container">

            {/* =========================
                半円グラフ
            ========================= */}
            <svg
                width={width}
                height={height}
            >

                {/* 背景の半円 */}
                <BackCircle
                    centerX={centerX}
                    centerY={centerY}
                    maxRadius={maxRadius}
                    minPower={minPower}
                    maxPower={maxPower}
                    areas={areas}
                    boundaryAngles={boundaryAngles}
                />

                {/* =========================
                    クラブの円
                ========================= */}
                {nodes.map((club, index) => (
                    <ClubCircle
                        key={index}

                        club={club}

                        visiblePower={visiblePower}

                        minPlayers={minPlayers}

                        hoverClub={hoverClub}

                        setHoverClub={setHoverClub}

                        selectedClub={selectedClub}

                        setSelectedClub={setSelectedClub}
                    />
                ))}

            </svg>

            {/* =========================
                ホバー時の情報
            ========================= */}
            {hoverClub && (
                <div className="tooltip">

                    <h3>
                        {hoverClub.club}
                    </h3>

                    <p>
                        選手数：
                        {hoverClub.playerCount}人
                    </p>

                    <p>
                        チームパワー：
                        {hoverClub.power}
                    </p>

                    <p>
                        ランキング：
                        {hoverClub.rank}位
                    </p>

                    <p>
                        エリア：
                        {hoverClub.area}
                    </p>

                </div>
            )}

            {/* =========================
                クラブ詳細
            ========================= */}
            {selectedClub && (
                <ClubDetail
                    club={selectedClub}
                    players={selectedPlayers}
                    onClose={() =>
                        setSelectedClub(null)
                    }
                />
            )}

            {/* =========================
                凡例
            ========================= */}
            <Legend
                visiblePower={visiblePower}
                togglePower={togglePower}
            />



        </div>
    );
}

export default CircleGraph;