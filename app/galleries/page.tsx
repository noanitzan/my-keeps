"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, FolderPlus, Share2, Folder, Palette, X, Trash2 } from "lucide-react";

interface GalleryItem {
  id: string;
  name: string;
  location?: string;
  date?: string;
  notes?: string;
  folderId?: string;
}

interface FolderType {
  id: string;
  name: string;
}

const STORAGE_KEY_GALLERIES = "little-joys-galleries";
const STORAGE_KEY_FOLDERS = "little-joys-galleries-folders";

export default function GalleriesPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newItem, setNewItem] = useState({ name: "", location: "", date: "", notes: "" });
  const [shareModal, setShareModal] = useState<{ type: "item" | "folder"; id: string } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY_GALLERIES);
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
      localStorage.setItem(STORAGE_KEY_GALLERIES, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
    }
  }, [folders, isLoaded]);

  const addItem = () => {
    if (!newItem.name.trim()) return;
    const item: GalleryItem = {
      id: Date.now().toString(),
      name: newItem.name,
      location: newItem.location || undefined,
      date: newItem.date || undefined,
      notes: newItem.notes || undefined,
      folderId: currentFolder || undefined,
    };
    setItems(prev => [...prev, item]);
    setNewItem({ name: "", location: "", date: "", notes: "" });
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
    const shareUrl = `${window.location.origin}/galleries/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setTimeout(() => setShareModal(null), 2000);
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== id));
    setItems(prev => prev.filter(item => item.folderId !== id));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-turquoise-700 hover:text-turquoise-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-turquoise-800 mb-2">Galleries & Exhibitions</h1>
              {currentFolder && (
                <button
                  onClick={() => setCurrentFolder(null)}
                  className="text-sm text-turquoise-600 hover:text-turquoise-700"
                >
                  ← Back to all
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFolderModal(true)}
                className="flex items-center gap-2 bg-turquoise-100 text-turquoise-700 px-4 py-2 rounded-lg hover:bg-turquoise-200 transition-colors"
              >
                <FolderPlus className="w-5 h-5" />
                New Folder
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-turquoise-600 text-white px-4 py-2 rounded-lg hover:bg-turquoise-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Entry
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
                  <Folder className="w-12 h-12 text-turquoise-600 mx-auto mb-2" />
                  <p className="text-center text-sm font-medium text-turquoise-800 truncate">
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
                      <Share2 className="w-4 h-4 text-turquoise-600" />
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
                  <Palette className="w-8 h-8 text-turquoise-400 mb-4" />
                  <h3 className="text-xl font-bold text-turquoise-800 mb-2">
                    {item.name}
                  </h3>
                  {item.location && (
                    <p className="text-sm text-turquoise-700 mb-1">
                      📍 {item.location}
                    </p>
                  )}
                  {item.date && (
                    <p className="text-sm text-turquoise-700 mb-1">
                      📅 {item.date}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-turquoise-600 mt-3 text-sm">
                      {item.notes}
                    </p>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleShare("item", item.id)}
                      className="bg-white rounded-full p-2 hover:bg-turquoise-50"
                    >
                      <Share2 className="w-4 h-4 text-turquoise-600" />
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
              <Palette className="w-16 h-16 text-turquoise-300 mx-auto mb-4" />
              <p className="text-turquoise-600">No galleries or exhibitions yet. Add some to get started!</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-turquoise-800 mb-4">Add Gallery/Exhibition</h3>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Name"
              className="w-full px-4 py-2 border border-turquoise-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500 mb-4"
            />
            <input
              type="text"
              value={newItem.location}
              onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
              placeholder="Location (optional)"
              className="w-full px-4 py-2 border border-turquoise-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500 mb-4"
            />
            <input
              type="text"
              value={newItem.date}
              onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
              placeholder="Date (optional)"
              className="w-full px-4 py-2 border border-turquoise-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500 mb-4"
            />
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
                  setNewItem({ name: "", location: "", date: "", notes: "" });
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
            <h3 className="text-2xl font-bold text-turquoise-800 mb-4">Create Folder</h3>
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
              <h3 className="text-xl font-bold text-turquoise-800">Shared!</h3>
              <button onClick={() => setShareModal(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-turquoise-600">Link copied to clipboard!</p>
          </div>
        </div>
      )}
    </div>
  );
}

