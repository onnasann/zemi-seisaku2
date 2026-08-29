import { countryFlags } from "../data/areas";

function ClubDetail({
    club,
    players,
    onClose
}) {

    return (
        <div className="club-detail">

            {/* =========================
                閉じるボタン
            ========================= */}
            <button
                className="close-button"
                onClick={onClose}
            >
                ×
            </button>

            {/* =========================
                クラブ名
            ========================= */}
            <h2>
                {club.club}
            </h2>

            {/* =========================
                クラブ情報
            ========================= */}
            <p>
                出場選手：
                {club.playerCount}人
            </p>

            <p>
                チームパワー：
                {club.power}
            </p>

            <p>
                ランキング：
                {club.rank}位
            </p>

            <p>
                エリア：
                {club.area}
            </p>

            {/* =========================
                選手一覧
            ========================= */}
            <h3>
                出場選手
            </h3>

            <div className="club-player-list">

                {players.map((player, index) => (

                    <div
                        key={index}
                        className="player-item"
                    >

                        {/* 国旗 */}
                        <span className="player-country">

                            {
                                countryFlags[
                                player["国"]?.trim()
                                ] || "🌐"
                            }

                        </span>

                        {/* 選手名 */}
                        <span className="player-name">

                            {player["選手名"]}

                        </span>

                        {/* ポジション */}
                        <span className="player-position">

                            {player["ポジション"]}

                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default ClubDetail;