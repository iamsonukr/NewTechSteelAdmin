import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageHeader from "../../components/shared/PageHeader";
import ContactForm from "./ContactForm";
import { getContactById, updateContact } from "../../api/services/contactDetail.service";
import toast from "react-hot-toast";

export default function ContactEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getContactById(id)
      .then(res => {
        const c = res.data.data;
        setFormData({
          branchName:    c.branchName,
          phones:        c.phones        || [],
          emails:        c.emails        || [],
          address:       c.address       || { line1: "", line2: "", city: "", state: "", pincode: "", country: "India" },
          whatsapp:      c.whatsapp      || "",
          googleMapsUrl: c.googleMapsUrl || "",
          googleMapsEmbed: c.googleMapsEmbed || "",
          socialLinks:   c.socialLinks   || [],
          businessHours: c.businessHours || [],
          isPrimary:     c.isPrimary,
          isActive:      c.isActive,
          order:         c.order         || 0,
        });
      })
      .catch(() => toast.error("Failed to load contact"))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branchName) { toast.error("Branch name is required"); return; }
    setLoading(true);
    try {
      await updateContact(id, {
        ...formData,
        phones:        JSON.stringify(formData.phones),
        emails:        JSON.stringify(formData.emails),
        address:       JSON.stringify(formData.address),
        socialLinks:   JSON.stringify(formData.socialLinks),
        businessHours: JSON.stringify(formData.businessHours),
        isPrimary:     String(formData.isPrimary),
        isActive:      String(formData.isActive),
      });
      toast.success("Contact updated!");
      navigate("/contact-details");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update contact");
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Edit Branch" breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Contact Details", to: "/contact-details" }, { label: "Edit" }]} />
      <div className="max-w-3xl">
        <ContactForm formData={formData} setFormData={setFormData} loading={loading} onSubmit={handleSubmit} onCancel={() => navigate("/contact-details")} submitLabel="Update Branch" />
      </div>
    </div>
  );
}
