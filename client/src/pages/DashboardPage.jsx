import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserLinks } from '../services/linkService';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const DashboardPage = () => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        const data = await getUserLinks();
        setLinks(Array.isArray(data) ? data : data.links || []);
      } catch (err) {
        setError(err.message || 'Could not load your links.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleCopy = async (shortUrl, linkId) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedLinkId(linkId);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">My Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Here are all the links you have created.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors cursor-pointer"
          >
            + New Link
          </Link>
          <button
            onClick={handleLogout}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-md font-semibold text-sm transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Spinner size="medium" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <p>Error: {error}</p>
            <p className="text-xs text-slate-400 mt-1">Make sure backend server is running on port 5000</p>
          </div>
        ) : links.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-700 text-sm">Original URL</th>
                <th className="p-4 font-semibold text-slate-700 text-sm">Short URL</th>
                <th className="p-4 font-semibold text-slate-700 text-sm text-center">Clicks</th>
                <th className="p-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => {
                const linkId = link._id || link.urlCode;
                return (
                  <tr key={linkId} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="p-4 max-w-xs truncate text-slate-700 text-sm">
                      <a href={link.longUrl} title={link.longUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {link.longUrl}
                      </a>
                    </td>
                    <td className="p-4">
                      <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-mono text-sm hover:underline">
                        {link.shortUrl}
                      </a>
                    </td>
                    <td className="p-4 text-center font-semibold text-slate-700 text-sm">{link.clicks || 0}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleCopy(link.shortUrl, linkId)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded-md transition-colors cursor-pointer"
                      >
                        {copiedLinkId === linkId ? 'Copied!' : 'Copy'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <p>You haven't created any links yet.</p>
            <Link to="/" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Go to the homepage to create your first link!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;