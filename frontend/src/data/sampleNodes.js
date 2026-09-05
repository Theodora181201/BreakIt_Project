export const initialNodes = [
    {
        id: "1",
        position: { x: 420, y: 50 },
        data: {
            label: "Machine Learning"
        },
        style: {
            background: "#6D5DF6",
            color: "white",
            borderRadius: 16,
            border: "none",
            padding: 12,
            width: 180,
            textAlign: "center",
            fontWeight: 700
        }
    },

    {
        id: "2",
        position: { x: 120, y: 180 },
        data: {
            label: "Supervised Learning"
        },
        style: {
            background: "#E8F0FF",
            border: "2px solid #4E7CFF",
            borderRadius: 14,
            width: 170,
            textAlign: "center",
            padding: 12
        }
    },

    {
        id: "3",
        position: { x: 420, y: 200 },
        data: {
            label: "Unsupervised Learning"
        },
        style: {
            background: "#F7EFFF",
            border: "2px solid #B86DFF",
            borderRadius: 14,
            width: 170,
            textAlign: "center",
            padding: 12
        }
    },

    {
        id: "4",
        position: { x: 730, y: 180 },
        data: {
            label: "Reinforcement Learning"
        },
        style: {
            background: "#EEFDF3",
            border: "2px solid #35C56A",
            borderRadius: 14,
            width: 170,
            textAlign: "center",
            padding: 12
        }
    },

    {
        id: "5",
        position: { x: 60, y: 360 },
        data: {
            label: "Regression"
        },
        style: {
            background: "#fff"
        }
    },

    {
        id: "6",
        position: { x: 210, y: 360 },
        data: {
            label: "Classification"
        },
        style: {
            background: "#fff"
        }
    },

    {
        id: "7",
        position: { x: 420, y: 380 },
        data: {
            label: "Clustering"
        },
        style: {
            background: "#fff"
        }
    },

    {
        id: "8",
        position: { x: 620, y: 380 },
        data: {
            label: "Dimensionality Reduction"
        },
        style: {
            background: "#fff"
        }
    },

    {
        id: "9",
        position: { x: 760, y: 360 },
        data: {
            label: "Rewards"
        },
        style: {
            background: "#fff"
        }
    }
];

export const initialEdges = [
    { id: "e1", source: "1", target: "2", animated: true },
    { id: "e2", source: "1", target: "3", animated: true },
    { id: "e3", source: "1", target: "4", animated: true },

    { id: "e4", source: "2", target: "5" },
    { id: "e5", source: "2", target: "6" },

    { id: "e6", source: "3", target: "7" },
    { id: "e7", source: "3", target: "8" },

    { id: "e8", source: "4", target: "9" }
];