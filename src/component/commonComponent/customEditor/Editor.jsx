import React, { useEffect, useRef, useState } from "react";

const CustomEditor = (onChange) => {
    const editorRef = useRef(null);
    const quillInstance = useRef(null);
    const [content, setContent] = useState("");

    const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ['link', 'image', 'video', 'formula'],
        ["bold", "italic", "underline", "strike"], // Formatting buttons
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"] // Clear formatting button
    ];

    useEffect(() => {
        if (!quillInstance.current && window.Quill) {
            quillInstance.current = new window.Quill(editorRef.current, {
                modules: {
                    toolbar: toolbarOptions
                },
                theme: "snow",
                placeholder: "Start writing...",
            });

            // Update the content when the editor changes
            quillInstance.current.on("text-change", () => {
                setContent(quillInstance.current.root.innerHTML);
            });
        }

        return () => {
            if (quillInstance.current) {
                quillInstance.current = null;
            }
        };
    }, [onChange]);

    return (
        <div>
            <div style={{ border: "1px solid #ddd", padding: "10px" }}>
                <div ref={editorRef} style={{ height: "300px" }} />
            </div>
            <h3 className="mt-4 font-bold">Editor Content:</h3>
            <div
                style={{
                    border: "1px solid #f0f0f0",
                    padding: "10px",
                    backgroundColor: "#f9f9f9",
                    marginTop: "10px"
                }}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};

export default CustomEditor;
