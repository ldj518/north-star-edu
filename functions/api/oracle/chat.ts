// Cloudflare Pages Function - Oracle AI Chat
// 使用 GLM-4.7 API 进行 AI 对话、图片分析和作业批改

interface Env {
  GLM_API_KEY: string;
}

const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { GLM_API_KEY } = context.env;
  
  if (!GLM_API_KEY) {
    return new Response(JSON.stringify({
      error: 'GLM API Key not configured',
      reply: '神谕暂时无法连接，请联系管理员配置 API Key'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await context.request.json() as {
      message?: string;
      question?: string;
      image?: string;
      context?: string;
      studentName?: string;
      taskTitle?: string;
      conversationHistory?: Array<{role: string, content: string}>;
    };
    
    const { 
      message, 
      question, 
      image, 
      context: chatContext = 'general',
      studentName = '同学',
      taskTitle,
      conversationHistory = []
    } = body;

    const userQuestion = message || question || '';

    // System prompts based on context
    const systemPrompts: Record<string, string> = {
      general: `你是「神谕」，一位智慧的AI学习助手。你正在帮助一名初一学生${studentName}学习。
请使用苏格拉底式教学法：通过提问引导思考，不直接给出答案。
保持友好、鼓励的语气，让学生感受到学习的乐趣。
如果学生问了与学习无关的问题，温和地引导他回到学习上。`,
      
      homework_help: `你是「神谕」，正在帮助${studentName}解答学习问题。
请使用苏格拉底式教学法，通过提问引导学生自己找到答案。
不要直接给出答案，而是提供思考方向。
保持鼓励性，每一步都要肯定学生的努力。`,
      
      homework_grading: `你是「神谕」，正在批改${studentName}的作业：「${taskTitle || ''}」。
请分析上传的作业图片，并按照以下格式回复：

**批改结果：**
1. 整体评价：[简短鼓励]
2. 发现的问题：[如果有的话，列出错误点]
3. 错误题目引导：[对第一个错误，用苏格拉底式提问引导]

注意：
- 识别图片中的题目和学生的答案
- 找出错误但不直接给答案
- 使用苏格拉底式提问引导学生
- 多鼓励，少批评
- 保持语气友好`,
      
      socratic_guidance: `你是「神谕」，正在用苏格拉底式教学法引导${studentName}订正错题。
你的目标是让学生自己发现错误并理解正确做法。

**教学方法：**
- 提问而不是讲解
- 引导而不是告知
- 鼓励每一点进步
- 学生答对时要明确肯定和鼓励

**回复策略：**
- 如果学生思路正确，引导他继续深入
- 如果学生仍有困惑，换个角度提问
- 学生理解正确时，明确说"太棒了！"、"你掌握了！"等鼓励语`,
      
      review: `你是「神谕」，正在分析${studentName}的学习内容。
请仔细查看图片，识别题目类型、学生答案和正误情况。`
    };

    const systemContent = systemPrompts[chatContext] || systemPrompts.general;

    // Build messages array
    const messages: any[] = [
      { role: 'system', content: systemContent }
    ];

    // Add conversation history for socratic guidance
    if (chatContext === 'socratic_guidance' && conversationHistory.length > 0) {
      conversationHistory.slice(-4).forEach(msg => {
        messages.push({ role: msg.role, content: msg.content });
      });
    }

    // Handle image analysis with GLM-4V
    if (image) {
      messages.push({
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: image } },
          { type: 'text', text: userQuestion || '请分析这张作业图片，检查答案并给出指导。' }
        ]
      });
    } else {
      messages.push({ role: 'user', content: userQuestion });
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
        temperature: chatContext === 'socratic_guidance' ? 0.8 : 0.7,
        max_tokens: chatContext === 'homework_grading' ? 1500 : 1024
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GLM API Error:', response.status, errorText);
      throw new Error(`GLM API error: ${response.status}`);
    }

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: object;
    };
    const reply = data.choices?.[0]?.message?.content || '抱歉，我现在无法回答这个问题。';

    return new Response(JSON.stringify({ 
      reply,
      model,
      usage: data.usage
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Oracle API Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      reply: '神谕暂时无法回应，请稍后再试...'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
