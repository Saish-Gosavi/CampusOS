import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, Upload, CheckCircle2, AlertCircle,
  User, Mail, Phone, Calendar, BookOpen, ArrowLeft, Loader2, X, FileText
} from "lucide-react";
import { admissionApi } from "@/services/api";

const Route = {
  component: RegisterPage
};

function RegisterPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [fileValues, setFileValues] = useState({});
  const [fileNames, setFileNames] = useState({});

  useEffect(() => {
    admissionApi.getConfig()
      .then(res => {
        const cfg = res.data || res;
        setConfig(cfg);
        // Init field values
        const init = {};
        (cfg.fields || []).forEach(f => { init[f.key] = ""; });
        setFieldValues(init);
      })
      .catch(() => setError("Failed to load registration form. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const handleFieldChange = (key, value) => {
    setFieldValues(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (key, file) => {
    setFileValues(prev => ({ ...prev, [key]: file }));
    setFileNames(prev => ({ ...prev, [key]: file ? file.name : "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    const missingField = config.fields.find(f => f.required && !fieldValues[f.key]?.trim());
    if (missingField) {
      setError(`Please fill in the required field: ${missingField.label}`);
      return;
    }
    const missingDoc = config.documents.find(d => d.required && !fileValues[d.key]);
    if (missingDoc) {
      setError(`Please upload the required document: ${missingDoc.label}`);
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(fieldValues).forEach(([k, v]) => fd.append(k, v));
      Object.entries(fileValues).forEach(([k, file]) => { if (file) fd.append(k, file); });

      await admissionApi.apply(fd);
      setSubmitted(true);
    } catch (err) {
      setError(err?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldIcon = (type) => {
    const map = { email: Mail, tel: Phone, date: Calendar, text: User };
    const Icon = map[type] || User;
    return <Icon className="h-4 w-4 text-slate-400" />;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-white to-primary/10">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-slate-500">Loading registration form…</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-white to-primary/10 p-4">
        <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-10 text-center shadow-2xl">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Application Submitted!</h1>
          <p className="mt-3 text-slate-500 text-sm leading-relaxed">
            Your hostel admission application has been received. The admin will review it and contact you shortly.
          </p>
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Application submitted by:</p>
            <p className="font-semibold text-slate-800">{fieldValues.fullName}</p>
            <p className="text-sm text-slate-500">{fieldValues.email}</p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-primary transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Sign In
          </button>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
          {/* Logo + Title */}
          <div className="mb-8 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Hostel Admission</h1>
              <p className="text-sm text-slate-500">Fill in the form below to apply for hostel accommodation</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dynamic Fields */}
            {config?.fields?.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
                  <User className="h-4 w-4" /> Personal Information
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {config.fields.map(field => (
                    <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        {field.label}
                        {field.required && <span className="ml-1 text-red-500">*</span>}
                      </label>
                      {field.type === "select" ? (
                        <select
                          value={fieldValues[field.key] || ""}
                          onChange={e => handleFieldChange(field.key, e.target.value)}
                          required={field.required}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white"
                        >
                          <option value="">Select {field.label}</option>
                          {(field.options || []).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea
                          rows={3}
                          value={fieldValues[field.key] || ""}
                          onChange={e => handleFieldChange(field.key, e.target.value)}
                          required={field.required}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white"
                        />
                      ) : (
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                            {fieldIcon(field.type)}
                          </span>
                          <input
                            type={field.type}
                            value={fieldValues[field.key] || ""}
                            onChange={e => handleFieldChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Document Uploads */}
            {config?.documents?.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
                  <FileText className="h-4 w-4" /> Required Documents
                </h2>
                <p className="mb-4 text-xs text-slate-400">Accepted formats: JPG, PNG, PDF • Max size: 5MB per file</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {config.documents.map(doc => (
                    <div key={doc.key}>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        {doc.label}
                        {doc.required && <span className="ml-1 text-red-500">*</span>}
                      </label>
                      <label
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-3 transition ${
                          fileNames[doc.key]
                            ? "border-green-400 bg-green-50"
                            : "border-slate-200 bg-slate-50 hover:border-primary hover:bg-primary/5"
                        }`}
                      >
                        <input
                          type="file"
                          className="sr-only"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={e => handleFileChange(doc.key, e.target.files[0] || null)}
                        />
                        {fileNames[doc.key] ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                            <span className="truncate text-xs text-green-700">{fileNames[doc.key]}</span>
                            <button
                              type="button"
                              onClick={e => { e.preventDefault(); handleFileChange(doc.key, null); }}
                              className="ml-auto"
                            >
                              <X className="h-4 w-4 text-slate-400" />
                            </button>
                          </>
                        ) : (
                          <>
                            <Upload className="h-5 w-5 flex-shrink-0 text-slate-400" />
                            <span className="text-xs text-slate-500">Click to upload {doc.label}</span>
                          </>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting Application…</>
              ) : (
                <><CheckCircle2 className="h-4 w-4" /> Submit Application</>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="font-medium text-primary hover:underline">
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
export { Route };
