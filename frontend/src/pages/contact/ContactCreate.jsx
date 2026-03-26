import { useState } from "react";
import { useNavigate } from "react-router";
import PageHeader from "../../components/shared/PageHeader";
import ContactForm from "./ContactForm";
import { createContact } from "../../api/services/contactDetail.service";
import toast from "react-hot-toast";

const defaultForm = {
  branchName: "", phones: [], emails: [],
  address: { line1: "", line2: "", city: "", state: "", pincode: "", country: "India" },
  whatsapp: "", googleMapsUrl: "", googleMapsEmbed: "",
  socialLinks: [], businessHours: [],
  isPrimary: false, isActive: true, order: 0,
};

export default function ContactCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branchName) { toast.error("Branch name is required"); return; }
    setLoading(true);
    try {
      await createContact({
        ...formData,
        phones:        JSON.stringify(formData.phones),
        emails:        JSON.stringify(formData.emails),
        address:       JSON.stringify(formData.address),
        socialLinks:   JSON.stringify(formData.socialLinks),
        businessHours: JSON.stringify(formData.businessHours),
        isPrimary:     String(formData.isPrimary),
        isActive:      String(formData.isActive),
      });
      toast.success("Contact created!");
      navigate("/admin-panel/contact-details");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create contact");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Add Branch" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Contact Details", to: "/contact-details" }, { label: "Add" }]} />
      <div className="max-w-3xl">
        <ContactForm formData={formData} setFormData={setFormData} loading={loading} onSubmit={handleSubmit} onCancel={() => navigate("/admin-panel/contact-details")} submitLabel="Save Branch" />
      </div>
    </div>
  );
}
