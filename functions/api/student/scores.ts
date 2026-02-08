// Cloudflare Pages Function - Student Scores
// 真实成绩数据来自【成长教育管家】- 初一上学期期末考试

export const onRequest: PagesFunction = async () => {
  const scores = {
    examName: '初一上学期期末考试',
    examDate: '2026-01',
    totalScore: 456,
    maxTotal: 700,
    classRank: 33,
    classTotal: 47,
    subjects: [
      { name: '语文', score: 60, classRank: 26, maxScore: 100, status: 'warning' },
      { name: '数学', score: 80, classRank: 27, maxScore: 100, status: 'good' },
      { name: '英语', score: 40, classRank: 34, maxScore: 100, status: 'critical' },
      { name: '生物', score: 83, classRank: 19, maxScore: 100, status: 'excellent' },
      { name: '政治', score: 48, classRank: 38, maxScore: 100, status: 'critical' },
      { name: '地理', score: 74, classRank: 29, maxScore: 100, status: 'normal' },
      { name: '历史', score: 71, classRank: 24, maxScore: 100, status: 'normal' }
    ],
    analysis: {
      strengths: ['生物 (83分, 班级19名)', '数学 (80分, 基础扎实)', '历史 (71分, 班级24名)'],
      weaknesses: ['英语 (40分, 需重点突破)', '政治 (48分, 班级38名)'],
      suggestion: '如果英语和政治能提升到及格线（各60分），总分可提升32分，达到488分，排名有望大幅提升',
      targetRank: 25,
      gap: 8
    }
  };

  return new Response(JSON.stringify(scores), {
    headers: { 'Content-Type': 'application/json' }
  });
};
