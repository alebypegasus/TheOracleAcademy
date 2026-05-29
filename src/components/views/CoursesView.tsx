import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { usePlan } from '../../hooks/usePlan';
import { CoursesSaga } from './Courses/CoursesSaga';
import { ModuleRoadmap } from './Courses/ModuleRoadmap';
import { LessonReader } from './Courses/LessonReader';
import { INNER_PATH } from './Courses/constants';

export function CoursesView({ currentUser }: { currentUser?: any }) {
  const { canAccess } = usePlan(currentUser);
  
  // Navigation State
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  
  // Progress State
  const [favorites, setFavorites] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem(`oracle_completed_lessons_${currentUser?.email || 'guest'}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (currentUser) {
      fetch(`/api/courses/progress/1`, {
        headers: { 'x-user-id': currentUser.id.toString(), 'Authorization': `Bearer ${localStorage.getItem('oracle_jwt_token')}` }
      })
      .then(r => r.ok ? r.json() : { completedLessons: [] })
      .then(data => {
        if (data && data.completedLessons) {
          setCompletedLessons(data.completedLessons);
          localStorage.setItem(`oracle_completed_lessons_${currentUser.email}`, JSON.stringify(data.completedLessons));
        }
      })
      .catch(e => console.error(e));
    }
  }, [currentUser?.id]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleNodeClick = (node: any, levelInfo: any) => {
    setSelectedNode({ ...node, levelTitle: levelInfo.title, level: levelInfo.level });
  };

  const handleStartLesson = (step: any, isStepLocked: boolean) => {
    if (isStepLocked) return;
    setSelectedLesson(step);
  };

  const handleCompleteLesson = async (closeAfter: boolean = true) => {
    if (!selectedNode || !selectedLesson) return;
    
    try {
      const token = localStorage.getItem('oracle_jwt_token') || '';
      const res = await fetch("/api/courses/progress/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "x-user-id": currentUser?.id?.toString() || ""
        },
        body: JSON.stringify({
          courseId: "1",
          completedLessons: [...new Set([...completedLessons, `${selectedNode.id}-step-${selectedLesson.id}`])],
          score: 100
        })
      });
      if (res.ok) {
        alert("Sacramento de estudo concluído com sucesso! +30 XP foram incorporados à sua essência cósmica.");
        const stepId = `${selectedNode.id}-step-${selectedLesson.id}`;
        if (!completedLessons.includes(stepId)) {
          const updated = [...completedLessons, stepId];
          setCompletedLessons(updated);
          localStorage.setItem(`oracle_completed_lessons_${currentUser?.email || 'guest'}`, JSON.stringify(updated));
        }
        if (closeAfter) {
          setSelectedLesson(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = INNER_PATH.findIndex(step => step.id === selectedLesson.id);
    if (currentIndex >= 0 && currentIndex < INNER_PATH.length - 1) {
      const nextStep = INNER_PATH[currentIndex + 1];
      const isLocked = !completedLessons.includes(`${selectedNode.id}-step-${selectedLesson.id}`);
      if (!isLocked) {
         setSelectedLesson(nextStep);
      } else {
         alert("Você precisa concluir a lição atual para prosseguir!");
      }
    } else {
      setSelectedLesson(null); // Volta pro roadmap caso tenha chegado no fim
    }
  };

  return (
    <>
      {!selectedNode && !selectedLesson && (
        <CoursesSaga 
          key="courses-saga"
          canAccess={canAccess}
          completedLessons={completedLessons}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          handleNodeClick={handleNodeClick}
        />
      )}

      {selectedNode && !selectedLesson && (
        <ModuleRoadmap 
          key="module-roadmap"
          selectedNode={selectedNode}
          completedLessons={completedLessons}
          handleStartLesson={handleStartLesson}
          onBack={() => setSelectedNode(null)}
        />
      )}

      {selectedNode && selectedLesson && (
        <LessonReader 
          key={`lesson-reader-${selectedLesson.id}`}
          selectedNode={selectedNode}
          selectedLesson={selectedLesson}
          currentUser={currentUser}
          onBack={() => setSelectedLesson(null)}
          onComplete={handleCompleteLesson}
          onNextLesson={handleNextLesson}
        />
      )}
    </>
  );
}
