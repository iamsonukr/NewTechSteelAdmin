import { useState, useEffect } from "react";
import { adminService } from "../../api/axios";
import TemplatesList from "../Templates/Templates/TemplatesList";
import AddTemplates from "../Templates/AddTemplates/AddTemplates";
import { toast } from "react-toastify";
import { useModal } from "../../hooks/useModal";
import TemplateGallary from "./TemplateGallary";
// import { useModal } from "../../../hooks/useModal";
// import TemplatesList from "./TemplatesList";
// import AddTemplates from "../AddTemplates/AddTemplates";
// import { adminService } from "../../../api/axios";
// import { usePoster } from "../../../context/PosterContext";

const StaticTemplates = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [templates, setTemplates] = useState([]);
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: 10
  });

  // Fetch templates on component mount and when page changes
  useEffect(() => {
    fetchTemplates(pagination.currentPage);
  }, []);

  const fetchTemplates = async (page = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Add pagination parameters to the API call
      const response = await adminService.get('/template/templates'
        , {
        params: {
          page: page,
          limit: 10
        }
      }
    );
      
      console.log('API Response:', response);
      
      if (response?.data?.status === "success") {
        setTemplates(response?.data?.data?.templates || []);
        
        // Update pagination state from API response
        if (response?.data?.data?.pagination) {
          setPagination(response.data.data.pagination);
        }
      } else {
        setError('Failed to fetch templates');
        toast.error('Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Error fetching templates');
      toast.error('Error fetching templates');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleEditModal = (template) => {
    setTemplateData(template);
    openModal();
  };

  const handleAddModal = () => {
    setTemplateData(null);
    openModal();
  };

  const handleRefresh = () => {
    fetchTemplates(pagination.currentPage, true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTemplates(newPage);
    }
  };

  const handleRetry = () => {
    fetchTemplates(pagination.currentPage);
  };

  const onDelete = async (templateId) => {
    console.log("Deleting template:", templateId);
    
    try {
      const response = await adminService.delete(`/template/admin/scheduled-templates/${templateId}`);
      console.log(response);
      
      if (response?.data?.status === "success") {
        toast.success("Template deleted successfully");
        
        // If we deleted the last item on a page (not page 1), go to previous page
        if (templates.length === 1 && pagination.currentPage > 1) {
          fetchTemplates(pagination.currentPage - 1);
        } else {
          fetchTemplates(pagination.currentPage);
        }
      } else {
        toast.error("Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Error deleting template");
    }
  };

  const handleModalClose = () => {
    console.log("Closing")
    setTemplateData(null);
    closeModal();
  };

  const handleTemplateSuccess = () => {
    fetchTemplates(pagination.currentPage);
    handleModalClose();
  };

  return (
    <>
      <TemplateGallary
        templates={templates}
        loading={loading}
        error={error}
        refreshing={refreshing}
        pagination={pagination}
        onEdit={handleEditModal}
        onAdd={handleAddModal}
        onRefresh={handleRefresh}
        onDelete={onDelete}
        onRetry={handleRetry}
        onPageChange={handlePageChange}
      />
      
      {/* Modal */}
      {isOpen && (
        <AddTemplates
          isOpen={isOpen}
          onClose={handleModalClose}
          templateData={templateData}
          onSuccess={handleTemplateSuccess}
        />
      )}
    </>
  );
};

export default StaticTemplates;