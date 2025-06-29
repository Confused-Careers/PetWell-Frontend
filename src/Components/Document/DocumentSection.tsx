import React from "react";
import DocumentBox from "./DocumentInfo";

interface Document {
  name: string;
  size: string;
  type: "img" | "pdf";
}

interface DocumentSectionProps {
  documents: Document[];
  onAddDocument?: () => void;
  onEditDocument?: (index: number) => void;
  onDeleteDocument?: (index: number) => void;
  onViewAll?: () => void;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({
  documents,
  onEditDocument,
  onDeleteDocument,
  onViewAll,
}) => {
  return (
    <section className="mb-6 sm:mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-4">
        {documents.map((doc, idx) => (
          <DocumentBox
            key={idx}
            name={doc.name}
            type={doc.type}
            onEdit={onEditDocument ? () => onEditDocument(idx) : undefined}
            onDelete={
              onDeleteDocument ? () => onDeleteDocument(idx) : undefined
            }
          />
        ))}
      </div>
      <div className="mt-2">
        <a
          href="#"
          className="text-[var(--color-primary)] font-medium hover:underline text-sm sm:text-base"
          onClick={(e) => {
            e.preventDefault();
            onViewAll && onViewAll();
          }}
        >
          View All Documents &gt;
        </a>
      </div>
    </section>
  );
};

export default DocumentSection;
