import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function PitchGraph({ pitchData, expectedRange }) {
    const data = {
        labels: Array.from({ length: pitchData.length }, (_, i) => i + 1),
        datasets: [
            {
                label: "Detected Pitch",
                data: pitchData,
                borderColor: "blue",
                borderWidth: 2,
                tension: 0.4,
            },
            {
                label: "Low",
                data: pitchData.map(() =>
                    expectedRange ? expectedRange.min : null
                ),
                borderColor: "green",
                borderDash: [5, 5],
                pointRadius: 0,
                tension: 0.4,
            },
            {
                label: "High",
                data: pitchData.map(() =>
                    expectedRange ? expectedRange.max : null
                ),
                borderColor: "green",
                borderDash: [5, 5],
                pointRadius: 0,
                tension: 0.4,
            },
            // {
            //     label: "",
            //     data: 0,
            //     borderColor: "green",
            //     borderDash: [5, 5],
            //     pointRadius: 0,
            //     tension: 0.1,
            // },
            // {
            //     label: "Expected Range",
            //     data: pitchData.map(() =>
            //         expectedRange ? (expectedRange.min + expectedRange.max) / 2 : null
            //     ),
            //     borderColor: "green",
            //     borderDash: [5, 5],
            //     pointRadius: 0,
            //     tension: 0.4,
            // },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "category", // Ensure the 'category' scale is explicitly set
                title: {
                    display: true,
                    text: "Time (ticks)",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Frequency (Hz)",
                },
            },
        },
    };

    return <div style={{ height: "300px" }}><Line data={data} options={options} /></div>;
}

export default PitchGraph;
