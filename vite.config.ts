import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GLM-4.7 API Configuration
const GLM_API_KEY = '78d5e5dbf82b44b2b9835c1f65c7236a.qy0oAosWp9VBhClg';
const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// API Handler Plugin for Development
function apiPlugin() {
  return {
    name: 'api-handler',
    configureServer(server: any) {
      // Health check
      server.middlewares.use('/api/health', (_req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          models: ['GLM-4-Flash', 'GLM-4V-Flash (Vision)']
        }));
      });

      // Student Profile API - 真实数据来自教育管家
      server.middlewares.use('/api/student/profile', (_req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          name: '路则昊',
          school: '山东省济宁市任城区第七中学',
          grade: '初一年级',
          class: '1班',
          classRank: 33,
          classTotal: 47,
          yearRank: 246,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LuZehao'
        }));
      });

      // Student Scores API - 期末成绩
      server.middlewares.use('/api/student/scores', (_req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          examName: '初一上学期期末考试',
          examDate: '2026-01',
          totalScore: 456,
          maxTotal: 700,
          classRank: 33,
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
            strengths: ['生物 (83分, 班级19名)', '数学 (80分, 基础扎实)'],
            weaknesses: ['英语 (40分, 需重点突破)', '政治 (48分, 班级38名)'],
            suggestion: '如果英语和政治提升到60分，总分可达488分，排名将大幅提升'
          }
        }));
      });

      // Oracle Chat API - GLM-4.7 AI 对话 (支持文字和图片)
      server.middlewares.use('/api/oracle/chat', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => body += chunk);
        req.on('end', async () => {
          try {
            const { question, image, context = 'general' } = JSON.parse(body);
            
            // System prompts based on context
            const systemPrompts: Record<string, string> = {
              general: `你是「神谕」，一位智慧的AI学习助手。你正在帮助一名初一学生路则昊学习。
请使用苏格拉底式教学法：通过提问引导思考，不直接给出答案。
保持友好、鼓励的语气，让学生感受到学习的乐趣。
如果学生问了与学习无关的问题，温和地引导他回到学习上。`,
              
              homework: `你是「神谕」，正在帮助路则昊批改作业和讲解错题。
对于上传的作业图片：
1. 仔细识别图片中的题目和学生的答案
2. 找出正确和错误的地方
3. 对错误的题目，使用苏格拉底式教学法引导学生思考
4. 不要直接告诉答案，而是通过提问让学生自己发现错误
5. 鼓励学生的努力，建立学习信心`,
              
              review: `你是「神谕」，正在帮助路则昊分析他的作业或答题图片。
请仔细查看图片内容，识别其中的：
1. 题目类型（数学/语文/英语等）
2. 学生的作答内容
3. 可能的正确或错误之处
如果图片不是学习相关的，请礼貌地指出并鼓励学生专注学习。`
            };

            const systemContent = systemPrompts[context] || systemPrompts.general;

            // Build messages array
            const messages: any[] = [
              { role: 'system', content: systemContent }
            ];

            // Handle image analysis with GLM-4V
            if (image) {
              messages.push({
                role: 'user',
                content: [
                  { type: 'image_url', image_url: { url: image } },
                  { type: 'text', text: question || '请分析这张图片，识别其中的内容并给出反馈。' }
                ]
              });
            } else {
              messages.push({ role: 'user', content: question });
            }

            // Choose model based on whether image is present
            const model = image ? 'glm-4v-flash' : 'glm-4-flash';

            const response = await fetch(GLM_API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GLM_API_KEY}`
              },
              body: JSON.stringify({
                model,
                messages,
                temperature: 0.7,
                max_tokens: 1024
              })
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`GLM API error: ${response.status} - ${errorText}`);
            }

            const data = (await response.json()) as any;
            const reply = data.choices?.[0]?.message?.content || '抱歉，我现在无法回答这个问题。';

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              reply,
              model,
              usage: data.usage
            }));
          } catch (error: any) {
            console.error('Oracle API Error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: error.message || 'Internal server error',
              reply: '神谕暂时无法回应，请稍后再试...'
            }));
          }
        });
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
