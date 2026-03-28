import React, { useState, useEffect } from "react";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  questions: QuizQuestion[];
  generatedAt: string;
  documentCount: number;
}

export default function QuizPanel() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  async function generateQuiz() {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz/weekly");
      const data = await res.json();
      setQuiz(data);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setScore(0);
    } catch (error) {
      console.error("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  }

  function handleAnswerSelect(idx: number) {
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === quiz?.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  }

  if (!quiz) {
    return (
      <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 text-center">
        <button
          onClick={generateQuiz}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition inline-flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Generate Weekly Quiz
        </button>
      </div>
    );
  }

  const q = quiz.questions[currentQuestion];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === q.correctAnswer;

  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-semibold text-blue-400">
            Score: {score}/{quiz.questions.length}
          </span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl font-bold text-white mb-6">{q.question}</h2>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {q.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => !isAnswered && handleAnswerSelect(idx)}
            disabled={isAnswered}
            className={`w-full p-4 rounded-lg text-left transition ${
              selectedAnswer === idx
                ? isCorrect
                  ? "bg-green-600/50 border-2 border-green-500"
                  : "bg-red-600/50 border-2 border-red-500"
                : "bg-slate-600 hover:bg-slate-500 border-2 border-transparent"
            } ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-white">{option}</span>
              {selectedAnswer === idx &&
                (isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                ))}
            </div>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="bg-slate-600/50 border border-slate-500 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-200">{q.explanation}</p>
        </div>
      )}

      {/* Navigation */}
      {isAnswered && (
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (currentQuestion < quiz.questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
                setShowExplanation(false);
              }
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {currentQuestion < quiz.questions.length - 1
              ? "Next Question"
              : "Quiz Complete!"}
          </button>
          {currentQuestion === quiz.questions.length - 1 && (
            <button
              onClick={generateQuiz}
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              New Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}