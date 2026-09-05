import {
    useCallback,
    useEffect,
    useState
} from "react";

import ReactFlow, {
    Controls,
    MiniMap,
    Background,
    applyNodeChanges,
    ReactFlowProvider
} from "reactflow";

import "reactflow/dist/style.css";

import {
    Download,
    Maximize2
} from "lucide-react";

import {
    toPng
} from "html-to-image";

import dagre from "@dagrejs/dagre";

import CustomNode from "./CustomNode";

import "../css/MindMap.css";


/* =========================================================
   CUSTOM NODE TYPE
========================================================= */

const nodeTypes = {
    custom: CustomNode
};


/* =========================================================
   NODE SETTINGS
========================================================= */

const NODE_WIDTH = 220;

const COLLAPSED_HEIGHT = 80;


/* =========================================================
   GET NODE HEIGHT
========================================================= */

function getNodeHeight(node) {

    if (!node.data?.expanded) {
        return COLLAPSED_HEIGHT;
    }

    let height = 80;

    if (node.data.description) {

        const descriptionLines =
            Math.ceil(
                node.data.description.length / 40
            );

        height +=
            descriptionLines * 18;
    }

    if (node.data.keyPoints?.length) {

        height += 35;

        height +=
            node.data.keyPoints.length * 22;
    }

    return height + 30;
}


/* =========================================================
   DAGRE LAYOUT
========================================================= */

function getLayoutedElements(
    nodes,
    edges
) {

    const dagreGraph =
        new dagre.graphlib.Graph();

    dagreGraph.setDefaultEdgeLabel(
        () => ({})
    );

    dagreGraph.setGraph({

        rankdir: "TB",

        ranksep: 120,

        nodesep: 60,

        marginx: 40,

        marginy: 40

    });


    nodes.forEach(node => {

        const height =
            getNodeHeight(node);

        dagreGraph.setNode(
            node.id,
            {
                width: NODE_WIDTH,
                height
            }
        );

    });


    edges.forEach(edge => {

        dagreGraph.setEdge(
            edge.source,
            edge.target
        );

    });


    dagre.layout(
        dagreGraph
    );


    return nodes.map(node => {

        const dagreNode =
            dagreGraph.node(
                node.id
            );

        const height =
            getNodeHeight(node);

        return {

            ...node,

            position: {

                x:
                    dagreNode.x -
                    NODE_WIDTH / 2,

                y:
                    dagreNode.y -
                    height / 2

            }

        };

    });

}


/* =========================================================
   GET NODE BOUNDS
========================================================= */

function getNodesBounds(nodes) {

    if (!nodes || nodes.length === 0) {

        return {
            minX: 0,
            minY: 0,
            maxX: 500,
            maxY: 300
        };

    }


    let minX = Infinity;

    let minY = Infinity;

    let maxX = -Infinity;

    let maxY = -Infinity;


    nodes.forEach(node => {

        const x =
            node.position?.x || 0;

        const y =
            node.position?.y || 0;


        const width =
            node.measured?.width ||
            node.width ||
            NODE_WIDTH;


        const height =
            node.measured?.height ||
            node.height ||
            getNodeHeight(node);


        minX =
            Math.min(
                minX,
                x
            );

        minY =
            Math.min(
                minY,
                y
            );

        maxX =
            Math.max(
                maxX,
                x + width
            );

        maxY =
            Math.max(
                maxY,
                y + height
            );

    });


    return {
        minX,
        minY,
        maxX,
        maxY
    };

}


/* =========================================================
   MIND MAP CONTENT
========================================================= */

function MindMapContent({

    nodes = [],

    edges = [],

    summary

}) {

    const [
        localNodes,
        setLocalNodes
    ] = useState([]);


    const [
        isFullscreen,
        setIsFullscreen
    ] = useState(false);


    /* =====================================================
       LOAD BACKEND NODES
    ===================================================== */

    useEffect(() => {

        if (
            !nodes ||
            nodes.length === 0
        ) {

            setLocalNodes([]);

            return;

        }


        const preparedNodes =
            nodes.map(node => ({

                ...node,

                type: "custom",

                data: {

                    ...node.data,

                    id:
                        node.id,

                    expanded:
                        node.data?.expanded ||
                        false

                }

            }));


        const layoutedNodes =
            getLayoutedElements(
                preparedNodes,
                edges
            );


        setLocalNodes(
            layoutedNodes
        );

    }, [
        nodes,
        edges
    ]);


    /* =====================================================
       DRAG NODES
    ===================================================== */

    const onNodesChange =
        useCallback(
            (changes) => {

                setLocalNodes(
                    currentNodes =>

                        applyNodeChanges(
                            changes,
                            currentNodes
                        )

                );

            },
            []
        );


    /* =====================================================
       EXPAND / COLLAPSE
    ===================================================== */

    const handleToggleNode =
        useCallback(
            (nodeId) => {

                setLocalNodes(
                    currentNodes => {

                        const updatedNodes =
                            currentNodes.map(
                                node => {

                                    if (
                                        node.id !==
                                        nodeId
                                    ) {

                                        return node;

                                    }


                                    return {

                                        ...node,

                                        data: {

                                            ...node.data,

                                            expanded:
                                                !node
                                                    .data
                                                    .expanded

                                        }

                                    };

                                }
                            );


                        return getLayoutedElements(
                            updatedNodes,
                            edges
                        );

                    }
                );

            },
            [edges]
        );


    /* =====================================================
       EXPORT PNG
    ===================================================== */

    const handleExport =
        async () => {

            try {

                if (
                    !localNodes ||
                    localNodes.length === 0
                ) {

                    alert(
                        "There is no mind map to export."
                    );

                    return;

                }


                const viewport =
                    document.querySelector(
                        ".react-flow__viewport"
                    );


                if (!viewport) {

                    console.error(
                        "React Flow viewport not found."
                    );

                    alert(
                        "Unable to find the mind map."
                    );

                    return;

                }


                /*
                 * Calculate bounds ourselves.
                 */

                const bounds =
                    getNodesBounds(
                        localNodes
                    );


                const padding = 80;


                const width =
                    Math.max(
                        bounds.maxX -
                        bounds.minX +
                        padding * 2,

                        500
                    );


                const height =
                    Math.max(
                        bounds.maxY -
                        bounds.minY +
                        padding * 2,

                        300
                    );


                /*
                 * Save original transform.
                 */

                const originalTransform =
                    viewport.style.transform;


                /*
                 * Move the map so that
                 * its top-left corner begins
                 * at the padding.
                 */

                viewport.style.transform =
                    `translate(${
                        padding -
                        bounds.minX
                    }px, ${
                        padding -
                        bounds.minY
                    }px) scale(1)`;


                /*
                 * Give browser time to render.
                 */

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            300
                        )
                );


                /*
                 * Generate PNG.
                 */

                const dataUrl =
                    await toPng(
                        viewport,
                        {

                            backgroundColor:
                                "#ffffff",

                            width,

                            height,

                            pixelRatio:
                                2,

                            cacheBust:
                                true,

                            skipFonts:
                                true

                        }
                    );


                /*
                 * Restore viewport.
                 */

                viewport.style.transform =
                    originalTransform;


                /*
                 * Download PNG.
                 */

                const link =
                    document.createElement(
                        "a"
                    );


                link.download =
                    "break-it-mindmap.png";


                link.href =
                    dataUrl;


                document.body.appendChild(
                    link
                );


                link.click();


                document.body.removeChild(
                    link
                );

            }

            catch (error) {

                console.error(
                    "PNG EXPORT ERROR:",
                    error
                );


                const viewport =
                    document.querySelector(
                        ".react-flow__viewport"
                    );


                if (viewport) {

                    viewport.style.transform =
                        "";

                }


                alert(
                    "Unable to export image. Check the browser console for details."
                );

            }

        };


    /* =====================================================
       FULLSCREEN
    ===================================================== */

    const handleFullscreen =
        async () => {

            const canvas =
                document.querySelector(
                    ".flow-wrapper"
                );


            if (!canvas) {

                console.error(
                    "Mind map canvas not found."
                );

                return;

            }


            try {

                if (
                    !document.fullscreenElement
                ) {

                    await canvas.requestFullscreen();

                }

                else {

                    await document.exitFullscreen();

                }

            }

            catch (error) {

                console.error(
                    "Fullscreen error:",
                    error
                );

            }

        };


    /* =====================================================
       FULLSCREEN STATE
    ===================================================== */

    useEffect(() => {

        const handleFullscreenChange =
            () => {

                setIsFullscreen(
                    Boolean(
                        document.fullscreenElement
                    )
                );

            };


        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );


        return () => {

            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );

        };

    }, []);


    /* =====================================================
       PASS TO CUSTOM NODE
    ===================================================== */

    const nodesWithToggle =
        localNodes.map(
            node => ({

                ...node,

                data: {

                    ...node.data,

                    onToggle:
                        handleToggleNode

                }

            })
        );


    /* =====================================================
       UI
    ===================================================== */

    return (

        <div
            className={
                `mindmap-card ${
                    isFullscreen
                        ? "mindmap-fullscreen"
                        : ""
                }`
            }
        >

            <div className="mindmap-header">

                <div>

                    <h2>
                        Generated Mind Map
                    </h2>

                    <p>
                        Explore and interact with your concepts
                    </p>

                </div>


                <div className="map-buttons">

                    <button
                        type="button"
                        onClick={
                            handleExport
                        }
                    >

                        <Download
                            size={18}
                        />

                        Export

                    </button>


                    <button
                        type="button"
                        onClick={
                            handleFullscreen
                        }
                    >

                        <Maximize2
                            size={18}
                        />

                        Fullscreen

                    </button>

                </div>

            </div>


            <div className="flow-wrapper">

                <ReactFlow

                    nodes={
                        nodesWithToggle
                    }

                    edges={
                        edges
                    }

                    nodeTypes={
                        nodeTypes
                    }

                    onNodesChange={
                        onNodesChange
                    }

                    fitView

                >

                    <Background />

                    <Controls />

                    <MiniMap />

                </ReactFlow>

            </div>

        </div>

    );

}


/* =========================================================
   PROVIDER
========================================================= */

export default function MindMap(
    props
) {

    return (

        <ReactFlowProvider>

            <MindMapContent
                {...props}
            />

        </ReactFlowProvider>

    );

}