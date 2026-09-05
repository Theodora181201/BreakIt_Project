// import "../css/ProcessingPanel.css";

// import {
//     BrainCircuit,
//     CheckCircle2,
//     Loader2,
//     Clock3,
//     Network
// } from "lucide-react";

// export default function ProcessingPanel() {

//     const progress = 72;

//     return (

//         <div className="processing-card">

//             <div className="processing-header">

//                 <div>

//                     <h2>AI Processing</h2>

//                     <p>
//                         Breaking your notes into meaningful concepts...
//                     </p>

//                 </div>

//                 <Loader2
//                     className="spin"
//                     size={32}
//                 />

//             </div>

//             <div className="progress-section">

//                 <div className="progress-label">

//                     <span>Overall Progress</span>

//                     <span>{progress}%</span>

//                 </div>

//                 <div className="progress-bar">

//                     <div
//                         className="progress-fill"
//                         style={{
//                             width: `${progress}%`
//                         }}
//                     />

//                 </div>

//             </div>

//             <div className="processing-list">

//                 <div className="task complete">

//                     <CheckCircle2 />

//                     Reading uploaded file

//                 </div>

//                 <div className="task complete">

//                     <CheckCircle2 />

//                     Extracting key concepts

//                 </div>

//                 <div className="task active">

//                     <Loader2 className="spin" />

//                     Connecting related ideas

//                 </div>

//                 <div className="task">

//                     <BrainCircuit />

//                     Building visual mind map

//                 </div>

//             </div>

//             <div className="stats">

//                 <div className="stat-card">

//                     <Clock3 size={22} />

//                     <div>

//                         <h3>12 sec</h3>

//                         <p>Elapsed</p>

//                     </div>

//                 </div>

//                 <div className="stat-card">

//                     <Network size={22} />

//                     <div>

//                         <h3>34</h3>

//                         <p>Nodes Found</p>

//                     </div>

//                 </div>

//             </div>

//         </div>

//     );

// }

import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    Clock3
} from "lucide-react";

import "../css/ProcessingPanel.css";

export default function ProcessingPanel({

    loading,

    status

}) {

    const renderStatus = () => {

        switch (status) {

            case "processing":

                return (

                    <>

                        <Loader2
                            className="processing-icon spinning"
                            size={42}
                        />

                        <h3>

                            AI is generating your mind map...

                        </h3>

                        <p>

                            Analysing your material and identifying key concepts.

                        </p>

                    </>

                );

            case "completed":

                return (

                    <>

                        <CheckCircle2
                            className="processing-icon success"
                            size={42}
                        />

                        <h3>

                            Mind map generated successfully!

                        </h3>

                        <p>

                            Explore your generated mind map now.

                        </p>

                    </>

                );

            case "error":

                return (

                    <>

                        <AlertCircle
                            className="processing-icon error"
                            size={42}
                        />

                        <h3>

                            Generation failed

                        </h3>

                        <p>

                            Please check your input and try again.

                        </p>

                    </>

                );

            default:

                return (

                    <>

                        <Clock3
                            className="processing-icon idle"
                            size={42}
                        />

                        <h3>

                            Waiting for input

                        </h3>

                        <p>

                            Upload a file or paste text to begin.

                        </p>

                    </>

                );

        }

    };

    return (

        <div className="processing-card">

            <div className="processing-header">

                <h2>

                    Processing Status

                </h2>

            </div>

            <div className="processing-content">

                {renderStatus()}

            </div>

        </div>

    );

}