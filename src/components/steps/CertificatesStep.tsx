import React, { useRef, useState } from "react";
import { Certificate } from "@/types/resume";
import { analyzeCertificateEvidenceAction } from "@/app/actions/ai";
import { Plus, Trash2, Award, Upload, Sparkles, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import { generateId } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  data: Certificate[];
  onChange: (data: Certificate[]) => void;
}

export const CertificatesStep: React.FC<Props> = ({ data, onChange }) => {
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState("");
  const [scanError, setScanError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addCertificate = () => {
    const newCert: Certificate = {
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
    };
    onChange([...data, newCert]);
  };

  const removeCertificate = (id: string) => {
    onChange(data.filter((cert) => cert.id !== id));
  };

  const handleChange = (id: string, field: keyof Certificate, value: string) => {
    onChange(
      data.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    );
  };

  const fileToDataUrl = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read the selected file."));
      reader.readAsDataURL(file);
    });
  };

  const optimizeFileForScan = async (file: File) => {
    if (!file.type.startsWith("image/")) return fileToDataUrl(file);

    const imageUrl = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Could not load the selected image."));
        img.src = imageUrl;
      });

      const maxSide = 900;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext("2d");
      if (!context) return fileToDataUrl(file);

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.62);
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  };

  const applyScannedCertificate = (certificate: Partial<Certificate>) => {
    const newCert: Certificate = {
      id: generateId(),
      name: certificate.name || "",
      issuer: certificate.issuer || "",
      date: certificate.date || "",
      description: certificate.description || "",
      category: certificate.category || "unknown",
      skills: Array.isArray(certificate.skills) ? certificate.skills : [],
    };

    onChange([...data, newCert]);
  };

  const withClientTimeout = async <T,>(promise: Promise<T>, timeoutMs: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Scan took too long. Try a clearer cropped image or add the certificate manually."));
      }, timeoutMs);
    });

    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(timeoutId!);
    }
  };

  const scanEvidence = async () => {
    setScanError("");

    if (!scanFile) {
      setScanError("Upload a PDF or picture first.");
      return;
    }

    if (scanFile && scanFile.type === "application/pdf" && scanFile.size > 6 * 1024 * 1024) {
      setScanError("Please upload a PDF under 6 MB.");
      return;
    }

    setIsScanning(true);
    const currentFile = scanFile;
    const isImage = currentFile.type.startsWith("image/");
    setScanStage(isImage ? "Optimizing image..." : "Preparing PDF...");
    try {
      const dataUrl = await optimizeFileForScan(currentFile);
      setScanStage(currentFile.type === "application/pdf" ? "Reading PDF text..." : "Reading image...");

      const scanPromise = analyzeCertificateEvidenceAction({
        sourceType: "file",
        filename: currentFile.name,
        mimeType: currentFile.type,
        dataUrl,
      });

      scanPromise.catch(() => undefined);
      const result = await withClientTimeout(scanPromise, isImage ? 12000 : 28000);

      applyScannedCertificate(result.certificate);
      setScanFile(null);
      setScanStage("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      setScanError(error?.message || "Could not scan this certificate. Please try another file.");
    } finally {
      setIsScanning(false);
    }
  };

  const inputClasses = "w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium";
  const labelClasses = "text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 ml-1";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Certificates & Achievements</h2>
          <p className="text-slate-500 dark:text-slate-400">Showcase your specialized skills and recognitions.</p>
        </div>
        <button
          onClick={addCertificate}
          className="flex w-full items-center justify-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all font-bold shadow-lg shadow-slate-100 dark:shadow-blue-900/20 sm:w-auto"
        >
          <Plus size={18} /> Add Certificate
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <label className={labelClasses}>PDF or Picture</label>
            <label className="flex h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 text-slate-600 transition-colors hover:border-blue-400 hover:bg-blue-50/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-600 dark:hover:bg-blue-950/30">
              <span className="shrink-0 text-slate-400">
                {scanFile?.type === "application/pdf" ? <FileText size={18} /> : scanFile ? <ImageIcon size={18} /> : <Upload size={18} />}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold">
                {scanFile ? scanFile.name : "Choose file"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  setScanError("");
                  setScanFile(e.target.files?.[0] || null);
                }}
              />
            </label>
          </div>

          <button
            onClick={scanEvidence}
            disabled={isScanning}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-blue-900/20 sm:w-auto"
          >
            {isScanning ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isScanning ? "Scanning" : "Scan & Add"}
          </button>
        </div>
        <div className="mt-3 min-h-5 text-sm font-semibold">
          {scanError ? (
            <span className="text-red-500 dark:text-red-400">{scanError}</span>
          ) : isScanning ? (
            <span className="text-blue-600 dark:text-blue-400">
              {scanStage || "Scanning..."}
            </span>
          ) : null}
        </div>
      </div>

      {data.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30"
        >
          <Award size={40} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium">No certificates added yet.</p>
        </motion.div>
      )}

      <div className="space-y-6">
        <AnimatePresence>
          {data.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-6"
            >
              <button
                onClick={() => removeCertificate(cert.id)}
                className="absolute right-4 top-4 rounded-xl p-2 text-slate-300 transition-all hover:bg-red-50 hover:text-red-500 dark:text-slate-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              >
                <Trash2 size={20} />
              </button>

              <div className="grid grid-cols-1 gap-5 pr-10 md:grid-cols-3">
                <div className="flex min-w-0 flex-col">
                  <label className={labelClasses}>Certificate Name</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleChange(cert.id, "name", e.target.value)}
                    placeholder="e.g. AWS Solutions Architect"
                    className={inputClasses}
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <label className={labelClasses}>Issuing Organization</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleChange(cert.id, "issuer", e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className={inputClasses}
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <label className={labelClasses}>Date Issued</label>
                  <input
                    type="date"
                    value={cert.date}
                    onChange={(e) => handleChange(cert.id, "date", e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
