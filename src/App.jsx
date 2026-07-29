import { useEffect, useState } from "react";
import Papa from "papaparse";
import CircleGraph from "./CircleGraph";


function App() {

    const [data, setData] = useState([]);


    useEffect(() => {

        fetch("/soccer_players.csv")
            .then(res => res.text())
            .then(csv => {

                Papa.parse(csv, {
                    header: true,

                    complete: (result) => {

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

                                    area: player["エリア"]
                                };
                            }


                            clubs[club].playerCount++;

                        });


                        const clubList = Object.values(clubs);


                        // チームランキングが小さい順に並べる
                        clubList.sort(
                            (a, b) => a.rank - b.rank
                        );


                        setData(clubList);

                    }

                });


            });


    }, []);



    return (

        <div>

            <h1>
                ワールドカップ選手所属クラブ分析
            </h1>


            <CircleGraph data={data} />


        </div>

    );

}


export default App;