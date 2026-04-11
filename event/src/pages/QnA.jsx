import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const QnA = () => {
  const { user, users, qna, setQna, showToast, addPoints } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [answeringQuestion, setAnsweringQuestion] = useState(null);
  const [answerContent, setAnswerContent] = useState("");
  const askedByUser = qna.filter((question) => question.userId === user.id).length;
  const answersByUser = qna.reduce(
    (count, question) =>
      count + question.answers.filter((answer) => answer.userId === user.id).length,
    0,
  );
  const sectionCoins = askedByUser * 3 + answersByUser * 5;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    const newQuestion = {
      id: Date.now(),
      userId: user.id,
      title: formData.title,
      content: formData.content,
      answers: [],
    };
    setQna([...qna, newQuestion]);
    showToast("Question posted", "success");
    addPoints(3);
    setShowForm(false);
    setFormData({ title: "", content: "" });
  };

  const handleSubmitAnswer = (questionId) => {
    if (!answerContent.trim()) return;
    const updated = qna.map((q) =>
      q.id === questionId
        ? {
            ...q,
            answers: [
              ...q.answers,
              {
                id: Date.now(),
                userId: user.id,
                content: answerContent,
                upvotes: 0,
                upvotedBy: [],
              },
            ],
          }
        : q,
    );
    setQna(updated);
    showToast("Answer posted", "success");
    addPoints(5);
    setAnsweringQuestion(null);
    setAnswerContent("");
  };

  const handleUpvote = (questionId, answerId) => {
    const question = qna.find((q) => q.id === questionId);
    const answer = question?.answers.find((a) => a.id === answerId);

    if (answer?.upvotedBy?.includes(user.id)) {
      showToast("You already upvoted this answer", "info");
      return;
    }

    const updated = qna.map((q) =>
      q.id === questionId
        ? {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId
                ? {
                    ...a,
                    upvotes: a.upvotes + 1,
                    upvotedBy: [...(a.upvotedBy || []), user.id],
                  }
                : a,
            ),
          }
        : q,
    );
    setQna(updated);
    showToast("Upvoted", "success");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Q&A Forum</h1>
          <p className="text-sm text-gray-600 mt-1">
            Coins earned in this section: {sectionCoins}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
        >
          Ask Question
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-3">Ask a Question</h2>
            <form onSubmit={handleSubmitQuestion} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ title: "", content: "" });
                  }}
                  className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {qna.map((question) => (
          <div
            key={question.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {question.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{question.content}</p>
                <div className="text-xs text-gray-500">
                  Asked by {" "}
                  {users.find((u) => u.id === question.userId)?.name || "Unknown"}
                </div>
              </div>
              <button
                onClick={() =>
                  setAnsweringQuestion(
                    answeringQuestion === question.id ? null : question.id,
                  )
                }
                className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {answeringQuestion === question.id ? "Cancel" : "Answer"}
              </button>
            </div>

            {answeringQuestion === question.id && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Write your answer..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleSubmitAnswer(question.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            )}

            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-700 text-sm">
                  Answers ({question.answers.length})
                </h4>
              </div>

              <div className="space-y-2">
                {question.answers.map((answer) => {
                  const alreadyUpvoted = answer.upvotedBy?.includes(user.id);

                  return (
                    <div
                      key={answer.id}
                      className="bg-gray-50 rounded-md p-3 border-l-2 border-blue-200"
                    >
                      <p className="text-gray-700 text-sm mb-2">
                        {answer.content}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          By {" "}
                          {users.find((u) => u.id === answer.userId)?.name ||
                            "Unknown"}
                        </span>
                        <button
                          onClick={() => handleUpvote(question.id, answer.id)}
                          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-xs"
                          disabled={alreadyUpvoted}
                        >
                          👍 {answer.upvotes}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {question.answers.length === 0 && (
                  <p className="text-gray-400 text-sm italic text-center py-2">
                    No answers yet
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {qna.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">?</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              No questions yet
            </h3>
            <p className="text-gray-600 text-sm">
              Be the first to ask a question!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QnA;
