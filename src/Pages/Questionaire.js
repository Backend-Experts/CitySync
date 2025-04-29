import React, { useState,useEffect } from 'react';
import "../CSS/Questionaire.css";
import { callSubmitAPI , testAPIConnection} from '../Components/api';
import { useAuth } from "react-oidc-context";


const Questionaire = () => {
  const questions = [
    {
        id: "name",
        text: "What is your name?",
        type: "text",
        placeholder: "Enter your name"
    },
    {
        id: "population",
        text: "How important is population size? (0 = not important, 1 = very important)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        id: "density",
        text: "How important is population density? (0 = not important, 1 = very important)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        id: "ranking",
        text: "How important is city ranking/quality of life? (0 = not important, 1 = very important)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        id: "cost_of_living_index",
        text: "How important is cost of living? (0 = prefer expensive, 1 = prefer affordable)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        id: "crime",
        text: "How important is low crime rate? (0 = not important, 1 = very important)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        id: "annual_avg_temp",
        text: "Temperature preference (0 = prefer cold, 1 = prefer warm)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        id: "rent_0_bedroom",
        text: "Importance of studio/0-bedroom affordability (0 = not important, 1 = very important)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        id: "rent_1_bedroom",
        text: "Importance of 1-bedroom affordability (0 = not important, 1 = very important)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        id: "rent_2_bedroom",
        text: "Importance of 2-bedroom affordability (0 = not important, 1 = very important)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        id: "rent_3_bedroom",
        text: "Importance of 3-bedroom affordability (0 = not important, 1 = very important)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        id: "rent_4_bedroom",
        text: "Importance of 4-bedroom affordability (0 = not important, 1 = very important)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        id: "avg_rent",
        text: "Importance of average rent prices (0 = not important, 1 = very important)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        id: "Education",
        text: "How important is education quality? (0 = not important, 1 = very important)",
        type: "range",
        min: 0,
        max: 1,
        step: 0.1
    }
];

    const auth = useAuth();
    const [currentSet, setCurrentSet] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [result, setResult] = useState(null);
    const [userId, setUserId] = useState('');


    
    const cognitoId = auth.user?.profile?.sub; // Cognito ID ("sub" claim)
            

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAnswers({ ...answers, [name]: value });
    };

    const formatAnswers = () => {
      return {
          user_id: cognitoId || '',
          ...answers,
          // Ensure all numeric values are between 0-1
          ...Object.fromEntries(
              Object.entries(answers)
                  .filter(([key]) => key !== "name")
                  .map(([key, value]) => [key, Math.min(1, Math.max(0, value))])
          )
      };
  };
  
  // Map question IDs to their corresponding output fields
  const questionMapping = {
    1: 'name',
    2: 'population',
    3: 'density',
    4: 'ranking',
    5: 'cost_of_living_index',
    6: 'crime',
    9: 'annual_avg_temp',
    10: 'rent_0_bedroom',
    11: 'rent_1_bedroom',
    12: 'rent_2_bedroom',
    13: 'rent_3_bedroom',
    14: 'rent_4_bedroom',
    15: 'avg_rent',
    16: 'Education'
  };

  // Add all other answers after userId
  Object.keys(answers).forEach(key => {
    const questionId = parseInt(key.replace('question_', ''));
    const fieldName = questionMapping[questionId];
    
    if (fieldName) {
      formattedAnswers[fieldName] = answers[key];
    }
  });

  return formattedAnswers;
};
    const saveToLambda = async () => {
        setIsSubmitting(true);
        setSubmitMessage('Submitting your answers...');
        
        try {

            const formattedAnswers = formatAnswers(answers);
            // Submit using your existing callSubmitAPI function
            const response = await callSubmitAPI(formattedAnswers);

            if (response.error) {
                throw new Error(response.error);
            }

            setSubmitMessage('Your answers have been successfully saved!');
            setShowResults(true);
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitMessage(`Error: ${error.message || 'Failed to save answers'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const testApi = async (jsondata) => {
      try {
        const response = await fetch(
          'https://v09lb8rp98.execute-api.us-east-1.amazonaws.com/default/questionnaire',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsondata),
          }
        );
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setResult({ error: err.message });
      }
    };

    const handleSubmit = () => {
        if (isCurrentSetComplete()) {
            saveToLambda();
        } else {
            setSubmitMessage('Please complete all questions before submitting');
        }
    };

    const handleNext = () => {
        if (currentSet < Math.ceil(questions.length / 5) - 1) {
            setCurrentSet(currentSet + 1);
        } else {
            handleSubmit();
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
                {submitMessage && (
                    <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                        {submitMessage}
                    </div>
                )}
                <button 
                    className="download-button" 
                    onClick={exportToJson}
                >
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
                    {submitMessage && (
                        <div className="submit-message">
                            {submitMessage}
                        </div>
                    )}
                </div>
            ) : (
                renderResults()
            )}
        </div>
    );
};

export default Questionaire;