const statusConfig = {
  new:     { label: "New",     classes: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  read:    { label: "Read",    classes: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
  replied: { label: "Replied", classes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  closed:  { label: "Closed",  classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  true:    { label: "Active",  classes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  false:   { label: "Inactive",classes: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  published: { label: "Published", classes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  draft:   { label: "Draft",   classes: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
};

export default function StatusBadge({ status }) {
  const key = String(status);
  const config = statusConfig[key] || { label: key, classes: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
}
