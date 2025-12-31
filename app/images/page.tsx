"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FolderPlus, Share2, Folder, Image as ImageIcon, X, Trash2, Link2 } from "lucide-react";

interface ImageItem {
  id: string;
  name: string;
  url: string;
  folderId?: string;
}

interface Folder {
  id: string;
  name: string;
}

const STORAGE_KEY_IMAGES = "little-joys-images";
const STORAGE_KEY_FOLDERS = "little-joys-folders";

export default function ImagesPage() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedImages = localStorage.getItem(STORAGE_KEY_IMAGES);
      const savedFolders = localStorage.getItem(STORAGE_KEY_FOLDERS);
      if (savedImages) setItems(JSON.parse(savedImages));
      if (savedFolders) setFolders(JSON.parse(savedFolders));
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save images to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save images - storage may be full", e);
      }
    }
  }, [items, isLoaded]);

  // Save folders to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
    }
  }, [folders, isLoaded]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [shareModal, setShareModal] = useState<{ type: "item" | "folder"; id: string } | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newItem: ImageItem = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          url: event.target?.result as string,
          folderId: currentFolder || undefined,
        };
        setItems(prev => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });
    setShowUpload(false);
  };

  const convertGoogleDriveUrl = (url: string): string => {
    // Convert Google Drive sharing links to direct image URLs
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch) {
      return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }
    const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
    if (openMatch) {
      return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
    }
    return url;
  };

  const addFromUrl = () => {
    if (!newImageUrl.trim()) return;
    const finalUrl = convertGoogleDriveUrl(newImageUrl.trim());
    const newItem: ImageItem = {
      id: Date.now().toString() + Math.random(),
      name: "Image from URL",
      url: finalUrl,
      folderId: currentFolder || undefined,
    };
    setItems(prev => [...prev, newItem]);
    setNewImageUrl("");
    setShowUrlModal(false);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
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
  const currentFolders = folders.filter((f) => !currentFolder);

  const handleShare = (type: "item" | "folder", id: string) => {
    setShareModal({ type, id });
    const shareUrl = `${window.location.origin}/images/${id}`;
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
          className="inline-flex items-center text-turquoise-950 hover:text-turquoise-950 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-turquoise-950 mb-2">Images</h1>
              {currentFolder && (
                <button
                  onClick={() => setCurrentFolder(null)}
                  className="text-sm text-turquoise-900 hover:text-turquoise-950"
                >
                  ← Back to all images
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
                onClick={() => setShowUrlModal(true)}
                className="flex items-center gap-2 bg-turquoise-100 text-turquoise-950 px-4 py-2 rounded-lg hover:bg-turquoise-200 transition-colors"
              >
                <Link2 className="w-5 h-5" />
                URL
              </button>
              <label className="flex items-center gap-2 bg-turquoise-600 text-white px-4 py-2 rounded-lg hover:bg-turquoise-700 transition-colors cursor-pointer">
                <Upload className="w-5 h-5" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-gray-100 rounded-xl overflow-hidden aspect-square"
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleShare("item", item.id)}
                      className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-2 hover:bg-turquoise-50 transition-opacity"
                    >
                      <Share2 className="w-5 h-5 text-turquoise-900" />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-2 hover:bg-red-50 transition-opacity"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ImageIcon className="w-16 h-16 text-turquoise-300 mx-auto mb-4" />
              <p className="text-turquoise-900">No images yet. Upload some to get started!</p>
            </div>
          )}
        </div>
      </div>

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

      {showUrlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-turquoise-950 mb-4">Add from URL</h3>
            <p className="text-sm text-turquoise-900 mb-4">
              Paste an image URL or Google Drive sharing link
            </p>
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-turquoise-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500 mb-4"
              onKeyPress={(e) => e.key === "Enter" && addFromUrl()}
            />
            <div className="flex gap-3">
              <button
                onClick={addFromUrl}
                className="flex-1 bg-turquoise-600 text-white px-4 py-2 rounded-lg hover:bg-turquoise-700"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowUrlModal(false);
                  setNewImageUrl("");
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

