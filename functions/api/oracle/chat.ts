// Cloudflare Pages Function - Oracle AI Chat
// 使用 GLM-4.7 API 进行 AI 对话和图片分析

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
      question?: string;
      image?: string;
      context?: string;
    };
    
    const { question, image, context: chatContext = 'general' } = body;

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

    const systemContent = systemPrompts[chatContext] || systemPrompts.general;

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
