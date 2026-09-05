import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import { validateInputs } from "../utils/validations";

import {
    UploadCloud,
    FileText,
    Type,
    Sparkles,
} from "lucide-react";

import "../css/UploadPanel.css";

export default function UploadPanel({

    setNodes,
    setEdges,
    setSummary,

    setLoading,
    setStatus

}) {

    const [mode, setMode] = useState("upload");

    const [files, setFiles] = useState([]);

    const [text, setText] = useState("");

    const [error, setError] = useState("");

    const onDrop = useCallback((acceptedFiles) => {

        setFiles(acceptedFiles);

        setError("");

    }, []);

    const {

        getRootProps,

        getInputProps,

        open

    } = useDropzone({

        onDrop,

        noClick: true,

        maxFiles: 1,

        accept: {

            "application/pdf": [".pdf"],

            "text/plain": [".txt"],

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],

            "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],

            "image/jpeg": [".jpg", ".jpeg"],

            "image/png": [".png"]

        }

    });

    const handleGenerate = async (e) => {

        e.preventDefault();

        const targetText =
            mode === "text"
                ? text.trim()
                : "";

        const targetFile =
            mode === "upload"
                ? files[0]
                : null;


        // ==========================================
        // FRONTEND EMPTY INPUT CHECK
        // ==========================================

        if (mode === "upload" && !targetFile) {

            alert(
                "Please upload a file before generating your mind map."
            );

            return;
        }


        if (mode === "text" && !targetText) {

            alert(
                "Please enter some text before generating your mind map."
            );

            return;
        }


        // ==========================================
        // OTHER FRONTEND VALIDATION
        // ==========================================

        const valid = validateInputs(
            targetText,
            targetFile,
            setError
        );


        if (!valid) {
            return;
        }


        // ==========================================
        // ONLY NOW SEND TO BACKEND
        // ==========================================

        alert(
            "AI is generating your mind map..."
        );


        setLoading(true);

        setStatus("processing");

        setError("");


        try {

            const formData =
                new FormData();


            if (targetText) {

                formData.append(
                    "text",
                    targetText
                );

            }


            if (targetFile) {

                formData.append(
                    "file",
                    targetFile
                );

            }


            const response =
                await axios.post(

                    "http://localhost:5000/api/generate-mindmap",

                    formData,

                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }

                );


            setNodes(
                response.data.nodes
            );


            setEdges(
                response.data.edges
            );


            setSummary(
                response.data.summary
            );


            setStatus(
                "completed"
            );

        }

        catch (err) {

            console.error(
                err
            );


            setStatus(
                "error"
            );


            setError(

                err.response?.data?.message ||

                err.response?.data?.error ||

                "Unable to generate mind map."

            );

        }

        finally {

            setLoading(
                false
            );

        }

    };

    return (

        <div className="upload-card">

            <div className="upload-header">

                <h2>

                    Input Your Learning Material

                </h2>

                <p>

                    Upload notes or paste text to generate a beautiful mind map.

                </p>

            </div>

            <div className="tabs">

                <button

                    className={

                        mode === "upload"

                            ? "active"

                            : ""

                    }

                    onClick={() => setMode("upload")}

                >

                    <FileText size={18} />

                    Upload File

                </button>

                <button

                    className={

                        mode === "text"

                            ? "active"

                            : ""

                    }

                    onClick={() => setMode("text")}

                >

                    <Type size={18} />

                    Paste Text

                </button>

            </div>

            {

                mode === "upload"

                    ? (

                        <>

                            <div

                                className="dropzone"

                                {...getRootProps()}

                            >

                                <input

                                    {...getInputProps()}

                                />

                                <UploadCloud

                                    size={55}

                                />

                                <h3>

                                    Drag & Drop your files

                                </h3>

                                <p>

                                    PDF • DOCX • PPTX • TXT • Images

                                </p>

                                <button

                                    type="button"

                                    onClick={open}

                                >

                                    Browse Files

                                </button>

                            </div>

                            {

                                files.length > 0 && (

                                    <div className="uploaded-files">

                                        <h4>

                                            Uploaded File

                                        </h4>

                                        {

                                            files.map(file => (

                                                <div

                                                    key={file.name}

                                                    className="file-row"

                                                >

                                                    <FileText size={18} />

                                                    <span>

                                                        {file.name}

                                                    </span>

                                                </div>

                                            ))

                                        }

                                    </div>

                                )

                            }

                        </>

                    )

                    : (

                        <textarea

                            className="text-input"

                            placeholder="Paste your notes here..."

                            value={text}

                            onChange={(e) =>

                                setText(

                                    e.target.value

                                )

                            }

                        />

                    )

            }

            {

                error && (

                    <div className="error-message">

                        {error}

                    </div>

                )

            }

            <button

                className="generate-btn"

                onClick={handleGenerate}

            >

                <Sparkles size={18} />

                Generate Mind Map

            </button>

        </div>

    );

}