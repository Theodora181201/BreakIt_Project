import dagre from "@dagrejs/dagre";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;


/*
 * Returns colour scheme based on depth.
 */
function getNodeStyle(depth) {

    switch (depth) {

        case 0:

            return {
                background: "#6C63FF",
                color: "#FFFFFF",
                border: "none",
            };


        case 1:

            return {
                background: "#EEF2FF",
                color: "#222",
                border: "2px solid #6C63FF",
            };


        case 2:

            return {
                background: "#EAFBF2",
                color: "#222",
                border: "2px solid #34C759",
            };


        default:

            return {
                background: "#FFFFFF",
                color: "#222",
                border: "1px solid #E5E7EB",
            };

    }

}


/*
 * Convert Gemini's tree structure
 * into React Flow nodes and edges.
 */
export function convertToReactFlow(tree) {

    const dagreGraph =
        new dagre.graphlib.Graph();


    dagreGraph.setDefaultEdgeLabel(
        () => ({})
    );


    /*
     * Initial layout settings.
     */
    dagreGraph.setGraph({

        rankdir: "TB",

        ranksep: 120,

        nodesep: 60,

        marginx: 40,

        marginy: 40,

    });


    const edges = [];


    /*
     * Recursively build the Dagre graph.
     */
    function build(
        node,
        parent = null,
        depth = 0
    ) {

        dagreGraph.setNode(

            node.id,

            {

                width:
                    NODE_WIDTH,

                height:
                    NODE_HEIGHT,

                label:
                    node.label,

                description:
                    node.description || "",

                keyPoints:
                    node.keyPoints || [],

                depth,

            }

        );


        /*
         * Create connection to parent.
         */
        if (parent) {

            dagreGraph.setEdge(

                parent.id,

                node.id

            );


            edges.push({

                id:
                    `${parent.id}-${node.id}`,

                source:
                    parent.id,

                target:
                    node.id,

                type:
                    "smoothstep",

                animated:
                    true,

                style: {

                    stroke:
                        "#8B5CF6",

                    strokeWidth:
                        2,

                },

            });

        }


        /*
         * Process children.
         */
        if (node.children?.length) {

            node.children.forEach(child => {

                build(
                    child,
                    node,
                    depth + 1
                );

            });

        }

    }


    /*
     * Start from root.
     */
    build(tree);


    /*
     * Calculate initial Dagre layout.
     */
    dagre.layout(dagreGraph);


    /*
     * Convert Dagre nodes into
     * React Flow nodes.
     */
    const nodes =
        dagreGraph.nodes().map(id => {

            const dagreNode =
                dagreGraph.node(id);


            return {

                id,

                type:
                    "custom",


                position: {

                    x:
                        dagreNode.x -
                        NODE_WIDTH / 2,

                    y:
                        dagreNode.y -
                        NODE_HEIGHT / 2,

                },


                data: {

                    /*
                     * Required by CustomNode.
                     */
                    id,

                    label:
                        dagreNode.label,


                    /*
                     * Extra information that
                     * appears when + is clicked.
                     */
                    description:
                        dagreNode.description,


                    keyPoints:
                        dagreNode.keyPoints,


                    /*
                     * Initially collapsed.
                     */
                    expanded:
                        false,

                },


                /*
                 * User can manually drag nodes.
                 */
                draggable:
                    true,


                /*
                 * Basic appearance.
                 */
                style: {

                    width:
                        NODE_WIDTH,

                    minHeight:
                        NODE_HEIGHT,

                    borderRadius:
                        "18px",

                    display:
                        "flex",

                    flexDirection:
                        "column",

                    fontWeight:
                        600,

                    fontSize:
                        "14px",

                    textAlign:
                        "center",

                    padding:
                        "0",

                    boxShadow:
                        "0 8px 20px rgba(0,0,0,0.08)",

                    transition:
                        "all 0.2s ease",


                    ...getNodeStyle(
                        dagreNode.depth
                    ),

                },

            };

        });


    return {

        nodes,

        edges,

    };

}