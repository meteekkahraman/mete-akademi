// client/src/components/QuestionTracker.jsx
import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';

// Alt Bileşenler (questions klasöründen)
import QuestionForm from './questions/QuestionForm';
import QuestionChart from './questions/QuestionChart';
import RecentQuestions from './questions/RecentQuestions';

export default function QuestionTracker({ currentUser }) {
  const [questions, setQuestions] = useState([]);
  const [filterLesson, setFilterLesson] = useState('TÜM DERSLER');

  useEffect(() => { fetchQuestions(); }, [currentUser]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`https://mete-akademi.onrender.com/api/questions?username=${currentUser}`);
      if (res.ok) setQuestions(await res.json());
    } catch (error) { console.error("Veri hatası:", error); }
  };

  const getTodayString = () => new Date().toLocaleDateString('tr-TR');

  const handleAddQuestion = async (qLesson, qTopic, countVal) => {
    // GÜNLÜK TOPLAM KONTROLÜ
    const todayStr = getTodayString();
    const todayEntries = questions.filter(q => {
      let dbDateStr = q.date || (q.timestamp ? new Date(q.timestamp).toLocaleDateString('tr-TR') : "");
      return q.lesson === qLesson && q.topic === qTopic && dbDateStr === todayStr;
    });

    const currentDailyTotal = todayEntries.reduce((acc, curr) => acc + Number(curr.count), 0);
    
    if (currentDailyTotal + countVal > 120) {
      const remaining = 120 - currentDailyTotal;
      return alert(`⚠️ GÜNLÜK LİMİT DOLDU!\n"${qTopic}" için kalan hakkın: ${remaining > 0 ? remaining : 0}`);
    }

    try {
      const res = await fetch('https://mete-akademi.onrender.com/api/questions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser, lesson: qLesson, topic: qTopic, count: countVal, date: todayStr, timestamp: new Date().toISOString() })
      });
      if (res.ok) { fetchQuestions(); alert("✅ Kayıt Başarılı!"); }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Silinsin mi?")) return;
    await fetch(`https://mete-akademi.onrender.com/api/questions/${id}`, { method: 'DELETE' });
    fetchQuestions();
  };

  // GRAFİK VERİSİ HAZIRLAMA
  const filteredQuestions = questions.filter(q => filterLesson === 'TÜM DERSLER' ? true : q.lesson === filterLesson);
  const currentMonth = new Date().getMonth();
  const monthlyQuestions = filteredQuestions.filter(q => (q.timestamp ? new Date(q.timestamp) : new Date()).getMonth() === currentMonth);
  const totalQuestions = monthlyQuestions.reduce((acc, curr) => acc + curr.count, 0);

  const chartDataRaw = {};
  monthlyQuestions.forEach(q => {
    const dateKey = q.date || new Date().toLocaleDateString('tr-TR');
    const shortDate = dateKey.substring(0, 5); 
    if (!chartDataRaw[shortDate]) chartDataRaw[shortDate] = { total: 0, details: [] };
    chartDataRaw[shortDate].total += q.count;
    chartDataRaw[shortDate].details.push({ lesson: q.lesson, topic: q.topic, count: q.count });
  });
  const chartData = Object.keys(chartDataRaw).map(date => ({ name: date, soru: chartDataRaw[date].total, details: chartDataRaw[date].details }));

  return (
    <div style={{ width: '100%', color: 'white' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#8b5cf6', display: 'flex', gap: '10px' }}><Target /> Soru Takip & Analiz</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* SOL KOLON: Form ve Liste */}
        <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
          <QuestionForm currentUser={currentUser} onAddQuestion={handleAddQuestion} />
          <RecentQuestions questions={questions} onDelete={handleDelete} />
        </div>

        {/* SAĞ KOLON: Grafik */}
        <QuestionChart 
          chartData={chartData} 
          totalQuestions={totalQuestions} 
          filterLesson={filterLesson} 
          setFilterLesson={setFilterLesson} 
        />
      </div>
    </div>
  );
}