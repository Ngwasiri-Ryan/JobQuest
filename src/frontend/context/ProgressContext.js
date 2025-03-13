import React, { createContext, useState, useContext } from 'react';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5; // Define the total number of steps

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const resetStep = () => setCurrentStep(0);

  return (
    <ProgressContext.Provider value={{ currentStep, totalSteps, nextStep, prevStep, resetStep }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
