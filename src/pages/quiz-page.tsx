"use client"

import DisabilityLearningQuiz from "@/components/disability-quiz";
import { useNavigate } from "react-router-dom";

export interface Question {
  id: number;        // Unique identifier for the question
  text: string;      // The question text to display
  answers: string[]; // Array of possible answer choices
}

export default function QuizPage() {
  const nav = useNavigate();

  const handleQuizComplete = (result: Record<string, number>) => {
    // Navigate to the results page
    nav("/result?result=" + encodeURIComponent(JSON.stringify(result)));
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Disability Quiz</h1>
      <DisabilityLearningQuiz onComplete={handleQuizComplete} />
    </div>
  );
}

