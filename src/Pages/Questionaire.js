// src/pages/NewPage.js
import React,{useState} from 'react';
import "../CSS/Questionaire.css";

const Questionaire = () => {
    const questions = [
        // First set of slider-based questions
        {
          id: 1,
          text: "How important is Access to Nature to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 2,
          text: "How important is Public Transport to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 3,
          text: "How important is Walkability to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 4,
          text: "How important is Racial Diversity to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 5,
          text: "How important is Access to Healthcare to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 6,
          text: "How important is Affordable Housing to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 7,
          text: "How important is Restaurant Quality to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 8,
          text: "How important is Education to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 9,
          text: "How important is Career to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 10,
          text: "How important is Night Life to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 11,
          text: "How important are Sports Events to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 12,
          text: "How important is Politics to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 13,
          text: "How important is Crime Rate to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 14,
          text: "How important is Population Size to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        // Second set of mixed-type questions
        {
          id: 15,
          text: "What type of nature do you prefer?",
          type: "select",
          options: ["Forest", "Mountains", "Beach", "Desert", "Urban Parks"],
        },
        {
          id: 16,
          text: "What is your favorite sport?",
          type: "select",
          options: ["Football", "Basketball", "Tennis", "Swimming", "Running"],
        },
        {
          id: 17,
          text: "What is your age group?",
          type: "select",
          options: ["18-24", "25-34", "35-44", "45-54", "55+"],
        },
        {
          id: 18,
          text: "What is your race?",
          type: "select",
          options: ["White", "Black", "Asian", "Hispanic", "Other"],
        },
        {
          id: 19,
          text: "What is your political affiliation? (Conservative - Liberal)",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 20,
          text: "What is your career?",
          type: "text",
          placeholder: "Enter your career",
        },
        {
          id: 21,
          text: "What is your salary goal?",
          type: "select",
          options: ["$30k-$50k", "$50k-$80k", "$80k-$120k", "$120k+"],
        },
        {
          id: 22,
          text: "What is your preferred population size?",
          type: "select",
          options: ["Small Town", "Medium City", "Large City", "Metropolis"],
        },
        {
          id: 23,
          text: "What is your hobby?",
          type: "text",
          placeholder: "Enter your hobby",
        },
        {
          id: 24,
          text: "How important is Weather to you?",
          type: "range",
          min: 1,
          max: 10,
          step: 1,
        },
        {
          id: 25,
          text: "What is your preferred cost of living?",
          type: "select",
          options: ["Low", "Medium", "High"],
        },
      ];
    
      const [currentSet, setCurrentSet] = useState(0);
      const [answers, setAnswers] = useState({});
      const [showResults, setShowResults] = useState(false);
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAnswers({ ...answers, [name]: value });
      };
    
      const handleNext = () => {
        if (currentSet < Math.ceil(questions.length / 5) - 1) {
          setCurrentSet(currentSet + 1);
        } else {
          setShowResults(true);
        }
      };
    
      const handlePrevious = () => {
        if (currentSet > 0) {
          setCurrentSet(currentSet - 1);
        }
      };
    
      const isCurrentSetComplete = () => {
        const startIndex = currentSet * 5;
        const endIndex = startIndex + 5;
        const currentQuestions = questions.slice(startIndex, endIndex);
    
        return currentQuestions.every(
          (question) => answers[`question_${question.id}`] !== undefined
        );
      };
    
      const renderQuestions = () => {
        const startIndex = currentSet * 5;
        const endIndex = startIndex + 5;
        const currentQuestions = questions.slice(startIndex, endIndex);
    
        return currentQuestions.map((question) => (
          <div key={question.id} className="question">
            <p>{question.text}</p>
            {question.type === "range" ? (
              <div>
                <input
                  type="range"
                  name={`question_${question.id}`}
                  min={question.min}
                  max={question.max}
                  step={question.step}
                  value={answers[`question_${question.id}`] || question.min}
                  onChange={handleInputChange}
                />
                <span>{answers[`question_${question.id}`] || question.min}</span>
              </div>
            ) : question.type === "select" ? (
              <select
                name={`question_${question.id}`}
                value={answers[`question_${question.id}`] || ""}
                onChange={handleInputChange}
              >
                <option value="">Select an option</option>
                {question.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : question.type === "text" ? (
              <input
                type="text"
                name={`question_${question.id}`}
                placeholder={question.placeholder}
                value={answers[`question_${question.id}`] || ""}
                onChange={handleInputChange}
              />
            ) : null}
          </div>
        ));
      };
    
      const renderResults = () => {
        return (
          <div className="results-container">
            <h2>Your Answers:</h2>
            {questions.map((question) => (
              <p key={question.id}>
                {question.text}: {answers[`question_${question.id}`]}
              </p>
            ))}
            <button className="download-button" onClick={exportToJson}>
              Download Answers as JSON
            </button>
          </div>
        );
      };
    
      const exportToJson = () => {
        const jsonData = JSON.stringify(answers, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "questionnaire_answers.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };
    
      return (
        <div className="questionnaire-container">
          <h1 className="questionnaire-title">CitySync Preferences Questionnaire</h1>
          {!showResults ? (
            <div>
              {renderQuestions()}
              <div className="button-container">
                <button onClick={handlePrevious} disabled={currentSet === 0}>
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isCurrentSetComplete()}
                >
                  {currentSet === Math.ceil(questions.length / 5) - 1
                    ? "Submit"
                    : "Next"}
                </button>
              </div>
            </div>
          ) : (
            renderResults()
          )}
        </div>
      );
    };
    

export default Questionaire;