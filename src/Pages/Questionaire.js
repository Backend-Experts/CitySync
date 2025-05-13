import React, { useState, useEffect } from 'react';
import "../CSS/Questionaire.css";
import { callSubmitAPI } from '../Components/api';
import { useAuth } from "react-oidc-context";
import { useNavigate } from 'react-router-dom';
import minMaxData from "../data/min_max_metadata.json";

const Questionaire = () => {
    const questions = [
        { id: "population", text: "What city size do you prefer? (0 = smaller cities, 1 = larger cities)", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true },
        { id: "density", text: "What population density do you prefer? (0 = spread out, 1 = densely packed)", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true },
        { id: "ranking", text: "How much do you care about city livability rankings? (0 = not at all, 1 = very important)", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true },
        { id: "cost_of_living_index", text: "What cost of living fits your budget? (0 = low cost, 1 = high cost)", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true },
        { id: "crime", text: "How tolerant are you of crime? (0 = prefer safer cities, 1 = okay with more crime)", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true },
        { id: "annual_avg_temp", text: "What climate do you prefer? (0 = colder, 1 = warmer)", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true },
        { id: "rent_0_bedroom", text: "What’s your preferred rent for a studio apartment?", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true },
        { id: "rent_1_bedroom", text: "What’s your preferred rent for a 1-bedroom apartment?", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true },
        { id: "rent_2_bedroom", text: "What’s your preferred rent for a 2-bedroom apartment?", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true },
        { id: "rent_3_bedroom", text: "What’s your preferred rent for a 3-bedroom home?", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true },
        { id: "rent_4_bedroom", text: "What’s your preferred rent for a 4-bedroom home?", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true },
        { id: "avg_rent", text: "What’s your preferred average rent across the city?", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true },
        { id: "Education", text: "How important is high-quality education in a city? (0 = not important, 1 = very important)", type: "range", min: 0, max: 1, step: 0.01, hasWeight: true }
      ];

    const auth = useAuth();
    const navigate = useNavigate();
    const cognitoId = auth.user?.profile?.sub;

    const [currentSet, setCurrentSet] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const [answers, setAnswers] = useState(() => {
        const initialAnswers = {};
        questions.forEach(question => {
            if (question.type === "range") {
                initialAnswers[`question_${question.id}`] = "0";
                if (question.hasWeight) {
                    initialAnswers[`weight_${question.id}`] = 1;
                }
            }
        });
        return initialAnswers;
    });

    useEffect(() => {
        const savedAnswers = localStorage.getItem(`questionnaireAnswers_${cognitoId}`);
        if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
            setShowResults(true);
        }
    }, [cognitoId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value === "" ? "0" : value;
        setAnswers(prev => ({ ...prev, [name]: numericValue }));
    };

    const formatAnswers = () => {
        const formattedAnswers = { userId: cognitoId || '' };
        if (answers["question_name"]) {
            formattedAnswers["name"] = answers["question_name"];
        }

        const rentFields = new Set([
            "rent_0_bedroom", "rent_1_bedroom", "rent_2_bedroom",
            "rent_3_bedroom", "rent_4_bedroom", "avg_rent"
        ]);

        questions.forEach((question) => {
            let rawValue = parseFloat(answers[`question_${question.id}`] || "0");
            const weight = parseFloat(answers[`weight_${question.id}`] || "1");
            let normalized;

            if (rentFields.has(question.id)) {
                const min = minMaxData[question.id]?.min ?? 0;
                const max = minMaxData[question.id]?.max ?? 1;
                normalized = (max - min === 0) ? 0 : (rawValue - min) / (max - min);
            } else {
                rawValue = rawValue / 10;
                normalized = rawValue;
            }

            const weighted = Math.max(0, Math.min(1, normalized * weight));
            formattedAnswers[question.id] = weighted;
        });

        return formattedAnswers;
    };

    const saveToLambda = async () => {
        setIsSubmitting(true);
        setSubmitMessage('Submitting your answers...');
        try {
            const formattedAnswers = formatAnswers();
            const response = await callSubmitAPI(formattedAnswers);
            if (response.error) throw new Error(response.error);
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

    const handleSubmit = () => saveToLambda();
    const handleNext = () => currentSet < Math.ceil(questions.length / 5) - 1 ? setCurrentSet(currentSet + 1) : handleSubmit();
    const handlePrevious = () => currentSet > 0 && setCurrentSet(currentSet - 1);
    const handleRedoQuestionnaire = () => {
        localStorage.removeItem(`questionnaireAnswers_${cognitoId}`);
        setAnswers({});
        setCurrentSet(0);
        setShowResults(false);
        setSubmitMessage('');
    };

    const renderQuestions = () => {
        const rentFields = new Set([
            "rent_0_bedroom", "rent_1_bedroom", "rent_2_bedroom",
            "rent_3_bedroom", "rent_4_bedroom", "avg_rent"
        ]);
        const startIndex = currentSet * 5;
        const endIndex = Math.min(startIndex + 5, questions.length);
        return questions.slice(startIndex, endIndex).map((question) => {
            const min = minMaxData[question.id]?.min ?? question.min;
            const max = minMaxData[question.id]?.max ?? question.max;
            const value = answers[`question_${question.id}`] || "0";
            const weight = answers[`weight_${question.id}`] || "1";
            const isRent = rentFields.has(question.id);
            return (
                <div key={question.id} className="question">
                    <p>
                        {question.text}
                        {question.type === "range" && (
                            <span className="slider-range">&nbsp;({isRent ? `${min} to ${max}` : "0 to 1"})</span>
                        )}
                    </p>
                    {question.type === "range" && (
                        <div>
                            <input
                                type="range"
                                name={`question_${question.id}`}
                                min={isRent ? min : 0}
                                max={isRent ? max : 1}
                                step={question.step}
                                value={value}
                                onChange={handleInputChange}
                            />
                            <span>{value}</span>
                        </div>
                    )}
                    {question.type === "text" && (
                        <input
                            type="text"
                            name={`question_${question.id}`}
                            value={answers[`question_${question.id}`] || ""}
                            onChange={handleInputChange}
                            placeholder={question.placeholder || "Enter your answer"}
                        />
                    )}
                    {question.hasWeight && (
                        <div className="weight-slider">
                            <p>How important is this preference? (0 = ignore, 1 = normal, 2 = very important)</p>
                            <input
                                type="range"
                                name={`weight_${question.id}`}
                                min={0}
                                max={2}
                                step={0.01}
                                value={weight}
                                onChange={handleInputChange}
                            />
                            <span>{weight}</span>
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderResults = () => {
        const rentFields = new Set([
            "rent_0_bedroom", "rent_1_bedroom", "rent_2_bedroom",
            "rent_3_bedroom", "rent_4_bedroom", "avg_rent", "cost_of_living_index"
        ]);
        return (
            <div className="results-container">
                <h2>Your Answers:</h2>
                {answers["question_name"] && (
                    <p><strong>Name:</strong> {answers["question_name"]}</p>
                )}
                {questions.map((question) => {
                    const id = question.id;
                    const value = answers[`question_${id}`];
                    const weight = answers[`weight_${id}`];
                    const isDollarField = id.startsWith("rent_") || id === "avg_rent";
                    const displayValue = isDollarField ? `$${parseFloat(value).toLocaleString()}` : value;
                    return (
                        <div key={id} className="result-entry">
                            <p>
                                <strong>{question.text}</strong><br />
                                Selected: {displayValue}
                                {question.hasWeight && (
                                    <><br />Importance (Weight): {weight}</>
                                )}
                            </p>
                        </div>
                    );
                })}
                {submitMessage && (
                    <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                        {submitMessage}
                    </div>
                )}
                <div className="results-buttons">
                    <button onClick={() => navigate('/resultspage')} className="view-results-button">View Detailed Results</button>
                    <button onClick={handleRedoQuestionnaire} className="redo-button">Redo Questionnaire</button>
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
                        <button onClick={handlePrevious} disabled={currentSet === 0}>Previous</button>
                        <button onClick={handleNext}>
                            {currentSet === Math.ceil(questions.length / 5) - 1 ? "Submit" : "Next"}
                        </button>
                    </div>
                    {submitMessage && <div className="submit-message">{submitMessage}</div>}
                </div>
            ) : (
                renderResults()
            )}
        </div>
    );
};

export default Questionaire;