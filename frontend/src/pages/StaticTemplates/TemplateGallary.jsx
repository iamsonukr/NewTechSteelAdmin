import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import {
    RefreshCw,
    FileImage,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Tag,
    Sun,
    Moon
} from "lucide-react";
import { usePoster } from "../../context/PosterContext";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const TemplateGallery = ({
    templates,
    loading,
    error,
    refreshing,
    pagination,
    onRefresh,
    onRetry,
    onPageChange
}) => {
    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode.toString());
    };
    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
    }, []);
    const { baseUrl } = usePoster();
    const image_path = import.meta.env.IMAGE_PATH || 'https://api.bookmyposter.com/';
    const newBaseUrl = `${image_path}uploads/`;
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const formatImageUrl = (templatePath) => {
        if (!templatePath) return null;
        const cleanPath = templatePath.replace(/\\/g, '/').replace(/^uploads\//, '');
        return `${newBaseUrl}${cleanPath}`;
    };

    const renderTags = (tags) => {
        if (!tags || !Array.isArray(tags) || tags.length === 0) return [];
        return tags.slice(0, 3); // Show only first 3 tags
    };

    if (loading && !refreshing) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Loading templates...</p>
                </div>
            </div>
        );
    }

    if (error && !templates.length) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-8 text-center">
                    <div className="text-red-500 dark:text-red-400 mb-4">
                        <FileImage className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-lg font-medium">Failed to load templates</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                    <Button
                        onClick={onRetry}
                        variant="primary"
                        className="mt-4"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

  return (
  <div id="templates" className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 p-9">

    {/* Header */}
    <div className="p-6 border-b border-gray-100 dark:border-white/[0.05] flex justify-center">
      <div className="flex items-center gap-3">
        <FileImage className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
          Our Latest Templates
        </h2>
      </div>
    </div>

    {/* Gallery Wrapper */}
    <div className="flex justify-center">
      <div className="w-full max-w-7xl px-6 py-8">

        {templates.length === 0 ? (
          <div className="text-center py-20">
            <FileImage className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No templates found
            </p>
          </div>
        ) : (
          <div className="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-9">
            {templates.map((template) => (
              <div
                key={template._id}
                className="bg-white dark:bg-white/[0.02] rounded-lg border border-gray-200 dark:border-white/[0.05] overflow-hidden hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="h-48 bg-gray-100 dark:bg-gray-800">
                  {template.template ? (
                    <img
                      src={formatImageUrl(template.template)}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <FileImage className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {template.name || "Untitled Template"}
                  </h3>

                  <p className="text-xs text-gray-500 mt-2">
                    Created {formatDate(template.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  </div>
);
};

export default TemplateGallery;
