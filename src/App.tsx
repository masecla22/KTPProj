import { BrowserRouter, Route, Routes } from "react-router-dom"
import QuizPage from "./pages/quiz-page"
import ResultsPage from "./pages/result-page"

function App() {
  // return <QuizPage />
  return <BrowserRouter basename="/KTPProj">
    <Routes>
      <Route path="/" element={<QuizPage />} />
      <Route path="/result" element={<ResultsPage />} />
    </Routes>
  </BrowserRouter>
}

export default App
