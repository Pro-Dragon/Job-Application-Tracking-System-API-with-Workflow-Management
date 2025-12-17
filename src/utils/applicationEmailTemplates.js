export function getStageChangeEmail({ fromStage, toStage }) {
  if (toStage === "REJECTED") {
    return {
      subject: "Application Update",
      text: "We appreciate your interest, but you were not selected for this role.",
    };
  }

  return {
    subject: "Application Status Updated",
    text: `Good news! Your application moved from ${fromStage} to ${toStage}.`,
  };
}
