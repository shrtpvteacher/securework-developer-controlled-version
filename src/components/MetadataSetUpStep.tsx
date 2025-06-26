/* import React, { useState } from "react";
import { uploadMetadataToIPFS } from "../logic/ipfsUploader";
import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi";


export interface FormDataState {
  title: string;
  description: string;
  jobPay: string;
  requirements: string[];
  deliverables: string[];
  clientEmail: string;
  deadline: string;
}

interface Props {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  onUploaded: (meta: { uri: string; object: any }) => void;
}


const gradientBtn =
  "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 \
   text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 \
   inline-flex items-center gap-2";

export default function MetadataSetUpStep({
  formData,
  setFormData,
  onUploaded,
}: Props) {
  const { address: account } = useAccount();
  const [isUploading, setIsUploading] = useState(false);

 
  const handleArrayChange = (
    idx: number,
    field: "requirements" | "deliverables",
    val: string
  ) => {
    const copy = [...formData[field]];
    copy[idx] = val;
    setFormData({ ...formData, [field]: copy });
  };

  const addArrayField = (field: "requirements" | "deliverables") =>
    setFormData({ ...formData, [field]: [...formData[field], ""] });


  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const obj = {
        ...formData,
        clientAddress: account ?? "",
        createdAt: new Date().toISOString(),
      };
      const uri = await uploadMetadataToIPFS(obj);
      onUploaded({ uri, object: obj });
    } catch (err) {
      console.error("Metadata upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      
      <input
        type="text"
        placeholder="Job Title"
        className="w-full border p-2 rounded"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <textarea
        placeholder="Job Description"
        className="w-full border p-2 rounded"
        rows={4}
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Pay Amount (in ETH)"
        className="w-full border p-2 rounded"
        value={formData.jobPay}
        onChange={(e) => setFormData({ ...formData, jobPay: e.target.value })}
      />

      <input
        type="email"
        placeholder="Client Email Address"
        className="w-full border p-2 rounded"
        value={formData.clientEmail}
        onChange={(e) =>
          setFormData({ ...formData, clientEmail: e.target.value })
        }
      />

      <input
        type="date"
        className="w-full border p-2 rounded"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
      />

      
      <section>
        <h2 className="text-xl font-semibold mb-2">Requirements</h2>
        {formData.requirements.map((r, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Requirement ${i + 1}`}
            className="w-full border p-2 mb-2 rounded"
            value={r}
            onChange={(e) => handleArrayChange(i, "requirements", e.target.value)}
          />
        ))}
        <button
          onClick={() => addArrayField("requirements")}
          className="text-blue-600 underline text-sm"
        >
          + Add another requirement
        </button>
      </section>

   
      <section>
        <h2 className="text-xl font-semibold mb-2">Deliverables</h2>
        {formData.deliverables.map((d, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Deliverable ${i + 1}`}
            className="w-full border p-2 mb-2 rounded"
            value={d}
            onChange={(e) =>
              handleArrayChange(i, "deliverables", e.target.value)
            }
          />
        ))}
        <button
          onClick={() => addArrayField("deliverables")}
          className="text-blue-600 underline text-sm"
        >
          + Add another deliverable
        </button>
      </section>

      <button onClick={handleUpload} disabled={isUploading} className={gradientBtn}>
        {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isUploading ? "Uploading…" : "Upload Metadata to IPFS"}
      </button>
    </div>
  );
}


*/






import React, { useState } from 'react';
import { uploadMetadataToIPFS } from '../logic/ipfsUploader';
import { Loader2 } from 'lucide-react';

type Props = {
  clientAddress: string;
  contractCreationFee: string;
  onContinue: (args: { metadataURI: string; metadata: any }) => void;
};

const MetadataSetUpStep: React.FC<Props> = ({ clientAddress, contractCreationFee, onContinue }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobPay: '',
    requirements: [''],
    deliverables: [''],
    deadline: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedURI, setUploadedURI] = useState<string | null>(null);
  const [uploadedMetadata, setUploadedMetadata] = useState<any | null>(null);

  const handleArrayChange = (index: number, field: 'requirements' | 'deliverables', value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayField = (field: 'requirements' | 'deliverables') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleUpload = async () => {
    setIsUploading(true);
    const metadata = {
      ...formData,
      clientAddress,
      contractCreationFee,
      createdAt: new Date().toISOString()
    };

    try {
      const uri = await uploadMetadataToIPFS(metadata);
      setUploadedURI(uri);
      setUploadedMetadata(metadata);
    } catch (err) {
      console.error('IPFS upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Job Title"
        className="w-full border p-2 rounded"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        placeholder="Job Description"
        className="w-full border p-2 rounded"
        rows={4}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Pay Amount (in ETH)"
        className="w-full border p-2 rounded"
        value={formData.jobPay}
        onChange={(e) => setFormData({ ...formData, jobPay: e.target.value })}
      />
      <input
        type="date"
        className="w-full border p-2 rounded"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
      />

      <div>
        <h2 className="text-lg font-semibold mb-2">Requirements</h2>
        {formData.requirements.map((req, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Requirement ${idx + 1}`}
            className="w-full border p-2 mb-2 rounded"
            value={req}
            onChange={(e) => handleArrayChange(idx, 'requirements', e.target.value)}
          />
        ))}
        <button
          type="button"
          className="text-blue-600 underline text-sm"
          onClick={() => addArrayField('requirements')}
        >
          + Add Requirement
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Deliverables</h2>
        {formData.deliverables.map((del, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Deliverable ${idx + 1}`}
            className="w-full border p-2 mb-2 rounded"
            value={del}
            onChange={(e) => handleArrayChange(idx, 'deliverables', e.target.value)}
          />
        ))}
        <button
          type="button"
          className="text-blue-600 underline text-sm"
          onClick={() => addArrayField('deliverables')}
        >
          + Add Deliverable
        </button>
      </div>

      <div className="space-x-4 flex items-center">
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-6 rounded shadow hover:opacity-90"
        >
          {isUploading ? (
            <span className="flex items-center space-x-2">
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Uploading...</span>
            </span>
          ) : (
            'Upload Metadata to IPFS'
          )}
        </button>

        {uploadedURI && (
          <p className="text-green-700 text-sm">
            ✅ Successfully uploaded to IPFS:{' '}
            <a href={uploadedURI} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">
              View URI
            </a>
          </p>
        )}
      </div>

      {uploadedURI && uploadedMetadata && (
        <button
          onClick={() => onContinue({ metadataURI: uploadedURI, metadata: uploadedMetadata })}
          className="mt-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-6 rounded shadow hover:opacity-90"
        >
          Preview Metadata →
        </button>
      )}
    </div>
  );
};

export default MetadataSetUpStep;