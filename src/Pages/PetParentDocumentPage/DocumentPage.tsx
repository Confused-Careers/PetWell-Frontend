import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar";
import DeleteDocumentModal from "../../Components/Document/DeleteDocumentModal";
import RenameDocumentModal from "../../Components/Document/RenameDocumentModal";
import petServices from "../../Services/petServices";
import { Download, Pencil, X, Search, UploadCloud } from "lucide-react";

// Helper to format file size
function formatSize(bytes: number | undefined) {
  if (!bytes && bytes !== 0) return "Unknown size";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

// Helper to fetch file size from URL using HEAD request
async function fetchFileSize(url: string): Promise<number | undefined> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) return undefined;
    const size = response.headers.get("Content-Length");
    return size ? parseInt(size, 10) : undefined;
  } catch {
    return undefined;
  }
}

const DocumentCard: React.FC<{
  document: any;
  fileSize?: number;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ document, fileSize, onEdit, onDelete }) => {
  // Determine type for badge
  let type = "other";
  let ext = "";
  if (document.document_name) {
    const match = document.document_name.match(/\.([a-zA-Z0-9]+)$/);
    ext = match ? match[1].toLowerCase() : "";
  }
  if (document.file_type && document.file_type.toLowerCase() === "pdf") {
    type = "pdf";
  } else if (
    ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff", "svg"].includes(ext)
  ) {
    type = "img";
  } else if (ext) {
    type = ext;
  }

  const uploader =
    document.human_owner && document.human_owner.human_owner_name
      ? document.human_owner.human_owner_name
      : "You";

  // Use the passed fileSize prop instead of document.size
  const displaySize = fileSize ?? document.size;

  return (
    <div className="flex flex-col sm:flex-row items-center bg-[var(--color-card)] rounded-2xl px-5 py-4 shadow-md gap-3 sm:gap-0">
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-xl mr-4 font-bold text-xs shrink-0 ${
          type === "pdf"
            ? "bg-[var(--color-danger)]"
            : type === "img"
            ? "bg-[var(--color-success)]"
            : "bg-[var(--color-primary)]"
        }`}
      >
        {type === "pdf" ? (
          <span className="text-[var(--color-white)] text-base">PDF</span>
        ) : type === "img" ? (
          <span className="text-[var(--color-white)] text-base">IMG</span>
        ) : (
          <span className="text-[var(--color-white)] text-base">
            {ext ? ext.toUpperCase() : "FILE"}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span
          className="truncate text-lg font-semibold text-[var(--color-text)]"
          style={{ maxWidth: "180px", display: "inline-block" }}
        >
          {document.document_name}
          <span className="ml-2 text-xs text-[var(--color-text)] opacity-70 font-normal align-middle">
            {formatSize(displaySize)}
          </span>
        </span>
        <span className="text-xs text-[var(--color-text)] opacity-60 font-normal truncate max-w-xs mt-0.5">
          Uploaded By:{" "}
          <span className="font-semibold text-[var(--color-text)]">
            {uploader}
          </span>
        </span>
      </div>
      <div className="flex items-center gap-1 ml-2">
        <a
          href={document.document_url}
          download
          className="text-[var(--color-primary)] hover:text-[var(--color-accent-hover)] p-2 rounded-lg"
          aria-label="Download Document"
          title="Download"
        >
          <Download className="w-5 h-5" />
        </a>
        <button
          className="text-[var(--color-primary)] hover:text-[var(--color-accent-hover)] p-2 rounded-lg"
          aria-label="Edit Document"
          title="Rename"
          onClick={onEdit}
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          className="text-[var(--color-text)] hover:text-[var(--color-danger)] p-2 rounded-lg"
          aria-label="Delete Document"
          title="Delete"
          onClick={onDelete}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const tabOptions = [
  { value: "all", label: "All" },
  { value: "user", label: "Uploaded by you" },
  { value: "team", label: "Uploaded by your team" },
];

const sortOptions = [
  { value: "recent", label: "Recently Uploaded" },
  { value: "name", label: "Name" },
  { value: "size", label: "Size" },
];

const DocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [documents, setDocuments] = useState<any[]>([]);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [renameIdx, setRenameIdx] = useState<number | null>(null);
  const [docName, setDocName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [docSizes, setDocSizes] = useState<{ [id: string]: number }>({});
  const [sizesLoading, setSizesLoading] = useState<boolean>(false);
  const [pet, setPet] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [actualPetId, setActualPetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchPetAndDocuments = async () => {
      console.log(petId);
      try {
        if (!petId) {
          setError("No pet ID provided");
          setLoading(false);
          return;
        }

        let currentPetId = petId;

        // If petId is "default", fetch the first available pet
        if (petId === "default") {
          const petsRes = await petServices.getPetsByOwner();
          let petsArr = Array.isArray(petsRes) ? petsRes : petsRes.data;
          if (!petsArr) petsArr = [];
          if (!Array.isArray(petsArr)) petsArr = [petsArr];

          if (petsArr.length === 0) {
            setError("No pets found. Please create a pet profile first.");
            setLoading(false);
            return;
          }

          // Use the first pet's ID (since "default" means single pet)
          currentPetId = petsArr[0].id;
          setActualPetId(currentPetId);
        } else {
          setActualPetId(currentPetId);
        }

        // Fetch pet details by ID
        const petDetailRes = await petServices.getPetById(currentPetId);
        let petDetail = null;

        // Handle different response structures
        if (petDetailRes) {
          if (petDetailRes.data) {
            petDetail = petDetailRes.data;
          } else if (Array.isArray(petDetailRes)) {
            petDetail = petDetailRes[0];
          } else if (typeof petDetailRes === "object" && "id" in petDetailRes) {
            petDetail = petDetailRes;
          }
        }

        setPet(petDetail);
        if (!petDetail) {
          setError("Pet not found");
          setLoading(false);
          return;
        }

        // Fetch documents for this pet
        const docsRes = await petServices.getPetDocuments(currentPetId);
        let docsArr = Array.isArray(docsRes)
          ? docsRes
          : docsRes
          ? [docsRes]
          : [];
        setDocuments(docsArr);
        console.log("docArr:", docsArr);
      } catch (err) {
        console.error("Failed to fetch pet and documents:", err);
        setError("Failed to fetch pet and documents");
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPetAndDocuments();
  }, [petId]);

  // Fetch file sizes after documents are loaded
  useEffect(() => {
    async function getSizes() {
      if (!documents.length) return;

      setSizesLoading(true);
      const sizes: { [id: string]: number } = {};

      await Promise.all(
        documents.map(async (doc) => {
          if (doc.document_url && doc.id) {
            const size = await fetchFileSize(doc.document_url);
            if (size !== undefined) {
              sizes[doc.id] = size;
            }
          }
        })
      );

      setDocSizes(sizes);
      setSizesLoading(false);
    }

    getSizes();
  }, [documents]);

  useEffect(() => {
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      let filtered = documents.filter(
        (d) =>
          d.document_name?.toLowerCase().includes(s) ||
          d.human_owner?.human_owner_name?.toLowerCase().includes(s)
      );
      if (sortBy === "name") {
        filtered = [...filtered].sort((a, b) =>
          (a.document_name || "").localeCompare(b.document_name || "")
        );
      } else if (sortBy === "size") {
        // Use fetched sizes for sorting
        filtered = [...filtered].sort((a, b) => {
          const sizeA = docSizes[a.id] || a.size || 0;
          const sizeB = docSizes[b.id] || b.size || 0;
          return sizeB - sizeA;
        });
      } else if (sortBy === "recent") {
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(b.created_at || b.uploaded_at || 0).getTime() -
            new Date(a.created_at || a.uploaded_at || 0).getTime()
        );
      }
      setSearchResults(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  }, [search, documents, sortBy, docSizes]);

  function filterAndSort(docs: any[]) {
    let filtered = docs;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.document_name?.toLowerCase().includes(s) ||
          d.human_owner?.human_owner_name?.toLowerCase().includes(s)
      );
    }
    if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) =>
        (a.document_name || "").localeCompare(b.document_name || "")
      );
    } else if (sortBy === "size") {
      // Use fetched sizes for sorting
      filtered = [...filtered].sort((a, b) => {
        const sizeA = docSizes[a.id] || a.size || 0;
        const sizeB = docSizes[b.id] || b.size || 0;
        return sizeB - sizeA;
      });
    } else if (sortBy === "recent") {
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.created_at || b.uploaded_at || 0).getTime() -
          new Date(a.created_at || a.uploaded_at || 0).getTime()
      );
    }
    return filtered;
  }

  function getFilteredDocs() {
    if (activeTab === "user") {
      return filterAndSort(
        documents.filter((doc) => doc.staff == null && doc.business == null)
      );
    } else if (activeTab === "team") {
      return filterAndSort(
        documents.filter((doc) => doc.staff != null || doc.business != null)
      );
    }
    return filterAndSort(documents);
  }

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
      <Navbar />
      <div className="container mx-auto max-w-7xl pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">
            {pet ? `${pet.pet_name}'s Documents` : "Pet Documents"}
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-end">
            <div className="relative w-full sm:w-72">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search document"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg w-full pl-10 text-sm sm:text-base py-2 pr-2 text-[var(--color-text)]"
                  autoComplete="off"
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  onFocus={() => search && setShowSuggestions(true)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-text)] opacity-60" />
                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg max-h-60 overflow-auto">
                    {searchResults.map((doc, idx) => (
                      <div
                        key={doc.id}
                        className="px-4 py-2 cursor-pointer hover:bg-[var(--color-accent-hover)] text-[var(--color-text)]"
                        onMouseDown={() => {
                          setSearch(doc.document_name);
                          setShowSuggestions(false);
                        }}
                      >
                        {doc.document_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              className="border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition px-6 py-2 font-semibold rounded-lg w-full sm:w-auto flex items-center gap-2"
              onClick={() =>
                navigate(`/petowner/pet/${actualPetId || petId}/upload`)
              }
            >
              <UploadCloud className="w-5 h-5" /> Upload New Document
            </button>
          </div>
        </div>
        {/* Custom Tabs */}
        <div className="flex gap-2 mb-8">
          {tabOptions.map((tab) => (
            <button
              key={tab.value}
              className={`px-4 py-2 rounded-md font-medium text-base border border-[var(--color-border)] transition-all ${
                activeTab === tab.value
                  ? "bg-[var(--color-primary)] text-[var(--color-background)]"
                  : "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-card)]"
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-[180px] justify-end bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort by: {opt.label}
              </option>
            ))}
          </select>
        </div>
        {/* Custom Sort Dropdown */}
        <div className="flex justify-end mb-4"></div>
        {/* Document Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {loading ? (
            <div className="col-span-2 flex justify-center items-center h-40">
              Loading documents...
            </div>
          ) : (
            <>
              {getFilteredDocs().map((doc, idx) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  fileSize={docSizes[doc.id]}
                  onEdit={() => {
                    setRenameIdx(idx);
                    setDocName(doc.document_name);
                  }}
                  onDelete={() => setDeleteIdx(idx)}
                />
              ))}
            </>
          )}
        </div>
        {/* Delete Modal */}
        {deleteIdx !== null && (
          <DeleteDocumentModal
            open={true}
            documentName={documents[deleteIdx]?.document_name}
            onClose={() => setDeleteIdx(null)}
            onDelete={async () => {
              if (deleteIdx === null) return;
              const documentId = documents[deleteIdx].id;
              try {
                await petServices.deleteDocument(documentId);
                setDocuments((prevDocs) =>
                  prevDocs.filter((_, i) => i !== deleteIdx)
                );
              } catch (err) {
                // Optionally show error to user
                console.error("Failed to delete document", err);
              }
              setDeleteIdx(null);
            }}
          />
        )}
        {/* Rename Modal */}
        {renameIdx !== null && (
          <RenameDocumentModal
            open={true}
            initialName={docName}
            onClose={() => setRenameIdx(null)}
            onSave={async (newName: string) => {
              if (renameIdx === null) return;
              const doc = documents[renameIdx];
              try {
                await petServices.updateDocumentName(doc.id, newName);
                setDocuments((prevDocs) =>
                  prevDocs.map((d, i) =>
                    i === renameIdx ? { ...d, document_name: newName } : d
                  )
                );
              } catch (err) {
                // Optionally show error to user
                console.error("Failed to rename document", err);
              }
              setRenameIdx(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentPage;
