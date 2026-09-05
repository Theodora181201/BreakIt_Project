import "./App.css";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Steps from "./components/Steps";
import UploadPanel from "./components/UploadPanel";
import ProcessingPanel from "./components/ProcessingPanel";
import MindMap from "./components/MindMap";
import Footer from "./components/Footer";


function App() {

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  return (

    <>
      <div className="app">

        <Navbar />

        <Hero />

        <Steps />

        <div className="content">

          <div className="first">


            <UploadPanel

              setNodes={setNodes}
              setEdges={setEdges}
              setSummary={setSummary}

              setLoading={setLoading}
              setStatus={setStatus}

            />

          </div>

          <div className="process-content">

            <div className="second">

              <ProcessingPanel

                loading={loading}
                status={status}

              />
            </div>
            <div className="third">

              <MindMap

                nodes={nodes}
                edges={edges}
                summary={summary}

              />

            </div>

          </div>

        </div>

        <Footer />

      </div>
    </>
  );
}

export default App;