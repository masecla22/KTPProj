
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSearchParams } from "react-router-dom";
import knowledge from "@/knowledge/knowledge_base.json"

function getAdvice(disorder: string) {
    for (const item of knowledge.Advice) {
        if (item.current_disorder === disorder) {
            return item.advice;
        }
    }

    return "No advice available.";
}

export default function ResultsPage() {
    const [searchParams, _] = useSearchParams();
    const suspicions = JSON.parse(searchParams.get("result")!) as Record<string, number>;


    const sortedSuspicions = Object.entries(suspicions).sort((a, b) => b[1] - a[1]);

    return (
        <Card className="w-full max-w-lg mx-auto mt-10">
            <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
            </CardHeader>
            <CardContent>
                {sortedSuspicions.map(([disorder, score]) => {
                    const cappedScore = Math.min(score, 5) * 20;

                    if (cappedScore < 50) {
                        return null;
                    }

                    return (
                        <Card className="w-full max-w-lg mx-auto mt-2">
                            <CardContent className="pb-0">
                                <CardHeader className="p-0 pt-6">
                                    <CardTitle>
                                        <div className="flex justify-between mb-2">
                                            <span>{disorder} </span>
                                            <span>{cappedScore}%</span>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <div key={disorder} className="mb-6">

                                    <Progress value={cappedScore} className="mb-6" />

                                    {getAdvice(disorder)}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </CardContent>
        </Card>
    );
}