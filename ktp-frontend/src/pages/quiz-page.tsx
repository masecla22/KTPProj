"use client"

import DisabilityLearningQuiz from "../components/disability-quiz"
import knowledge from "../knowledge/knowledge_base.json"

const questions = [
  {
    id: 1,
    text: "Is there a general learning disability suspected?",
    answers: ["Yes", "No"]
  },
  {
    id: 2,
    text: "Does the individual show inconsistent academic performance across subjects?",
    answers: ["Yes", "No"]
  },
  {
    id: 3,
    text: "Does the individual display low self-esteem or frustration related to learning tasks?",
    answers: ["Yes", "No"]
  },
]

export default function QuizPage() {
  const handleQuizComplete = (answers: Record<number, string>) => {
    console.log("Quiz completed! Answers:", answers)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Disability Quiz</h1>
      <DisabilityLearningQuiz questions={questions} onComplete={handleQuizComplete} />
    </div>
  )
}

