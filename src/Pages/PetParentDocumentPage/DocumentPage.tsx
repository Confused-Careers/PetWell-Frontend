import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar";
import DeleteDocumentModal from "../../Components/Document/DeleteDocumentModal";
import RenameDocumentModal from "../../Components/Document/RenameDocumentModal";
import petServices from "../../Services/petServices";
import { Download, Pencil, X, Search, UploadCloud } from "lucide-react";
import DocumentInfo from "../../Components/Document/DocumentInfo";

// Helper to format file size

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
  const [editDocIdx, setEditDocIdx] = useState<number | null>(null);
  const [editDocName, setEditDocName] = useState<string>("");
  const [deleteDocIdx, setDeleteDocIdx] = useState<number | null>(null);
  const [deleteDocName, setDeleteDocName] = useState<string>("");

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

  const handleEditDocument = (idx: number) => {
    setEditDocIdx(idx);
    setEditDocName(documents[idx]?.document_name || documents[idx]?.name || "");
  };

  const handleSaveDocumentName = async (newName: string) => {
    if (editDocIdx === null) return;
    try {
      const doc = documents[editDocIdx];
      if (!doc.id) throw new Error("No document id");
      await petServices.updateDocumentName(doc.id, newName);
      setDocuments((prevDocs: any[]) =>
        prevDocs.map((d, i) =>
          i === editDocIdx ? { ...d, document_name: newName, name: newName } : d
        )
      );
      setEditDocIdx(null);
    } catch (err) {
      setEditDocIdx(null);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    const idx = documents.findIndex((d) => d.id === docId);
    setDeleteDocIdx(idx);
    setDeleteDocName(
      documents[idx]?.document_name || documents[idx]?.name || ""
    );
  };

  const handleConfirmDeleteDocument = async () => {
    if (deleteDocIdx === null) return;
    try {
      const doc = documents[deleteDocIdx];
      if (!doc.id) throw new Error("No document id");
      await petServices.deleteDocument(doc.id);
      setDocuments((prevDocs: any[]) =>
        prevDocs.filter((_, i) => i !== deleteDocIdx)
      );
      setDeleteDocIdx(null);
    } catch (err) {
      setDeleteDocIdx(null);
    }
  };

  // Download handler for a document
  const handleDownloadDocument = (doc: any) => {
    const url = doc.document_url || doc.url;
    const name = doc.document_name || doc.name || "document";
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
      <Navbar />
      <div className="container mx-auto max-w-7xl pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <p className="text-2xl font-lighter flex items-center gap-3 font-serif">
            {pet ? `${pet.pet_name}'s Documents` : "Pet Documents"}
          </p>
          <div className="flex flex-col  sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-end">
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
                  className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-full w-full pl-10 text-sm sm:text-base py-2 pr-2 text-[var(--color-text)]"
                  autoComplete="off"
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  onFocus={() => search && setShowSuggestions(true)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-text)] opacity-60" />
                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg max-h-60 overflow-auto">
                    {searchResults.map((doc) => (
                      <div
                        key={doc.id}
                        className="px-4 py-2 cursor-pointer hover:bg-[var(--color-accent-hover)] text-[var(--color-text)] rounded-full"
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
              className="bg-[var(--color-card-button)] cursor-pointer text-[var(--color-text)] hover:opacity-90 transition px-6 py-2 font-semibold rounded-full w-full sm:w-auto flex items-center gap-2"
              onClick={() =>
                navigate(`/petowner/pet/${actualPetId || petId}/upload`)
              }
            >
              <UploadCloud className="w-5 h-5" /> Upload New Document
            </button>
          </div>
        </div>
        {/* Custom Tabs and Sort Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 w-full">
          <div className="flex gap-3 mb-2 sm:mb-0">
            {tabOptions.map((tab) => (
              <button
                key={tab.value}
                className={`px-6 py-2 rounded-full font-medium text-base border transition-all cursor-pointer
                  ${
                    activeTab === tab.value
                      ? "bg-[var(--color-text)] text-[var(--color-background)] border-[var(--color-text)]"
                      : "bg-transparent text-[var(--color-text)] border-[var(--color-text)]"
                  }
                `}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex justify-end w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-[180px] cursor-pointer justify-end bg-[var(--color-card)] border border-[var(--color-border)] rounded-full px-3 py-2 text-[var(--color-text)]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort by: {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Document Grid */}
        {getFilteredDocs().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
            {getFilteredDocs().map((doc) => {
              let ext =
                doc.document_name?.split(".").pop()?.toLowerCase() ||
                doc.name?.split(".").pop()?.toLowerCase() ||
                "";
              let type: "pdf" | "img" = ext === "pdf" ? "pdf" : "img";
              return (
                <DocumentInfo
                  key={doc.id}
                  name={doc.document_name || doc.name || ""}
                  type={type}
                  onEdit={() =>
                    handleEditDocument(
                      documents.findIndex((d) => d.id === doc.id)
                    )
                  }
                  onDelete={() => handleDeleteDocument(doc.id)}
                  onDownload={() => handleDownloadDocument(doc)}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-lg text-[var(--color-text)] opacity-70">
            No documents uploaded yet.
          </div>
        )}
        {editDocIdx !== null && (
          <RenameDocumentModal
            open={true}
            initialName={editDocName}
            onClose={() => setEditDocIdx(null)}
            onSave={handleSaveDocumentName}
          />
        )}
        {deleteDocIdx !== null && (
          <DeleteDocumentModal
            open={true}
            documentName={deleteDocName}
            onClose={() => setDeleteDocIdx(null)}
            onDelete={handleConfirmDeleteDocument}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentPage;
