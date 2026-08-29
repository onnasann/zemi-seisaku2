import { useEffect, useState } from "react";
import Papa from "papaparse";
import CircleGraph from "./components/CircleGraph";
import "./CircleGraph.css";

function App() {

    // クラブごとのデータ
    const [data, setData] = useState([]);

    // 選手ごとのデータ
    const [players, setPlayers] = useState([]);

    const [visiblePower, setVisiblePower] = useState([
        "power6",
        "power5",
        "power4",
        "power3",
        "power2",
        "power1"
    ]);

    const [searchText, setSearchText] = useState("");

    const togglePower = (power) => {

        if (visiblePower.includes(power)) {

            setVisiblePower(
                visiblePower.filter(
                    p => p !== power
                )
            );

        } else {

            setVisiblePower([
                ...visiblePower,
                power
            ]);

        }

    };

    useEffect(() => {

        fetch("/soccer_players.csv")
            .then(res => res.text())
            .then(csv => {

                Papa.parse(csv, {

                    header: true,

                    complete: (result) => {

                        // 選手データを保存
                        setPlayers(result.data);

                        const clubs = {};

                        result.data.forEach(player => {

                            const club =
                                player["所属チーム名"];

                            if (!club) {
                                return;
                            }

                            if (!clubs[club]) {

                                clubs[club] = {

                                    club: club,

                                    playerCount: 0,

                                    power: Number(
                                        player["チームパワー"]
                                    ),

                                    rank: Number(
                                        player["チームランキング"]
                                    ),

                                    area:
                                        player["エリア"]
                                };

                            }

                            clubs[club].playerCount++;

                        });

                        const clubList =
                            Object.values(clubs);

                        // ランキング順
                        clubList.sort(
                            (a, b) =>
                                a.rank - b.rank
                        );

                        setData(clubList);

                    }

                });

            });

    }, []);

    return (

        <div>

            <h1 className="title">
                最強クラブ分析
            </h1>

            <CircleGraph
                data={data}
                players={players}
                visiblePower={visiblePower}
                togglePower={togglePower}
                searchText={searchText}
            />

        </div>

    );

}

export default App;