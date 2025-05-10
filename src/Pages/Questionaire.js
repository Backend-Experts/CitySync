import React, { useState } from 'react';
import "../CSS/Questionaire.css";
import { callSubmitAPI } from '../Components/api';
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
    const [currentSet, setCurrentSet] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const cognitoId = auth.user?.profile?.sub;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAnswers({ ...answers, [name]: value });
    };

    const formatAnswers = () => {
        // Create an object with userId as the first property
        const formattedAnswers = {
            userId: cognitoId || ''
        };

        // Add all answers directly using their IDs as keys
        Object.keys(answers).forEach(key => {
            const questionId = key.replace('question_', '');
            formattedAnswers[questionId] = answers[key];
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
                            value={answers[`question_${question.id}`] || question.min}
                            onChange={handleInputChange}
                        />
                        <span>{answers[`question_${question.id}`] || question.min}</span>
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