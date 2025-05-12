import React, { useState, useEffect } from 'react';
import "../CSS/Questionaire.css";
import { callSubmitAPI } from '../Components/api';
import { useAuth } from "react-oidc-context";
import { useNavigate } from 'react-router-dom';


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
            step: 0.01
        },
        {
            id: "density",
            text: "How important is population density? (0 = not important, 1 = very important)",
            type: "range",
            min: 0,
            max: 1,
            step: 0.01
        },
        {
            id: "ranking",
            text: "How important is city ranking/quality of life? (0 = not important, 1 = very important)",
            type: "range",
            min: 0,
            max: 1,
            step: 0.01
        },
        {
            id: "cost_of_living_index",
            text: "How important is cost of living? (0 = prefer expensive, 1 = prefer affordable)",
            type: "range",
            min: 0,
            max: 1,
            step: 0.01
        },
        {
            id: "crime",
            text: "How important is low crime rate? (0 = not important, 1 = very important)",
            type: "range",
            min: 0,
            max: 1,
            step: 0.01
        },
        {
            id: "annual_avg_temp",
            text: "Temperature preference (0 = prefer cold, 1 = prefer warm)",
            type: "range",
            min: 0,
            max: 1,
            step: 0.01
        },
        {
            id: "rent_0_bedroom",
            text: "Importance of studio/0-bedroom affordability (0 = not important, 1 = very important)",
            type: "range",
            min: 0,
            max: 1,
            step: 0.01
        },
        {
            id: "rent_1_bedroom",
            text: "Importance of 1-bedroom affordability (0 = not important, 1 = very important)",
            type: "range",
            min: 0,
            max: 1,
            step: 0.01
        },
        {
            id: "rent_2_bedroom",
            text: "Importance of 2-bedroom affordability (0 = not important, 1 = very important)",
            type: "range",
            min: 0,
            max: 1,
            step: 0.01
        },
        {
            id: "rent_3_bedroom",
            text: "Importance of 3-bedroom affordability (0 = not important, 1 = very important)",
            type: "range",
            min: 0,
            max: 1,
            step: 0.01
        },
        {
            id: "rent_4_bedroom",
            text: "Importance of 4-bedroom affordability (0 = not important, 1 = very important)",
            type: "range",
            min: 0,
            max: 1,
            step: 0.01
        },
        {
            id: "avg_rent",
            text: "Importance of average rent prices (0 = not important, 1 = very important)",
            type: "range",
            min: 0,
            max: 1,
            step: 0.01
        },
        {
            id: "Education",
            text: "How important is education quality? (0 = not important, 1 = very important)",
            type: "range",
            min: 0,
            max: 1,
            step: 0.01
        }
    ];

    const auth = useAuth();
    const navigate = useNavigate(); // Add useNavigate hook

    const [currentSet, setCurrentSet] = useState(0);
    
    const [showResults, setShowResults] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const cognitoId = auth.user?.profile?.sub;
    const [answers, setAnswers] = useState(() => {
        const initialAnswers = {};
        questions.forEach(question => {
            if (question.type === "range") {
                initialAnswers[`question_${question.id}`] = "0"; // Initialize to string "0"
            }
        });
        return initialAnswers;
    });

    // Check localStorage for existing answers when component mounts
    useEffect(() => {
        const savedAnswers = localStorage.getItem(`questionnaireAnswers_${cognitoId}`);
        if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
            setShowResults(true);
        }
    }, [cognitoId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Ensure we always have a numeric value (even if empty string comes in)
        const numericValue = value === "" ? "0" : value;
        setAnswers(prev => ({
            ...prev,
            [name]: numericValue
        }));
    };

    const formatAnswers = () => {
        const formattedAnswers = {
            userId: cognitoId || ''
        };
    
        questions.forEach(question => {
            const answerKey = `question_${question.id}`;
            // For range questions, ensure we have a number (default to 0)
            if (question.type === "range") {
                formattedAnswers[question.id] = parseFloat(answers[answerKey] || "0");
            } else {
                formattedAnswers[question.id] = answers[answerKey] || "";
            }
        });
    
        return formattedAnswers;
    };

    const saveToLambda = async () => {
        setIsSubmitting(true);
        setSubmitMessage('Submitting your answers...');
        
        try {
            const formattedAnswers = formatAnswers();
            const response = await callSubmitAPI(formattedAnswers);

            if (response.error) {
                throw new Error(response.error);
            }

            // Save answers to localStorage
            localStorage.setItem(`questionnaireAnswers_${cognitoId}`, JSON.stringify(answers));
            
            setSubmitMessage('Your answers have been successfully saved!');
            setShowResults(true);
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitMessage(`Error: ${error.message || 'Failed to save answers'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = () => {
        saveToLambda();
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

    const handleRedoQuestionnaire = () => {
        // Clear saved answers and reset state
        localStorage.removeItem(`questionnaireAnswers_${cognitoId}`);
        setAnswers({});
        setCurrentSet(0);
        setShowResults(false);
        setSubmitMessage('');
    };

    const renderQuestions = () => {
        const startIndex = currentSet * 5;
        const endIndex = Math.min(startIndex + 5, questions.length);
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
                            value={answers[`question_${question.id}`] || "0"} // Default to "0"
                            onChange={handleInputChange}
                        />
                        <span>{answers[`question_${question.id}`] || "0"}</span> {/* Default to "0" */}
                    </div>
                ) : question.type === "text" ? (
                    <input
                        type="text"
                        name={`question_${question.id}`}
                        value={answers[`question_${question.id}`] || ""}
                        onChange={handleInputChange}
                        placeholder={question.placeholder || "Enter your answer"}
                    />
                ) : null}
            </div>
        ));
    };

    const renderResults = () => {
        return (
            <div className="results-container">
                <h2>Your Answers:</h2>
                {questions.map((question) => {
                    // Get the answer value, using default 0 for range questions if not set
                    const answerKey = `question_${question.id}`;
                    let answerValue = answers[answerKey];
                    
                    if (question.type === "range") {
                        answerValue = answerValue !== undefined ? answerValue : "0";
                    }
    
                    return (
                        <p key={question.id}>
                            {question.text}: {answerValue}
                        </p>
                    );
                })}
                {submitMessage && (
                    <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                        {submitMessage}
                    </div>
                )}
                <div className="results-buttons">
                    <button 
                        onClick={() => navigate('/resultspage')}
                        className="view-results-button"
                    >
                        View Detailed Results
                    </button>
                    <button 
                        onClick={handleRedoQuestionnaire}
                        className="redo-button"
                    >
                        Redo Questionnaire
                    </button>
                </div>
            </div>
        );
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