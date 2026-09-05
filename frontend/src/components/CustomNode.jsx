import {
    Handle,
    Position
} from "reactflow";

import {
    Plus,
    Minus
} from "lucide-react";

import "../css/CustomNode.css";


export default function CustomNode({
    data
}) {

    const handleToggle = (e) => {

        e.stopPropagation();

        if (data.onToggle) {

            data.onToggle(
                data.id
            );

        }

    };


    return (

        <div
            className={
                `custom-node ${
                    data.expanded
                        ? "expanded"
                        : ""
                }`
            }
        >

            {/* LEFT CONNECTION */}

            <Handle
                type="target"
                position={Position.Left}
                className="hidden-handle"
            />


            {/* HEADER */}

            <div className="node-header">

                <div className="node-title">

                    {data.label}

                </div>


                <button
                    className="expand-button"
                    onClick={handleToggle}
                >

                    {data.expanded ? (

                        <Minus size={15} />

                    ) : (

                        <Plus size={15} />

                    )}

                </button>

            </div>


            {/* EXPANDED INFORMATION */}

            {data.expanded && (

                <div className="node-details">

                    {data.description && (

                        <p className="node-description">

                            {data.description}

                        </p>

                    )}


                    {data.keyPoints?.length > 0 && (

                        <div className="node-points">

                            <strong>
                                Key Points
                            </strong>


                            <ul>

                                {data.keyPoints.map(
                                    (point, index) => (

                                        <li key={index}>

                                            {point}

                                        </li>

                                    )
                                )}

                            </ul>

                        </div>

                    )}

                </div>

            )}


            {/* RIGHT CONNECTION */}

            <Handle
                type="source"
                position={Position.Right}
                className="hidden-handle"
            />

        </div>

    );

}