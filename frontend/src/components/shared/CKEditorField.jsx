import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function CKEditorField({ label, value, onChange, error }) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{label}</label>
      )}
      <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
        <CKEditor
          editor={ClassicEditor}
          data={value || ""}
          onChange={(event, editor) => onChange(editor.getData())}
          config={{
            toolbar: [
              "heading", "|", "bold", "italic", "underline", "|",
              "bulletedList", "numberedList", "|",
              "outdent", "indent", "|",
              "blockQuote", "insertTable", "|",
              "undo", "redo"
            ],
          }}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-error-500">{error}</p>}
    </div>
  );
}
