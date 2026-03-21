import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { adminService } from "../../api/axios";
import { useState, useEffect } from "react";
import AddUser from "./AddUser";
import { useModal } from "../../hooks/useModal";
import { 
  Edit2, 
  RefreshCw, 
  UserPlus, 
  Users as UsersIcon, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Download,
  Search,
  X,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileSpreadsheet,
  Calendar,
  Mail,
  ChevronDown
} from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Search Bar Component
const SearchBar = ({ searchText, onSearchChange, onSearchSubmit, onClear, loading }) => {
  const [localSearch, setLocalSearch] = useState(searchText);

  useEffect(() => {
    setLocalSearch(searchText);
  }, [searchText]);

  const handleSubmit = () => {
    onSearchSubmit(localSearch);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleClear = () => {
    setLocalSearch('');
    onClear();
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search users by name, username, email, or phone..."
          disabled={loading}
          className="block w-full pl-10 pr-20 py-2.5 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
          {localSearch && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || localSearch === searchText}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
        </div>
      </div>
      
      {searchText && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Searching for: <span className="font-medium text-gray-900 dark:text-white">"{searchText}"</span>
        </div>
      )}
    </div>
  );
};

// Filter Component
const FilterPanel = ({ filters, onApplyFilters, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      status: '',
      dateFrom: '',
      dateTo: ''
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
    setIsOpen(false);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="z-10 flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-white/[0.03] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-white/[0.05] z-20 p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Filter Users</h3>
            
            <div className="space-y-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={localFilters.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Registration Date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={localFilters.dateFrom}
                    onChange={(e) => handleChange('dateFrom', e.target.value)}
                    className="px-3 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    value={localFilters.dateTo}
                    onChange={(e) => handleChange('dateTo', e.target.value)}
                    className="px-3 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="To"
                  />
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-white/[0.05]">
              <Button
                onClick={handleClear}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                onClick={handleApply}
                variant="primary"
                size="sm"
                className="flex-1"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Pagination Size Selector
const PaginationSizeSelector = ({ pageSize, onPageSizeChange, disabled }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600 dark:text-gray-400">
        Show:
      </label>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        disabled={disabled}
        className="px-3 py-1.5 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        per page
      </span>
    </div>
  );
};

// Main Users Component
const Users = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 50,
    hasNext: false,
    hasPrev: false
  });

  const fetchUsers = async (page = 1, isRefresh = false, search = '', sort = sortConfig, appliedFilters = filters) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Build query string
      let queryString = `/user/all-users?page=${page}&limit=${pagination.limit}`;
      
      // Add search parameter
      if (search.trim()) {
        queryString += `&search=${encodeURIComponent(search.trim())}`;
      }
      
      // Add sort parameters
      if (sort.key) {
        queryString += `&sortBy=${sort.key}&sortOrder=${sort.direction}`;
      }
      
      // Add filter parameters
      if (appliedFilters.status) {
        queryString += `&status=${appliedFilters.status}`;
      }
      if (appliedFilters.dateFrom) {
        queryString += `&dateFrom=${appliedFilters.dateFrom}`;
      }
      if (appliedFilters.dateTo) {
        queryString += `&dateTo=${appliedFilters.dateTo}`;
      }
      
      const response = await adminService.get(queryString);
      console.log("All users are here", response);
      
      if (response?.data?.status === "success") {
        setUsers(response?.data?.data?.users || []);
        setPagination({
          currentPage: response?.data?.data?.pagination?.currentPage || 1,
          totalPages: response?.data?.data?.pagination?.totalPages || 1,
          totalCount: response?.data?.data?.pagination?.totalCount || 0,
          limit: response?.data?.data?.pagination?.limit || 50,
          hasNext: response?.data?.data?.pagination?.hasNext || false,
          hasPrev: response?.data?.data?.pagination?.hasPrev || false
        });
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers(pagination.currentPage, false, searchText, sortConfig, filters);
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers(pagination.currentPage, true, searchText, sortConfig, filters);
    }, 30000);

    return () => clearInterval(interval);
  }, [pagination.currentPage, searchText, sortConfig, filters]);

  const handleEditModal = (user) => {
    setUser(user);
    openModal();
  };

  const handleAddModal = () => {
    setUser(null);
    openModal();
  };

  const handleRefresh = () => {
    fetchUsers(pagination.currentPage, true, searchText, sortConfig, filters);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage, false, searchText, sortConfig, filters);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, limit: newSize }));
    fetchUsers(1, false, searchText, sortConfig, filters);
  };

  const handleSearchSubmit = (search) => {
    setSearchText(search);
    fetchUsers(1, false, search, sortConfig, filters);
  };

  const handleSearchClear = () => {
    setSearchText('');
    fetchUsers(1, false, '', sortConfig, filters);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);
    fetchUsers(pagination.currentPage, false, searchText, newSortConfig, filters);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    fetchUsers(1, false, searchText, sortConfig, newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      dateFrom: '',
      dateTo: ''
    };
    setFilters(clearedFilters);
    fetchUsers(1, false, searchText, sortConfig, clearedFilters);
  };

  const handleSendProfileRequest = async (userId, email, userName) => {
    try {
      const response = await adminService.post(`/user/send-profile-request`, {
        userId,
        email,
        userName
      });
      
      if (response?.data?.status === "success") {
        alert('Profile completion request sent successfully!');
      } else {
        alert('Failed to send profile request');
      }
    } catch (error) {
      console.error('Error sending profile request:', error);
      alert('Error sending profile request. Please try again.');
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const exportData = users.map(user => ({
        'Name': user.name || 'N/A',
        'Username': user.username || 'N/A',
        'Email': user.email || 'N/A',
        'Phone': user.phoneNumber || user.phone || 'N/A',
        'Status': user.isActive ? 'Active' : 'Inactive',
        'Bio': user.bio || 'N/A',
        'Active Frame': user.activeFrame || 'N/A',
        'Joined Date': formatDate(user.createdAt)
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      
      // Auto-size columns
      const maxWidth = 20;
      ws['!cols'] = Object.keys(exportData[0] || {}).map(() => ({ wch: maxWidth }));
      
      XLSX.writeFile(wb, `users_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      alert('Excel file downloaded successfully!');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export to Excel');
    }
  };

  // Export to PDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4');
      
      doc.setFontSize(18);
      doc.text('Users Report', 14, 15);
      
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
      doc.text(`Total Users: ${pagination.totalCount}`, 14, 28);
      
      const tableData = users.map(user => [
        user.name || 'N/A',
        user.username || 'N/A',
        user.email || 'N/A',
        user.phoneNumber || user.phone || 'N/A',
        user.isActive ? 'Active' : 'Inactive',
        formatDate(user.createdAt)
      ]);
      
      doc.autoTable({
        startY: 35,
        head: [['Name', 'Username', 'Email', 'Phone', 'Status', 'Joined']],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
        alternateRowStyles: { fillColor: [248, 250, 252] }
      });
      
      doc.save(`users_report_${new Date().toISOString().split('T')[0]}.pdf`);
      alert('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export to PDF');
    }
  };

  // Generate Daily User Report
  const handleDailyReport = () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dailyUsers = users.filter(user => {
        const userDate = new Date(user.createdAt);
        userDate.setHours(0, 0, 0, 0);
        return userDate.getTime() === today.getTime();
      });

      if (dailyUsers.length === 0) {
        alert('No users registered today');
        return;
      }

      const doc = new jsPDF('l', 'mm', 'a4');
      
      doc.setFontSize(18);
      doc.text('Daily User Registration Report', 14, 15);
      
      doc.setFontSize(10);
      doc.text(`Date: ${formatDate(today)}`, 14, 22);
      doc.text(`Total New Users Today: ${dailyUsers.length}`, 14, 28);
      
      const tableData = dailyUsers.map(user => [
        user.name || 'N/A',
        user.username || 'N/A',
        user.email || 'N/A',
        user.phoneNumber || user.phone || 'N/A',
        formatDateTime(user.createdAt)
      ]);
      
      doc.autoTable({
        startY: 35,
        head: [['Name', 'Username', 'Email', 'Phone', 'Registration Time']],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
        alternateRowStyles: { fillColor: [248, 250, 252] }
      });
      
      doc.save(`daily_users_${new Date().toISOString().split('T')[0]}.pdf`);
      alert('Daily report downloaded successfully!');
    } catch (error) {
      console.error('Error generating daily report:', error);
      alert('Failed to generate daily report');
    }
  };

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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  if (loading && !refreshing) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error && !users.length) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <UsersIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">Failed to load users</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <Button 
            onClick={() => fetchUsers(1, false, searchText, sortConfig, filters)}
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
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              searchText={searchText}
              onSearchChange={setSearchText}
              onSearchSubmit={handleSearchSubmit}
              onClear={handleSearchClear}
              loading={loading || refreshing}
            />
          </div>
          <div className="flex gap-2">
            <FilterPanel
              filters={filters}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-white/[0.05] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <UsersIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Users ({pagination.totalCount})
            </h2>
            {refreshing && (
              <span className="text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Syncing...
              </span>
            )}
            {error && users.length > 0 && (
              <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                Sync Error
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleDailyReport}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Daily Report
            </Button>

            <Button 
              onClick={handleExportExcel}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </Button>

            <Button 
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
            
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button 
              onClick={handleAddModal}
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </div>
        
        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
                >
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    User
                    {getSortIcon('name')}
                  </button>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
                >
                  <button
                    onClick={() => handleSort('username')}
                    className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Username
                    {getSortIcon('username')}
                  </button>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
                >
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Email
                    {getSortIcon('email')}
                  </button>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
                >
                  <button
                    onClick={() => handleSort('phoneNumber')}
                    className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Phone
                    {getSortIcon('phoneNumber')}
                  </button>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
                >
                  <button
                    onClick={() => handleSort('isActive')}
                    className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Status
                    {getSortIcon('isActive')}
                  </button>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
                >
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Joined Date
                    {getSortIcon('createdAt')}
                  </button>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-5 py-12 text-center">
                    <UsersIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                      {searchText ? 'No users found matching your search' : 'No users found'}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                      {searchText ? 'Try adjusting your search terms or filters' : 'Get started by adding your first user'}
                    </p>
                    {searchText || Object.values(filters).some(v => v !== '') ? (
                      <div className="flex gap-2 justify-center">
                        {searchText && (
                          <Button 
                            onClick={handleSearchClear}
                            variant="outline"
                            size="sm"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Clear Search
                          </Button>
                        )}
                        {Object.values(filters).some(v => v !== '') && (
                          <Button 
                            onClick={handleClearFilters}
                            variant="outline"
                            size="sm"
                          >
                            <Filter className="w-4 h-4 mr-2" />
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button 
                        onClick={handleAddModal}
                        variant="primary"
                        size="sm"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add First User
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((userData) => (
                  <TableRow 
                    key={userData._id} 
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* User Info */}
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex-shrink-0">
                          {userData.profileImage ? (
                            <>
                              <img
                                width={40}
                                height={40}
                                src={userData.profileImage}
                                alt={userData.name || 'User'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.querySelector('.fallback-initials').style.display = 'flex';
                                }}
                              />
                              <div className="fallback-initials hidden w-full h-full items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-semibold">
                                {getInitials(userData.name)}
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-semibold">
                              {getInitials(userData.name)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {userData.name || 'Unnamed User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {userData.bio || 'No bio'}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Username */}
                    <TableCell className="px-5 py-4">
                      <span className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                        {userData.username || 'N/A'}
                      </span>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="px-5 py-4">
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {userData.email || 'N/A'}
                      </span>
                    </TableCell>

                    {/* Phone Number */}
                    <TableCell className="px-5 py-4">
                      <span className="text-gray-700 dark:text-gray-300 text-sm font-mono">
                        {userData.phoneNumber || userData.phone || 'N/A'}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-5 py-4">
                      <Badge
                        size="sm"
                        color={userData.isActive ? "success" : "error"}
                      >
                        {userData.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell className="px-5 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          {formatDate(userData.createdAt)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(() => {
                            const diff = Date.now() - new Date(userData.createdAt).getTime();
                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            if (days === 0) return 'Today';
                            if (days === 1) return 'Yesterday';
                            if (days < 30) return `${days} days ago`;
                            const months = Math.floor(days / 30);
                            return `${months} month${months > 1 ? 's' : ''} ago`;
                          })()}
                        </p>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditModal(userData)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        
                        {(!userData.profileImage || !userData.name) && (
                          <button 
                            onClick={() => handleSendProfileRequest(userData._id, userData.email, userData.name)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-200 dark:hover:bg-blue-900/20 transition-colors"
                            title="Request profile completion"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 0 && (
          <div className="p-4 border-t border-gray-100 dark:border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Pagination Info and Size Selector */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {users.length > 0 ? (pagination.currentPage - 1) * pagination.limit + 1 : 0}
                </span>
                {' '}-{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)}
                </span>
                {' '}of{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {pagination.totalCount}
                </span>
                {' '}users
              </div>

              <PaginationSizeSelector
                pageSize={pagination.limit}
                onPageSizeChange={handlePageSizeChange}
                disabled={loading}
              />
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev || loading}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center gap-1">
                          {showEllipsis && (
                            <span className="px-2 text-gray-400 dark:text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            disabled={loading}
                            className={`
                              min-w-[32px] h-8 px-2 rounded text-sm font-medium transition-colors
                              ${page === pagination.currentPage
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }
                              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <Button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext || loading}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <AddUser 
        isOpen={isOpen} 
        closeModal={closeModal} 
        user={user} 
        fetchUsers={() => fetchUsers(pagination.currentPage, false, searchText, sortConfig, filters)} 
      />
    </div>
  );
};

export default Users;