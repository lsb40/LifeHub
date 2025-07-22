import React, { useState } from "react";

export default function Journal({
  journalEntries,
  setJournalEntries,
  journalDate,
  setJournalDate,
  journalText,
  setJournalText,
}) {
  const addEntry = () => {
    if (!journalDate || !journalText.trim()) {
      alert("Please enter both date and journal text");
      return;
    }
    setJournalEntries((prev) => [
      ...prev,
      { date: journalDate, text: journalText.trim() },
    ]);
    alert("Journal entry added");
    setJournalDate("");
    setJournalText("");
  };

  const deleteEntry = (idx) => {
    if (window.confirm("Delete this entry?")) {
      setJournalEntries((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <h2>Journal</h2>

      <div className="input-row" style={{ flexWrap: "wrap", gap: 10 }}>
        <label>
          Date:
          <input
            type="date"
            value={journalDate}
            onChange={(e) => setJournalDate(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <textarea
          rows={6}
          cols={40}
          placeholder="Write your journal entry here..."
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
        />
      </div>

      <button onClick={addEntry} style={{ marginTop: 10 }}>
        Add Entry
      </button>

      <div style={{ marginTop: 30 }}>
        <h3>Total Entries: {journalEntries.length}</h3>
        {journalEntries.length === 0 && <div>No journal entries yet</div>}

        {journalEntries
          .slice()
          .sort((a, b) => (a.date < b.date ? 1 : -1))
          .map(({ date, text }, idx) => (
            <div key={idx} className="dashboard-entry" style={{ position: "relative" }}>
              <strong>{formatDate(date)}</strong> -{" "}
              {text.length > 100 ? text.slice(0, 100) + "..." : text}
              <button
                onClick={() => deleteEntry(idx)}
                style={{
                  position: "absolute",
                  right: 5,
                  top: 5,
                  background: "transparent",
                  border: "none",
                  color: "red",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                title="Delete entry"
              >
                ×
              </button>
            </div>
          ))}
      </div>
    </>
  );
}
