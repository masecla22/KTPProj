import { Question } from "@/pages/quiz-page";
import knowledgeBase from "../knowledge/knowledge_base.json";

export function calculateResult(answers: Record<number, string>, questions: Question[]) {
  const { "Knowledge base": disorders, Rules: rules } = knowledgeBase;

  // Map question answers back to symptom facts
  const facts: Array<[string, string]> = questions.map(question => {
    const symptom = disorders
      .flatMap(disorder => disorder.symptoms)
      .find(symptom => symptom.question === question.text);

    return symptom ? [symptom.name, answers[question.id]] : null;
  }).filter(Boolean) as Array<[string, string]>;

  console.log(facts);

  let currentDisorders = [disorders[0]]; // Start with the first disorder

  // Process disorders based on rules and gathered facts
  while (currentDisorders.length) {
    const disorder = currentDisorders.shift();
    const ruleSet = rules.find(r => r["current disorder"] === disorder?.disorder);

    if (!ruleSet) continue;

    for (const movement of ruleSet["movement options"] || []) {
      let numberRequired = movement.number;

      for (const required of movement["required symptoms"] || []) {
        const [key, value] = Object.entries(required)[0];
        const fact = facts.find(f => f[0] === key);

        if (fact) {
          const threshold = parseInt(value.slice(1));
          if ((value.startsWith(">") && parseInt(fact[1]) > threshold) ||
            (value.startsWith("<") && parseInt(fact[1]) < threshold)) {
            numberRequired--;
          }
        }
      }

      if (numberRequired <= 0) {
        const nextDisorder = disorders.find(d => d.disorder === movement["new direction"]);
        if (nextDisorder) currentDisorders.push(nextDisorder);
      }
    }
  }

  // Determine final advice or fallback
  const finalRule = rules.find(r => r["current disorder"] === (currentDisorders[0]?.disorder || "None detected"));
  return finalRule?.advice || "No learning disability detected.";
}