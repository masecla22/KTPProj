"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Question {
  id: number
  text: string
  answers: string[]
}

interface QuizProps {
  questions: Question[]
  onComplete: (answers: Record<number, string>) => void
}

export default function DisabilityLearningQuiz({ questions, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const currentQuestion = questions[currentQuestionIndex]
  const progress = (currentQuestionIndex / (questions.length - 1)) * 100

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      onComplete(answers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Learning Disability Quiz</CardTitle>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>
        <RadioGroup
          value={answers[currentQuestion.id]}
          onValueChange={handleAnswer}
          className="space-y-2"
        >
          {currentQuestion.answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={answer} id={`answer-${index}`} />
              <Label htmlFor={`answer-${index}`}>{answer}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
        >
          {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  )
}

