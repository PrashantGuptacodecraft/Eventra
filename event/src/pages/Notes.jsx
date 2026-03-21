import { useEffect, useState } from "react"
import { getData, saveData, makeId } from "../utils/storage"

function Notes() {
  const [notes, setNotes] = useState([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const data = getData("notes") || []
    setNotes([data])
  }, [])

  // Save Note
  const handleSave = (title, content) => {
    const newNote = {
      id: makeId(),
      title,
      content
    }

    const updated = [...notes, newNote]
    setNotes(updated)
    saveData("notes", updated)

    setShowForm(false)
  }

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>📝 My Notes</h2>
          <small className="text-muted">{notes.length} notes</small>
        </div>

        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + New Note
          </button>
        )}

        {showForm && (
          <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
            ✖ Cancel
          </button>
        )}
      </div>

      {/* FORM VIEW */}
      {showForm ? (
        <NoteForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      ) : (
        /* NOTES LIST */
        <div className="row">
          {notes.length === 0 ? (
            <div className="text-center mt-5">
              <div style={{ fontSize: "50px" }}>📝</div>
              <h5>No notes yet</h5>
              <p className="text-muted">
                Click "+ New Note" to create your first note.
              </p>
            </div>
          ) : (
            notes.map(note => (
              <div className="col-md-4 mb-3" key={note.id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5>{note.title}</h5>
                    <p>{note.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  )
}

export default Notes
