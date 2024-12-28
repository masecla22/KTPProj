
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSearchParams } from "react-router-dom";

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
                    
                    return (
                        <div key={disorder} className="mb-6">
                            <div className="flex justify-between mb-2">
                                <span>{disorder} / </span>
                                <span>{cappedScore}%</span>
                            </div>
                            <Progress value={cappedScore} className="mb-6" />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}