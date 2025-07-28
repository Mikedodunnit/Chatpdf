import React from "react";

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  return (
    <div className="w-full h-full bg-gray-100">
      <iframe
        src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
        className="w-full h-full border-0"
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFViewer;
