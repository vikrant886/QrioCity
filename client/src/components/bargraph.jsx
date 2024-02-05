import React from "react";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';
import { Check, X } from "lucide-react"

const right = (props) => {
    const { x, y, name, width, height, value ,correct } = props;
    console.log(correct);
    const radius = 20;

    const labelValue = typeof value === 'string' ? value.split(' ')[1] : value;

    return (
        <>
            {name === correct ? (
                <Check className="dark:bg-white text-green-700" x={x + width / 2 -10} y={y - radius} />
            ) : (
                <X className="dark:bg-white font-bold text-red-600" x={x + width / 2-10} y={y - radius} />
            )}
        </>
    );
};



export default function Barchart({ data ,correct }) {
    console.log(data);
    const sec = []
    const answer = data.ansArray
    answer.map((i, index) => {
        sec.push({
            name: index,
            data: i
        })
        console.log(i, index)
    })
    console.log(sec)

    const colorForBars = (index) => {
        return index === correct ? 'green' : 'red';
    }

    return (
        <ResponsiveContainer width="60%" height="80%">
            <BarChart
                data={sec}
                margin={{
                    top: 50,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                {/* <CartesianGrid strokeDasharray="4 4" /> */}
                <XAxis dataKey="name" />
                <YAxis  />
                <Tooltip />
                {/* <Legend /> */}
                <Bar dataKey="data" fill="#008000" minPointSize={2}
                    shape={(props) => (
                        <Rectangle
                            {...props}
                            fill={colorForBars(props.index)} // Set fill color based on index
                        />
                    )}
                >
                    <LabelList dataKey="name" content={(labelProps) => right({ ...labelProps, correct })} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
