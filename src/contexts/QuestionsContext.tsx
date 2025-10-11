import React, { createContext, useContext, useState } from "react";

export interface QAReply {
  id: string;
  text: string;
  imageUri?: string;
  pdf?: { name: string; uri: string };
  createdAt: string;
  isDefault?: boolean; // added
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
  deleteQuestion: (id: string) => void;          // <- must be here
  deleteReply: (questionId: string, replyId: string) => void;
}

const QuestionsContext = createContext<QuestionsCtx | null>(null);

export const QuestionsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [questions, setQuestions] = useState<QAItem[]>([
    {
      id: "seed-1",
      isDefault: true,
      question: "1. Quels sont les principaux risques liés à mon poste de travail ?",
      replies: [
        {
          id: "ans-1",
            isDefault: true,
            createdAt: new Date().toISOString(),
            text:
`Réponse (Texte) :
Les risques varient selon votre poste :

• Risques mécaniques (machines en mouvement, outils coupants).
• Risques chimiques (exposition aux substances dangereuses).
• Risques physiques (bruit, chaleur, chutes de hauteur).`
        }
      ]
    },
    {
      id: "seed-2",
      isDefault: true,
      question: "2. Où puis-je trouver les consignes de sécurité de l’entreprise ?",
      replies: [
        {
          id: "ans-2",
          isDefault: true,
          createdAt: new Date().toISOString(),
          text:
`Réponse (Texte) :
Toutes les consignes de sécurité sont regroupées dans le manuel HSE et affichées aux points stratégiques (salles de repos, ateliers, zones à risque).`
        }
      ]
    }
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

  const deleteReply = (questionId: string, replyId: string) =>
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, replies: q.replies.filter(r => !r.isDefault && r.id !== replyId) }
          : q
      )
    );

  const deleteQuestion = (id: string) =>
    setQuestions(prev =>
      // Keep every default question; remove only the one whose id matches
      prev.filter(q => q.isDefault || q.id !== id)
    );

  return (
    <QuestionsContext.Provider
      value={{ questions, addQuestion, addReply, deleteQuestion, deleteReply }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const ctx = useContext(QuestionsContext);
  if (!ctx) throw new Error("useQuestions must be inside QuestionsProvider");
  return ctx;
};