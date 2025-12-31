"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, FolderPlus, Share2, Folder, BookOpen, X } from "lucide-react";

interface PoemItem {
  id: string;
  title: string;
  content: string;
  author?: string;
  folderId?: string;
}

interface Folder {
  id: string;
  name: string;
}

export default function PoemsPage() {
  const [items, setItems] = useState<PoemItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newPoem, setNewPoem] = useState({ title: "", content: "", author: "" });
  const [shareModal, setShareModal] = useState<{ type: "item" | "folder"; id: string } | null>(null);

  const addPoem = () => {
    if (!newPoem.title.trim() || !newPoem.content.trim()) return;
    const newItem: PoemItem = {
      id: Date.now().toString(),
      title: newPoem.title,
      content: newPoem.content,
      author: newPoem.author || undefined,
      folderId: currentFolder || undefined,
    };
    setItems([...items, newItem]);
    setNewPoem({ title: "", content: "", author: "" });
    setShowAddModal(false);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName,
    };
    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setShowFolderModal(false);
  };

  const currentItems = items.filter((item) => 
    currentFolder ? item.folderId === currentFolder : !item.folderId
  );
  const currentFolders = folders.filter((f) => !currentFolder);

  const handleShare = (type: "item" | "folder", id: string) => {
    setShareModal({ type, id });
    const shareUrl = `${window.location.origin}/poems/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setTimeout(() => setShareModal(null), 2000);
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
              <h1 className="text-4xl font-bold text-turquoise-800 mb-2">Poems</h1>
              {currentFolder && (
                <button
                  onClick={() => setCurrentFolder(null)}
                  className="text-sm text-turquoise-600 hover:text-turquoise-700"
                >
                  ← Back to all poems
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
                Add Poem
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare("folder", folder.id);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-white rounded hover:bg-turquoise-50 transition-opacity"
                  >
                    <Share2 className="w-4 h-4 text-turquoise-600" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-gradient-to-br from-turquoise-50 to-turquoise-100 rounded-xl p-6 border-2 border-turquoise-200 hover:border-turquoise-300 transition-all"
                >
                  <BookOpen className="w-6 h-6 text-turquoise-400 mb-3" />
                  <h3 className="text-xl font-bold text-turquoise-800 mb-3">
                    {item.title}
                  </h3>
                  <div className="text-turquoise-900 whitespace-pre-line mb-4">
                    {item.content}
                  </div>
                  {item.author && (
                    <p className="text-sm text-turquoise-700 font-medium">
                      — {item.author}
                    </p>
                  )}
                  <button
                    onClick={() => handleShare("item", item.id)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 bg-white rounded-full p-2 hover:bg-turquoise-50 transition-opacity"
                  >
                    <Share2 className="w-4 h-4 text-turquoise-600" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-turquoise-300 mx-auto mb-4" />
              <p className="text-turquoise-600">No poems yet. Add some to get started!</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-turquoise-800 mb-4">Add Poem</h3>
            <input
              type="text"
              value={newPoem.title}
              onChange={(e) => setNewPoem({ ...newPoem, title: e.target.value })}
              placeholder="Title"
              className="w-full px-4 py-2 border border-turquoise-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500 mb-4"
            />
            <textarea
              value={newPoem.content}
              onChange={(e) => setNewPoem({ ...newPoem, content: e.target.value })}
              placeholder="Poem content"
              className="w-full px-4 py-2 border border-turquoise-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500 mb-4 min-h-[150px]"
            />
            <input
              type="text"
              value={newPoem.author}
              onChange={(e) => setNewPoem({ ...newPoem, author: e.target.value })}
              placeholder="Author (optional)"
              className="w-full px-4 py-2 border border-turquoise-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={addPoem}
                className="flex-1 bg-turquoise-600 text-white px-4 py-2 rounded-lg hover:bg-turquoise-700"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewPoem({ title: "", content: "", author: "" });
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

