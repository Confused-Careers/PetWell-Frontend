import React from "react";
import DocumentBox from "./DocumentInfo";
import { IoIosArrowDroprightCircle } from "react-icons/io";

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
      <div className="flex flex-wrap gap-4 sm:gap-6 mb-4">
        {documents.map((doc, idx) => (
          <DocumentBox
            key={idx}
            name={doc.name}
            type={doc.type}
            onEdit={onEditDocument ? () => onEditDocument(idx) : undefined}
            onDelete={
              onDeleteDocument ? () => onDeleteDocument(idx) : undefined
            }
            onDownload={() => {
              console.log(doc);
            }}
          />
        ))}
        {documents.length == 0 && <div>No Document Added</div>}
      </div>
      {documents.length != 0 && (
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
