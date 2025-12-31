"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, FolderPlus, Share2, Folder, Film, X, Star, Trash2 } from "lucide-react";

interface MovieItem {
  id: string;
  title: string;
  year?: string;
  director?: string;
  rating?: number;
  notes?: string;
  folderId?: string;
}

interface FolderType {
  id: string;
  name: string;
}

const STORAGE_KEY_MOVIES = "little-joys-movies";
const STORAGE_KEY_FOLDERS = "little-joys-movies-folders";

export default function MoviesPage() {
  const [items, setItems] = useState<MovieItem[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newItem, setNewItem] = useState({ title: "", year: "", director: "", rating: 0, notes: "" });
  const [shareModal, setShareModal] = useState<{ type: "item" | "folder"; id: string } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY_MOVIES);
      const savedFolders = localStorage.getItem(STORAGE_KEY_FOLDERS);
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedFolders) setFolders(JSON.parse(savedFolders));
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_MOVIES, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
    }
  }, [folders, isLoaded]);

  const addItem = () => {
    if (!newItem.title.trim()) return;
    const item: MovieItem = {
      id: Date.now().toString(),
      title: newItem.title,
      year: newItem.year || undefined,
      director: newItem.director || undefined,
      rating: newItem.rating || undefined,
      notes: newItem.notes || undefined,
      folderId: currentFolder || undefined,
    };
    setItems(prev => [...prev, item]);
    setNewItem({ title: "", year: "", director: "", rating: 0, notes: "" });
    setShowAddModal(false);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: FolderType = {
      id: Date.now().toString(),
      name: newFolderName,
    };
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName("");
    setShowFolderModal(false);
  };

  const currentItems = items.filter((item) => 
    currentFolder ? item.folderId === currentFolder : !item.folderId
  );
  const currentFolders = folders.filter(() => !currentFolder);

  const handleShare = (type: "item" | "folder", id: string) => {
    setShareModal({ type, id });
    const shareUrl = `${window.location.origin}/movies/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setTimeout(() => setShareModal(null), 2000);
  };

  const deleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const deleteFolder = (id: string) => {
    if (window.confirm("Are you sure you want to delete this folder and all its contents?")) {
      setFolders(prev => prev.filter(folder => folder.id !== id));
      setItems(prev => prev.filter(item => item.folderId !== id));
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-turquoise-950 hover:text-turquoise-950 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-turquoise-950 mb-2">Movies</h1>
              {currentFolder && (
                <button
                  onClick={() => setCurrentFolder(null)}
                  className="text-sm text-turquoise-900 hover:text-turquoise-950"
                >
                  ← Back to all movies
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFolderModal(true)}
                className="flex items-center gap-2 bg-turquoise-100 text-turquoise-950 px-4 py-2 rounded-lg hover:bg-turquoise-200 transition-colors"
              >
                <FolderPlus className="w-5 h-5" />
                New Folder
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-turquoise-600 text-white px-4 py-2 rounded-lg hover:bg-turquoise-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Movie
              </button>
            </div>
          </div>

          {currentFolders.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {currentFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="group relative bg-turquoise-50 rounded-xl p-4 hover:bg-turquoise-100 transition-colors cursor-pointer"
                  onClick={() => setCurrentFolder(folder.id)}
                >
                  <Folder className="w-12 h-12 text-turquoise-900 mx-auto mb-2" />
                  <p className="text-center text-sm font-medium text-turquoise-950 truncate">
                    {folder.name}
                  </p>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare("folder", folder.id);
                      }}
                      className="p-1 bg-white rounded hover:bg-turquoise-50"
                    >
                      <Share2 className="w-4 h-4 text-turquoise-900" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder.id);
                      }}
                      className="p-1 bg-white rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-gradient-to-br from-turquoise-50 to-turquoise-100 rounded-xl p-6 border-2 border-turquoise-200 hover:border-turquoise-300 transition-all"
                >
                  <Film className="w-8 h-8 text-turquoise-400 mb-4" />
                  <h3 className="text-xl font-bold text-turquoise-950 mb-2">
                    {item.title}
                    {item.year && <span className="font-normal text-turquoise-900"> ({item.year})</span>}
                  </h3>
                  {item.director && (
                    <p className="text-sm text-turquoise-950 mb-2">
                      Directed by {item.director}
                    </p>
                  )}
                  {item.rating && item.rating > 0 && (
                    <div className="mb-2">
                      {renderStars(item.rating)}
                    </div>
                  )}
                  {item.notes && (
                    <p className="text-turquoise-900 mt-3 text-sm">
                      {item.notes}
                    </p>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleShare("item", item.id)}
                      className="bg-white rounded-full p-2 hover:bg-turquoise-50"
                    >
                      <Share2 className="w-4 h-4 text-turquoise-900" />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="bg-white rounded-full p-2 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Film className="w-16 h-16 text-turquoise-300 mx-auto mb-4" />
              <p className="text-turquoise-900">No movies yet. Add some to get started!</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-turquoise-950 mb-4">Add Movie</h3>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="Title"
              className="w-full px-4 py-2 border border-turquoise-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500 mb-4"
            />
            <input
              type="text"
              value={newItem.year}
              onChange={(e) => setNewItem({ ...newItem, year: e.target.value })}
              placeholder="Year (optional)"
              className="w-full px-4 py-2 border border-turquoise-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500 mb-4"
            />
            <input
              type="text"
              value={newItem.director}
              onChange={(e) => setNewItem({ ...newItem, director: e.target.value })}
              placeholder="Director (optional)"
              className="w-full px-4 py-2 border border-turquoise-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500 mb-4"
            />
            <div className="mb-4">
              <label className="block text-sm text-turquoise-950 mb-2">Rating (optional)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewItem({ ...newItem, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= newItem.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} hover:text-yellow-400`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={newItem.notes}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              placeholder="Notes (optional)"
              className="w-full px-4 py-2 border border-turquoise-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500 mb-4 min-h-[80px]"
            />
            <div className="flex gap-3">
              <button
                onClick={addItem}
                className="flex-1 bg-turquoise-600 text-white px-4 py-2 rounded-lg hover:bg-turquoise-700"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewItem({ title: "", year: "", director: "", rating: 0, notes: "" });
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-turquoise-950 mb-4">Create Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-4 py-2 border border-turquoise-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500 mb-4"
              onKeyPress={(e) => e.key === "Enter" && createFolder()}
            />
            <div className="flex gap-3">
              <button
                onClick={createFolder}
                className="flex-1 bg-turquoise-600 text-white px-4 py-2 rounded-lg hover:bg-turquoise-700"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowFolderModal(false);
                  setNewFolderName("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {shareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-turquoise-950">Shared!</h3>
              <button onClick={() => setShareModal(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-turquoise-900">Link copied to clipboard!</p>
          </div>
        </div>
      )}
    </div>
  );
}

