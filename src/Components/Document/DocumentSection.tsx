import React from "react";
import DocumentBox from "./DocumentInfo";
import { IoIosArrowDroprightCircle } from "react-icons/io";

interface Document {
  name: string;
  size: string;
  type: "img" | "pdf";
  id: string; // Added id to match the document structure
}

interface DocumentSectionProps {
  documents: Document[];
  onAddDocument?: () => void;
  onEditDocument?: (index: number, newName: string) => void;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {documents.map((doc, idx) => (
          <DocumentBox
            key={doc.id || idx} // Use doc.id as key for uniqueness
            idx={idx}
            name={doc.name}
            type={doc.type}
            onEdit={onEditDocument ? (idx: number, newName: string) => onEditDocument(idx, newName) : undefined}
            onDelete={onDeleteDocument ? () => onDeleteDocument(idx) : undefined}
            onDownload={() => {
              console.log(doc);
            }}
          />
        ))}
        {documents.length === 0 && <div>No Document Added</div>}
      </div>
      {documents.length !== 0 && (
        <div className="mt-2">
          <a
            href="#"
            className="text-[var(--color-primary)] font-medium text-sm sm:text-base flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              onViewAll && onViewAll();
            }}
          >
            View All Documents <IoIosArrowDroprightCircle />
          </a>
        </div>
      )}
    </section>
  );
};

export default DocumentSection;