import { useEffect, useState } from "react";
import { searchUsers } from "../../services/users.services";
import type { Models } from "appwrite";
import { Link } from "react-router-dom";

interface Props {
  onClose: () => void;
}

interface UserProfile extends Models.Document {
  userId: string;
  username: string;
  name: string;
  profileImg?: string;
}

export default function SearchProfile({ onClose }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        setLoading(true);
        searchUsers(searchTerm)
          .then((users) => setResults(users ?? []))
          .finally(() => setLoading(false));
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <>
      <div className="md:hidden fixed inset-0 bottom-16 bg-white/90 dark:bg-black/90 z-40 p-4 backdrop-blur-md overflow-auto">
        <div className="max-w-lg mx-auto bg-white dark:bg-dark-bg rounded-xl shadow-lg p-4 mt-4">
          <button
            onClick={onClose}
            className="text-sm mb-4 text-right w-full text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary"
          >
            Close ✕
          </button>

          <p className="text-lg font-bold mb-2 text-light-text dark:text-dark-text">
            Search Users
          </p>

          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-400 bg-white dark:bg-dark-card text-light-text dark:text-dark-text"
          />

          {loading && (
            <p className="text-sm text-gray-500 mt-2">Searching...</p>
          )}

          {!loading && results.length > 0 && (
            <ul className="mt-4 space-y-3">
              {results.map((user) => (
                <Link to={`/profile/${user.userId}`} key={user.$id}>
                  <li
                    onClick={onClose}
                    key={user.$id}
                    className="p-3 rounded-xl shadow-md bg-light-card dark:bg-dark-card flex items-center gap-3"
                  >
                    {user.profileImg ? (
                      <img
                        src={user.profileImg}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-light-text dark:text-dark-text">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.name}
                      </p>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          )}

          {!loading && searchTerm && results.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              No users found.
            </p>
          )}
        </div>
      </div>

      <div className="hidden md:block fixed top-0 left-60 right-0 bottom-0 bg-white/90 dark:bg-black/90 z-40 backdrop-blur-md overflow-auto">
        <div className="max-w-md mx-auto bg-white dark:bg-dark-bg rounded-xl shadow-lg p-6 mt-8 ml-8">
          <button
            onClick={onClose}
            className="text-sm mb-4 text-right w-full text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary"
          >
            Close ✕
          </button>

          <p className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">
            Search Users
          </p>

          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-400 bg-white dark:bg-dark-card text-light-text dark:text-dark-text"
          />

          {loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Searching...
            </p>
          )}

          {!loading && results.length > 0 && (
            <ul className="mt-6 space-y-3 max-h-96 overflow-y-auto">
              {results.map((user) => (
                <Link to={`/profile/${user.userId}`} key={user.$id}>
                  <li
                    onClick={onClose}
                    key={user.$id}
                    className="p-4 rounded-xl shadow-md bg-light-card dark:bg-dark-card flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    {user.profileImg ? (
                      <img
                        src={user.profileImg}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 text-lg font-semibold">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-light-text dark:text-dark-text">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.name}
                      </p>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          )}

          {!loading && searchTerm && results.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
              No users found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
