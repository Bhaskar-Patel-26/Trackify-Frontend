import { Bell, CircleUserRound, LogOut, User, UserRoundPen, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../../api/users";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEditUserModalOpen, setIseditUserModalOpen] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedEmail, setEditedEmail] = useState(user?.email || "");

  const openEditUserModal = () => setIseditUserModalOpen(true);
  const closeEditUserModal = () => setIseditUserModalOpen(false);

  const { mutate: updateUserMutation } = useMutation({
    mutationFn: updateUser(user.id, { name: editedName, email: editedEmail }),
    onSuccess: () => {
      user.name = editedName;
      user.email = editedEmail;
    },
  })

  const handleEditUser = (e) => {
    e.preventDefault();
    updateUserMutation();
    closeEditUserModal();
    logout();
    toast.success("Profile updated successfully! Please log in again.");
  }

  return (
    <header className="flex justify-between items-center px-6 py-3 border-b border-[#2A2A31] bg-[#18171D] shadow-sm">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-300 hover:text-white mr-4">
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-xl font-semibold text-white">Dashboard</div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-5">
        {/* Notification Bell */}
        <button className="relative hover:opacity-80 transition">
          <Bell className="w-5 h-5 text-gray-300" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
            1
          </span>
        </button>

        {/* Avatar */}
        <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="cursor-pointer">
          <CircleUserRound className="w-5 h-5" />
        </button>

        {/* User Menu */}
        <div className={isUserMenuOpen ? "relative" : "relative hidden"}>
          <div className="absolute bg-gray-800 text-white w-50 h-auto top-5 right-5 p-4 rounded shadow-lg group-hover:block">
            {/* User Info */}
            <div className="flex items-center space-x-2 pb-2 cursor-pointer">
              <User className="w-5 h-5 text-gray-300" />
              <span className="text-gray-200 font-medium">
                {user?.name}
              </span>
            </div>
            
            {/* Logout Button */}
            <button onClick={openEditUserModal} className="flex items-center space-x-2 text-gray-300 hover:text-red-500 transition pb-2 cursor-pointer">
              <UserRoundPen className="w-5 h-5"/>
              <span className="text-gray-200 font-medium">Edit Profile</span>
            </button>
            
            {/* Logout Button */}
            <button onClick={logout} className="flex items-center space-x-2 text-gray-300 hover:text-red-500 transition pb-2 cursor-pointer">
              <LogOut className="w-5 h-5" />
              <span className="text-gray-200 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditUserModalOpen} onClose={closeEditUserModal} title="Edit Profile">
        <form onSubmit={handleEditUser}>
          <div className="mb-4">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-1">
              User Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              required
              className="w-full bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="text"
              id="userEmail"
              name="userEmail"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              required
              className="w-full bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={closeEditUserModal} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer">
              Update Member
            </button>
          </div>
        </form>
      </Modal>
    </header>
  );
};

export default Navbar;
