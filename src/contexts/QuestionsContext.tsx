import React, { createContext, useContext, useState } from "react";

export interface QAReply {
  id: string;
  text: string;
  imageUri?: string;
  pdf?: { name: string; uri: string };
  createdAt: string;
}
export interface QAItem {
  id: string;
  question: string;
  replies: QAReply[];
  isDefault?: boolean;
}

interface QuestionsCtx {
  questions: QAItem[];
  addQuestion: (q: string) => void;
  addReply: (id: string, r: Omit<QAReply,"id"|"createdAt">) => void;
  deleteQuestion: (id: string) => void;
}

const QuestionsContext = createContext<QuestionsCtx | null>(null);

export const QuestionsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [questions, setQuestions] = useState<QAItem[]>([
    { id: "seed-1", question: "Quels sont les activités de C2PK ?", replies: [], isDefault: true },
    { id: "seed-2", question: "À quoi sert le produit de C2PK ?", replies: [], isDefault: true },
  ]);

  const addQuestion = (q: string) =>
    setQuestions(prev => [{ id: Date.now().toString(), question: q.trim(), replies: [] }, ...prev]);

  const addReply = (id: string, r: Omit<QAReply,"id"|"createdAt">) =>
    setQuestions(prev =>
      prev.map(q =>
        q.id === id
          ? { ...q, replies: [{ id: Date.now().toString(), createdAt: new Date().toISOString(), ...r }, ...q.replies] }
          : q
      )
    );

  const deleteQuestion = (id: string) =>
    setQuestions(prev => prev.filter(q => !q.isDefault && q.id !== id));

  return (
    <QuestionsContext.Provider value={{ questions, addQuestion, addReply, deleteQuestion }}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const ctx = useContext(QuestionsContext);
  if (!ctx) throw new Error("useQuestions must be inside QuestionsProvider");
  return ctx;
};