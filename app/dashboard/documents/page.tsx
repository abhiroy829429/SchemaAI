"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, FileText, Trash2, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DOCUMENT_TYPES } from "@/lib/constants";

interface Doc {
  _id: string;
  name: string;
  documentType: string;
  fileUrl: string;
  mimeType: string;
  status: string;
  extractedData?: { name?: string; dateOfBirth?: string; maskedNumber?: string };
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState(DOCUMENT_TYPES[0]);
  const fileRef = useRef<HTMLInputElement>(null);

  function loadDocs() {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((d) => { if (d.success) setDocuments(d.data); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadDocs(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", docType);

    try {
      const res = await fetch("/api/documents", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        toast.success("Document uploaded with OCR extraction!");
        loadDocs();
      } else toast.error(data.error);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Document Center</h1>
          <p className="text-sm text-muted-foreground">Upload PDF, PNG, or JPG documents with mock OCR extraction.</p>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Upload Document</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={docType} onChange={(e) => setDocType(e.target.value as typeof docType)}>
                {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>
            <div
              className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG up to 10MB</p>
              <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleUpload} />
            </div>
            {uploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading and extracting...
              </div>
            )}
          </CardContent>
        </Card>

        {loading ? (
          <div className="animate-pulse h-48 bg-muted rounded-2xl" />
        ) : documents.length === 0 ? (
          <EmptyState title="No documents uploaded" description="Upload your first document to get started with checklists." />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <Card key={doc._id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.documentType}</p>
                      </div>
                    </div>
                    <Badge variant={doc.status === "verified" ? "success" : "info"}>{doc.status}</Badge>
                  </div>
                  {doc.extractedData && (
                    <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1">
                      <p><span className="text-muted-foreground">Name:</span> {doc.extractedData.name}</p>
                      <p><span className="text-muted-foreground">DOB:</span> {doc.extractedData.dateOfBirth}</p>
                      <p><span className="text-muted-foreground">Number:</span> {doc.extractedData.maskedNumber}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
