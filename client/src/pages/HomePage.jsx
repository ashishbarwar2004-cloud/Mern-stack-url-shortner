import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import Spinner from '../components/Spinner';

const HomePage = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateUrl = () => {
    const errors = {};
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
      'i'
    );

    if (!longUrl || !longUrl.trim()) {
      errors.longUrl = 'URL field cannot be empty.';
    } else if (!urlPattern.test(longUrl.trim())) {
      errors.longUrl = 'Please enter a valid URL (e.g., https://example.com).';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCopied(false);
    setServerError('');
    setShortUrl(null);

    const validationErrors = validateUrl();
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiService.shortenUrl({ longUrl: longUrl.trim() });
      setShortUrl(data.shortUrl || `${window.location.origin}/${data.urlCode || ''}`);
    } catch (err) {
      setServerError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortUrl) {
      try {
        await navigator.clipboard.writeText(shortUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-6">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
        URL Shortener
      </h1>
      <p className="text-slate-600 mb-8">
        Enter a long URL to make it short, neat, and easy to share!
      </p>

      <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="https://example.com"
              value={longUrl}
              onChange={(e) => {
                setLongUrl(e.target.value);
                if (formErrors.longUrl) {
                  setFormErrors({});
                }
              }}
              disabled={isLoading}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                formErrors.longUrl ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.longUrl && (
              <p className="text-red-500 text-sm text-left mt-1">{formErrors.longUrl}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors cursor-pointer flex justify-center items-center min-w-[110px] disabled:opacity-50"
          >
            {isLoading ? <Spinner size="small" /> : 'Shorten'}
          </button>
        </form>

        {serverError && <p className="mt-4 text-red-500 text-sm">{serverError}</p>}

        {shortUrl && (
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-md flex flex-col sm:flex-row justify-between items-center gap-3">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-mono text-base font-semibold hover:underline truncate max-w-xs sm:max-w-md"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm rounded-md transition-colors cursor-pointer shrink-0"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;