import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    // Headings & font
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],

    // Text formatting
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],

    // Alignment
    [{ align: [] }],

    // Lists & indent
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ indent: "-1" }, { indent: "+1" }],

    // Insert
    ["link", "image", "video", "formula"],

    // Clean
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header", "font", "size",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "script",
  "blockquote", "code-block",
  "align",
  "list", "indent",
  "link", "image", "video", "formula",
];

export default function RichTextEditor({ label, value, onChange, error, minHeight = "350px" }) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {label}
        </label>
      )}

      <style>{`
        /* ── Quill container ── */
        .ql-container.ql-snow {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: rgb(209 213 219);
          font-family: inherit;
          font-size: 0.875rem;
          min-height: ${minHeight};
        }

        /* ── Toolbar ── */
        .ql-toolbar.ql-snow {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: rgb(209 213 219);
          background-color: rgb(249 250 251);
          flex-wrap: wrap;
          padding: 8px;
        }

        /* ── Editor area ── */
        .ql-editor {
          min-height: ${minHeight};
          line-height: 1.75;
          color: rgb(31 41 55);
          padding: 16px 20px;
        }
        .ql-editor p { margin-bottom: 0.5rem; }
        .ql-editor h1 { font-size: 2rem;    font-weight: 700; margin-bottom: 0.75rem; }
        .ql-editor h2 { font-size: 1.5rem;  font-weight: 700; margin-bottom: 0.75rem; }
        .ql-editor h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
        .ql-editor h4 { font-size: 1.125rem;font-weight: 600; margin-bottom: 0.5rem; }
        .ql-editor h5 { font-size: 1rem;    font-weight: 600; margin-bottom: 0.5rem; }
        .ql-editor h6 { font-size: 0.875rem;font-weight: 600; margin-bottom: 0.5rem; }
        .ql-editor ul, .ql-editor ol { padding-left: 1.5rem; margin-bottom: 0.5rem; }
        .ql-editor blockquote {
          border-left: 4px solid rgb(209 213 219);
          padding-left: 1rem;
          margin: 1rem 0;
          color: rgb(107 114 128);
          font-style: italic;
        }
        .ql-editor pre {
          background: rgb(243 244 246);
          border-radius: 0.375rem;
          padding: 1rem;
          font-family: monospace;
          font-size: 0.875rem;
          overflow-x: auto;
          margin-bottom: 0.5rem;
        }
        .ql-editor a { color: rgb(59 130 246); text-decoration: underline; }
        .ql-editor img { max-width: 100%; border-radius: 0.5rem; margin: 0.5rem 0; }

        /* ── Placeholder ── */
        .ql-editor.ql-blank::before {
          color: rgb(156 163 175);
          font-style: normal;
          font-size: 0.875rem;
        }

        /* ── Toolbar icon colours ── */
        .ql-snow .ql-stroke { stroke: rgb(75 85 99); }
        .ql-snow .ql-fill  { fill:   rgb(75 85 99); }
        .ql-snow .ql-picker-label { color: rgb(75 85 99); }
        .ql-snow .ql-picker-label:hover,
        .ql-snow.ql-toolbar button:hover .ql-stroke,
        .ql-snow.ql-toolbar button.ql-active .ql-stroke { stroke: rgb(59 130 246); }
        .ql-snow.ql-toolbar button:hover .ql-fill,
        .ql-snow.ql-toolbar button.ql-active .ql-fill  { fill: rgb(59 130 246); }
        .ql-snow.ql-toolbar button:hover,
        .ql-snow.ql-toolbar button.ql-active,
        .ql-snow.ql-toolbar .ql-picker-label:hover {
          color: rgb(59 130 246);
        }
        .ql-snow .ql-picker-options {
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          border-color: rgb(229 231 235);
          padding: 4px;
        }

        /* ── Dark mode ── */
        .dark .ql-toolbar.ql-snow {
          background-color: rgb(31 41 55);
          border-color: rgb(55 65 81);
        }
        .dark .ql-container.ql-snow {
          border-color: rgb(55 65 81);
        }
        .dark .ql-editor {
          color: rgba(255 255 255 / 0.9);
          background-color: rgb(17 24 39);
        }
        .dark .ql-editor.ql-blank::before { color: rgba(255 255 255 / 0.3); }
        .dark .ql-snow .ql-stroke         { stroke: rgb(156 163 175); }
        .dark .ql-snow .ql-fill           { fill:   rgb(156 163 175); }
        .dark .ql-snow .ql-picker-label   { color:  rgb(156 163 175); }
        .dark .ql-snow.ql-toolbar button:hover .ql-stroke,
        .dark .ql-snow.ql-toolbar button.ql-active .ql-stroke { stroke: rgb(96 165 250); }
        .dark .ql-snow.ql-toolbar button:hover .ql-fill,
        .dark .ql-snow.ql-toolbar button.ql-active .ql-fill   { fill:  rgb(96 165 250); }
        .dark .ql-snow .ql-picker-options {
          background-color: rgb(31 41 55);
          border-color: rgb(55 65 81);
        }
        .dark .ql-snow .ql-picker-item { color: rgb(209 213 219); }
        .dark .ql-snow .ql-picker-item:hover { color: rgb(96 165 250); }
        .dark .ql-editor pre { background: rgb(31 41 55); color: rgb(209 213 219); }
        .dark .ql-editor blockquote { border-color: rgb(75 85 99); color: rgb(156 163 175); }
        .dark .ql-snow .ql-tooltip {
          background-color: rgb(31 41 55);
          border-color: rgb(55 65 81);
          color: rgb(209 213 219);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
        }
        .dark .ql-snow .ql-tooltip input[type=text] {
          background-color: rgb(17 24 39);
          border-color: rgb(55 65 81);
          color: rgb(209 213 219);
        }
      `}</style>

      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Start writing your content here..."
      />

      {error && (
        <p className="mt-1.5 text-xs text-error-500">{error}</p>
      )}
    </div>
  );
}