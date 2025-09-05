import { api } from "./api";

export const handleVerifyOTP = (email, oneTimePassword) => {
  api
    .post("/verify_otp", {
      email: email,
      one_time_password: oneTimePassword,
    })
    .then((res) => console.log(res.data))
    .catch((error) => console.error("Error verifying OTP:", error));
};

export const handleForgotPasswordRequest = (email) => {
  api
    .post("/forgot_password_request", { email: email })
    .then((res) => console.log(res.data))
    .catch((error) => console.error("Error requesting password reset:", error));
};

// Subject Management Handlers
export const handleGetSubjects = async () => {
  return api
    .get("/get_subjects")
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((error) => {
      console.error("Error getting subjects:", error);
      throw error;
    });
};

export const handleInsertSubject = (subjectName) => {
  return api
    .post("/insert_subject", { subject_name: subjectName })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((error) => {
      console.error("Error inserting subject:", error);
      throw error;
    });
};

export const handleUpdateSubject = (subjectId, state, subjectName) => {
  return api
    .post("/update_subject", {
      subject_id: subjectId,
      state: state,
      subject_name: subjectName,
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((error) => {
      console.error("Error updating subject:", error);
      throw error;
    });
};

// Paper Management Handlers
export const handleInsertPaper = (subjectId, paperName, section, sourceText) => {
  api
    .post("/insert_paper", {
      subject_id: subjectId,
      paper_name: paperName,
      section: section,
      source_text: sourceText,
    })
    .then((res) => console.log(res.data))
    .catch((error) => console.error("Error inserting paper:", error));
};

export const handleInsertPaperViaAI = (subjectId, paperName, section, sourceText, questionList) => {
  api
    .post("/insert_paper_via_ai", {
      subject_id: subjectId,
      paper_name: paperName,
      section: section,
      source_text: sourceText,
      question_list: questionList,
    })
    .then((res) => console.log(res.data))
    .catch((error) => console.error("Error inserting paper via AI:", error));
};

export const handleUpdatePaper = (paperId, paperName, section, sourceText) => {
  api
    .post("/update_paper", {
      paper_id: paperId,
      paper_name: paperName,
      section: section,
      source_text: sourceText,
    })
    .then((res) => console.log(res.data))
    .catch((error) => console.error("Error updating paper:", error));
};

export const handleDeletePaper = (paperId) => {
  api
    .post("/delete_paper", { paper_id: paperId })
    .then((res) => console.log(res.data))
    .catch((error) => console.error("Error deleting paper:", error));
};

export const handleGetPapers = (subjectId) => {
  return api
    .post("/get_papers", { subject_id: subjectId })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((error) => {
      console.error("Error getting papers:", error);
      throw error;
    });
};

// Question Management Handlers
export const handleInsertQuestion = (paperId, question, marks, image, prompt) => {
  api
    .post("/insert_question", {
      paper_id: paperId,
      question: question, // FastAPI expects "question" key
      marks: marks, // FastAPI expects "marks" key
      image: image, // FastAPI expects "image" key
      prompt: prompt, // FastAPI expects "prompt" key
    })
    .then((res) => console.log(res.data))
    .catch((error) => console.error("Error inserting question:", error));
};

export const handleGetPaperQuestions = (paperId) => {
  return api
    .post("/get_paper_questions", { paper_id: paperId })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("Error getting paper questions:", error);
      throw error;
    });
};

export const handleUpdateQuestion = (questionId, question, marks, image, prompt) => {
  api
    .post("/update_question", {
      question_id: questionId,
      question: question, // FastAPI expects "question" key
      marks: marks, // FastAPI expects "marks" key
      image: image, // FastAPI expects "image" key
      prompt: prompt, // FastAPI expects "prompt" key
    })
    .then((res) => console.log(res.data))
    .catch((error) => console.error("Error updating question:", error));
};

export const handleDeleteQuestion = (questionId) => {
  api
    .post("/delete_question", { question_id: questionId })
    .then((res) => console.log(res.data))
    .catch((error) => console.error("Error deleting question:", error));
};

// AI Processing Handlers
export const handleProcessThreePDFs = (questionFile, marksheetFile, sourceFile, paperType) => {
  const formData = new FormData();
  formData.append("question", questionFile);
  formData.append("marksheet", marksheetFile);
  formData.append("source", sourceFile);
  formData.append("paper_type", paperType);

  return api
    .post("/process_three_pdfs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((error) => {
      console.error("Error processing PDFs:", error);
      throw error;
    });
};

// Quiz Related Handlers
export const handleGetQuizzes = async () => {
  try {
    const res = await api.get("/get_quizzes");
    return res.data.quiz_list; // <-- return the data properly
  } catch (error) {
    console.error("Error getting quizzes:", error);
    return []; // return empty array so mapping doesn't break
  }
};

export const handleViewQuiz = async (quizId) => {
  try {
    const res = await api.post("/view_quiz", { quiz_id: quizId });
    return res.data; // <-- return the data properly
  } catch (error) {
    console.error("Error getting quizzes:", error);
    return []; // return empty array so mapping doesn't break
  }
};
