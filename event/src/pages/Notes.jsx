import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const Notes = () => {
  const { user, notes, setNotes, showToast, addPoints } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const userNotes = notes.filter((note) => note.userId === user.id);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingNote) {
      // Edit
      const updated = notes.map((note) =>
        note.id === editingNote.id ? { ...note, ...formData } : note,
      );
      setNotes(updated);
      showToast("Note updated", "success");
    } else {
      // Add
      const newNote = {
        id: Date.now(),
        userId: user.id,
        ...formData,
      };
      setNotes([...notes, newNote]);
      showToast("Note added", "success");
      addPoints(2); // Points for creating note
    }
    setShowForm(false);
    setEditingNote(null);
    setFormData({ title: "", content: "" });
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
    });
    setShowForm(true);
  };

  const handleDelete = (noteId) => {
    if (window.confirm("Delete this note?")) {
      setNotes(notes.filter((note) => note.id !== noteId));
      showToast("Note deleted", "success");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📝 My Notes</h1>
          <p className="text-gray-600">{userNotes.length} notes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Note
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingNote ? "Edit Note" : "Add Note"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingNote ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingNote(null);
                    setFormData({ title: "", content: "" });
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {note.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(note)}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {userNotes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-600">
              Click "+ New Note" to create your first note.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
