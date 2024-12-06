
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";

export default function ResultsPage() {
    const [searchParams, _] = useSearchParams();
    const result = searchParams.get("result");

    return (
        <Card className="w-full max-w-lg mx-auto mt-10">
            <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-lg">{result}</p>
            </CardContent>
        </Card>
    );
}