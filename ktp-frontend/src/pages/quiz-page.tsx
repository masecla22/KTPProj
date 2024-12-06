"use client"

import DisabilityLearningQuiz from "@/components/disability-quiz";
import knowledgeBase from "@/knowledge/knowledge_base.json";
import { calculateResult } from "@/utils/result-calculator";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Question {
  id: number;        // Unique identifier for the question
  text: string;      // The question text to display
  answers: string[]; // Array of possible answer choices
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const nav = useNavigate();

  // Extract questions from the knowledge base
  useEffect(() => {
    const extractedQuestions: Question[] = knowledgeBase["Knowledge base"].flatMap((disorder, index) =>
      disorder.symptoms.map((symptom, symptomIndex) => ({
        id: index * 100 + symptomIndex, // Generate unique IDs
        text: symptom.question,
        answers: ["1", "2", "3", "4", "5"], // Assuming a 1-5 scale
      }))
    );

    setQuestions(extractedQuestions);
  }, []);

  const handleQuizComplete = (answers: Record<number, string>) => {
    const result = calculateResult(answers, questions);

    // Navigate to the results page
    nav("/result?result=" + encodeURIComponent(result));
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Disability Quiz</h1>
      {questions.length > 0 ? (
        <DisabilityLearningQuiz questions={questions} onComplete={handleQuizComplete} />
      ) : (
        <p className="text-center">Loading questions...</p>
      )}
    </div>
  );
}

