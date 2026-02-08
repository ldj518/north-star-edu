// Cloudflare Pages Function - Student Profile
// 真实数据来自【成长教育管家】- 路则昊档案

export const onRequest: PagesFunction = async () => {
  const profile = {
    name: '路则昊',
    school: '山东省济宁市任城区第七中学',
    grade: '初一年级',
    class: '1班',
    classRank: 33,
    classTotal: 47,
    yearRank: 246,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LuZehao',
    semester: '初一上学期',
    status: 'active'
  };

  return new Response(JSON.stringify(profile), {
    headers: { 'Content-Type': 'application/json' }
  });
};
