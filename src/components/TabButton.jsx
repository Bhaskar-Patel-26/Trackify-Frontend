const TabButton = ({ tabName, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tabName)}
    className={`px-4 py-2 rounded-md transition cursor-pointer ${
      activeTab === tabName
        ? "bg-blue-600 text-white"
        : "bg-[#1C1F25] text-gray-400 hover:bg-gray-700"
    }`}
  >
    {tabName}
  </button>
);

export default TabButton;
