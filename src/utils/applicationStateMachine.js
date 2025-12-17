const allowedTransitions = {
  APPLIED: ["SCREENING", "REJECTED"],
  SCREENING: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["OFFER", "REJECTED"],
  OFFER: ["HIRED", "REJECTED"],
  HIRED: [],
  REJECTED: [],
};

export function isValidTransition(currentStage, nextStage) {
  const allowedNextStages = allowedTransitions[currentStage] || [];
  return allowedNextStages.includes(nextStage);
}
