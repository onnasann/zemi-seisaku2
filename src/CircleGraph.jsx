function CircleGraph({ data }) {
    const width = window.innerWidth;
    const height = window.innerHeight * 0.8;

    const centerX = width / 2;
    const centerY = height - 50;

    const maxRadius = Math.min(width / 2 - 50, height - 100);

    // 半円5分割
    const areas = {
        "南アメリカ": [180, 145],
        "北中米": [145, 115],
        "ヨーロッパ": [115, 50],
        "アフリカ": [50, 25],
        "アジア": [25, 0]
    };

    const maxRank = Math.max(...data.map(club => club.rank));

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
    const minPower = 50;
    const maxPower = 100;
    const nodes = data.map(club => {
        const range =
            areas[club.area];

        if (!range) {
            return null;
        }



        const clubsInArea = areaData[club.area];

        const index = clubsInArea.indexOf(club);

        const baseAngle =
            range[0] -
            (index / (clubsInArea.length - 1))
            *
            (range[0] - range[1]);


        const hash =
            club.club
                .split("")
                .reduce((sum, char) => sum + char.charCodeAt(0), 0);

        const offset = (hash % 40) - 20;

        const angle = Math.max(
            range[1] + 3,
            Math.min(
                range[0] - 3,
                baseAngle + offset
            )
        );

        const radius =

            ((club.power - minPower)
                /
                (maxPower - minPower))
            *
            maxRadius;



        const rad =
            angle * Math.PI / 180;



        return {

            ...club,

            x:
                centerX +
                radius * Math.cos(rad),


            y:
                centerY -
                radius * Math.sin(rad)

        };


    }).filter(Boolean);





    return (

        <svg
            width={width}
            height={height}
        >


            {/* 外側半円 */}

            <path
                d={`M ${centerX - maxRadius} ${centerY}A ${maxRadius} ${maxRadius} 0 0 1
                    ${centerX + maxRadius} ${centerY}`}
                fill="none"
                stroke="black"
                strokeWidth="3"
            />



            {/* 目盛り円 */}

            {
                [60, 70, 80, 90, 100].map(power => {


                    const r =
                        ((power - minPower)
                            /
                            (maxPower - minPower))
                        *
                        maxRadius;


                    return (

                        <circle

                            key={power}

                            cx={centerX}

                            cy={centerY}

                            r={r}

                            fill="none"

                            stroke="gray"

                            strokeDasharray="5 5"

                        />

                    )

                })
            }




            {/* エリア分割線 */}

            {
                Object.values(areas)
                    .map((range, index) => {


                        const angle =
                            range[0]
                            *
                            Math.PI / 180;



                        return (

                            <line

                                key={index}

                                x1={centerX}

                                y1={centerY}

                                x2={
                                    centerX +
                                    maxRadius *
                                    Math.cos(angle)
                                }

                                y2={
                                    centerY -
                                    maxRadius *
                                    Math.sin(angle)
                                }

                                stroke="black"

                            />

                        )

                    })

            }



            {/* クラブの点 */}

            {
                nodes.map((club, index) => (


                    <circle

                        key={index}

                        cx={club.x}

                        cy={club.y}


                        // 選手数でサイズ変更

                        r={
                            5 +
                            club.playerCount * 1.5
                        }


                        fill="steelblue"

                        opacity="0.7"


                    >

                        <title>

                            {club.club}

                            {"\n"}

                            選手数：
                            {club.playerCount}

                            {"\n"}

                            チームパワー：
                            {club.power}


                        </title>


                    </circle>


                ))
            }



        </svg>


    );


}


export default CircleGraph;