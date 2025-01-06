"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import knowledge from "@/knowledge/knowledge_base.json"
import { useEffect, useState } from "react"

interface Question {
  name: string;
  question: string;
}

interface MovementOption {
  number: number;
  new_direction: string;
  required_symptoms: { [key: string]: string }[];
}

interface Rule {
  current_disorder: string;
  movement_options: MovementOption[];
  else: string;
}

function calculateDisordersToInvestigate(
  currentDisorder: any,
  rules: Rule[],
  answers: Record<string, string>,
  currentDisorders: any[]
) {
  console.log("Current Disorder", currentDisorder);
  console.log(rules.map((rule) => rule.current_disorder));
  console.log(currentDisorder.disorder);
  const rulesetForCurrDisorder = rules.find((rule) => rule.current_disorder === currentDisorder.disorder);
  const newCurrentDisorders = [...currentDisorders];

  let suspicions = {} as Record<string, number>;

  rulesetForCurrDisorder?.movement_options.forEach((movementOption) => {
    let numberRequired = movementOption.number;
    const disorderDirection = movementOption.new_direction;

    let numberCounted = 0;

    movementOption.required_symptoms.forEach((symptom) => {
      const [key, value] = Object.entries(symptom)[0];
      const fact = answers[key];

      if (fact) {
        const threshold = parseInt(value.slice(1));
        if ((value.includes(">") && parseInt(fact) > threshold) || (value.includes("<") && parseInt(fact) < threshold)) {
          numberCounted += 1;
        }
      }
    });

    // print(f"Final Number Required for {disorder_direction}: {number_required}")
    console.log(`Final Number Required for ${disorderDirection}: ${numberCounted} / ${numberRequired}`);
    suspicions[disorderDirection] = numberCounted;

    if (numberCounted >= numberRequired) {
      const disorder = knowledge["Knowledge base"].find((d) => d.disorder === disorderDirection);
      console.log("Disorder direction", disorderDirection);
      if (disorder) {
        console.log("adding in new disorder", disorder);
        newCurrentDisorders.push(disorder);
      }
    }
  });

  return [newCurrentDisorders, suspicions] as [any[], Record<string, number>];
}

export default function DisabilityLearningQuiz(props: { onComplete: (result: Record<string, number>) => void }) {
  const [currentDisorders, setCurrentDisorders] = useState([knowledge["Knowledge base"][0]]);
  const [currentBatchOfQuestions, setCurrentBatchOfQuestions] = useState<Question[]>([]);
  const [currentDisorder, setCurrentDisorder] = useState<any>();
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [suspicions, setSuspicions] = useState<Record<string, number>>({});

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const currentQuestion = currentBatchOfQuestions[currentBatchIndex];

  useEffect(() => {
    setCurrentDisorder(currentDisorders[0]);
    setCurrentDisorders(currentDisorders.slice(1));
    setCurrentBatchOfQuestions(currentDisorders[0].symptoms);
    setCurrentBatchIndex(0);
  }, []);

  const handleFinish = () => {
    props.onComplete(suspicions);
  };

  const handleCurrentDisorder = () => {
    const [newDisorders, newSuspicions] = calculateDisordersToInvestigate(
      currentDisorder,
      knowledge.Rules as unknown as Rule[], // Lmao
      answers,
      currentDisorders
    );

    setCurrentDisorders(newDisorders);
    setSuspicions((prev) => ({ ...prev, ...newSuspicions }));

    if (newDisorders.length == 0) {
      handleFinish();
      return;
    }

    setCurrentDisorder(newDisorders[0]);
    setCurrentBatchOfQuestions(newDisorders[0].symptoms);
    setCurrentDisorders(newDisorders.slice(1));
    setCurrentBatchIndex(0);
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.name]: answer }));
  };

  const pushAnswer = () => {
    if (currentBatchIndex === currentBatchOfQuestions.length - 1) {
      handleCurrentDisorder();
    } else {
      setCurrentBatchIndex((prev) => prev + 1);
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "5") {
        handleAnswer(e.key);
      }

      if (e.key === "Enter" && answers[currentQuestion.name]) {
        pushAnswer();
      }
    };

    window.addEventListener("keypress", handler);
    return () => {
      window.removeEventListener("keypress", handler);
    };
  }, [handleAnswer]);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Learning Disability Quiz</CardTitle>
      </CardHeader>
      {currentQuestion &&
        <>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
            <RadioGroup
              value={answers[currentQuestion.name] || ""}
              onValueChange={(value) => handleAnswer(value)}
              className="space-y-2"
            >
              {[1, 2, 3, 4, 5].map((answer, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={answer + ""} id={`answer-${index}`} />
                  <Label htmlFor={`answer-${index}`}>{answer}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={() => {
                pushAnswer();
              }}
              disabled={!answers[currentQuestion.name]}
            >
              Next
            </Button>
          </CardFooter>
        </>
      }
    </Card>
  )
}

