import React, { useState,useEffect } from 'react';
import "../CSS/Questionaire.css";
import { callSubmitAPI , testAPIConnection} from '../Components/api';
import { useAuth } from "react-oidc-context";


const Questionaire = () => {
    const questions = [
        {
            id: 1,
            text: "How important is Affordable Housing to you?",
            type: "range",
            min: 1,
            max: 10,
            step: 1,
        },
        {
            id: 2,
            text: "How important is Education to you?",
            type: "range",
            min: 1,
            max: 10,
            step: 1,
        },
        {
            id: 3,
            text: "How important is Career to you?",
            type: "range",
            min: 1,
            max: 10,
            step: 1,
        },
        {
            id: 4,
            text: "How important is Crime Rate to you?",
            type: "range",
            min: 1,
            max: 10,
            step: 1,
        },
        {
            id: 5,
            text: "How important is Population Size to you?",
            type: "range",
            min: 1,
            max: 10,
            step: 1,
        },
        {
            id: 6,
            text: "How important is Weather to you?",
            type: "range",
            min: 1,
            max: 10,
            step: 1,
        },
        {
            id: 9,
            text: "What is your preferred population size?",
            type: "select",
            options: ["Small Town", "Medium City", "Large City", "Metropolis"],
        },
        {
            id: 10,
            text: "What is your preferred cost of living?",
            type: "select",
            options: ["Low", "Medium", "High"],
        },
        {
            id: 11,
            text: "What is your preferred weather?",
            type: "range",
            min: 1,
            max: 10,
            step: 1,
        },
    ];

    const auth = useAuth();
    const [currentSet, setCurrentSet] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [result, setResult] = useState(null);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        if (auth.isAuthenticated && auth.user?.profile?.sub) {
            setUserId(auth.user.profile.sub);
        }
    }, [auth.isAuthenticated, auth.user]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAnswers({ ...answers, [name]: value });
    };

    const formatAnswers = (answers, userId) => {
  // Create an object with userId as the first property
  const formattedAnswers = {
    userId: userId || '' // Include userId even if empty for consistent structure
  };
  
  // Map question IDs to their corresponding output fields
  const questionMapping = {
    1: 'affordableHousingWeight',
    2: 'educationWeight',
    3: 'careerWeight',
    4: 'crimeWeight',
    5: 'populationWeight',
    6: 'weatherWeight',
    9: 'populationSize',
    10: 'costOfLiving',
    11: 'weatherPreference'
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