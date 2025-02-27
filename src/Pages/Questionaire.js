// src/pages/NewPage.js
import React,{useState} from 'react';

const Questionaire = () => {
    const questions = [
        {
          id: 1,
          text: 'What is your name?',
          type: 'text',
          placeholder: 'Enter your name',
        },
        {
          id: 2,
          text: 'How old are you?',
          type: 'number',
          placeholder: 'Enter your age',
        },
        {
          id: 3,
          text: 'What is your favorite color?',
          type: 'text',
          placeholder: 'Enter your favorite color',
        },
        {
          id: 4,
          text: 'Do you enjoy programming?',
          type: 'select',
          options: ['Yes', 'No'],
        },
      ];
    
      const [currentQuestion, setCurrentQuestion] = useState(0);
      const [answers, setAnswers] = useState({});
      const [showResults, setShowResults] = useState(false);
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAnswers({ ...answers, [name]: value });
      };
    
      const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowResults(true);
        }
      };
    
      const handlePrevious = () => {
        if (currentQuestion > 0) {
          setCurrentQuestion(currentQuestion - 1);
        }
      };
    
      const renderQuestion = () => {
        const question = questions[currentQuestion];
        return (
          <div>
            <p>{question.text}</p>
            {question.type === 'text' || question.type === 'number' ? (
              <input
                type={question.type}
                name={`question_${question.id}`}
                placeholder={question.placeholder}
                value={answers[`question_${question.id}`] || ''}
                onChange={handleInputChange}
              />
            ) : question.type === 'select' ? (
              <select
                name={`question_${question.id}`}
                value={answers[`question_${question.id}`] || ''}
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
        );
      };
    
      const renderResults = () => {
        return (
          <div>
            <h2>Your Answers:</h2>
            {questions.map((question) => (
              <p key={question.id}>
                {question.text}: {answers[`question_${question.id}`]}
              </p>
            ))}
          </div>
        );
      };
    
      return (
        <div>
          <h1>Welcome to the Questionnaire</h1>
          {!showResults ? (
            <div>
              {renderQuestion()}
              <button onClick={handlePrevious} disabled={currentQuestion === 0}>
                Previous
              </button>
              <button onClick={handleNext}>
                {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          ) : (
            renderResults()
          )}
        </div>
      );
    };
    

export default Questionaire;