// Cloudflare Worker - AI恋爱桃花运测评API
// 文件：worker.js

export default {
  async fetch(request, env, ctx) {
    // CORS配置
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 只接受POST请求
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // 解析请求体
    let data;
    try {
      data = await request.json();
    } catch (error) {
      return new Response('Invalid JSON', { status: 400 });
    }

    // 验证必要字段
    const { photo, answers } = data;
    if (!photo || !answers || !answers.q1 || !answers.q2 || !answers.q3) {
      return new Response('缺少必要字段', { status: 400 });
    }

    // 调用AI分析
    try {
      const result = await analyzeFortune(photo, answers, env);
      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      console.error('AI分析错误:', error);
      return new Response('AI分析失败: ' + error.message, { status: 500 });
    }
  }
};

/**
 * 调用火山引擎豆包视觉模型进行桃花运分析
 */
async function analyzeFortune(photoData, answers, env) {
  // 从环境变量获取API Key
  const apiKey = env.VOLC_API_KEY;
  if (!apiKey) {
    throw new Error('未配置VOLC_API_KEY');
  }

  // 构建Prompt
  const prompt = `
你是一位专业的恋爱心理学顾问和形象分析师。请根据用户的照片和回答，生成一份个性化的桃花运分析报告。

【用户照片】
${extractImageInfo(photoData)}

【用户回答】
Q1 理想约会场景：${answers.q1}
Q2 最在意伴侣特质：${answers.q2}
Q3 周末通常怎么过：${answers.q3}

【任务要求】
请分析并生成以下内容：
1. 桃花运指数（0-100的整数）
2. 桃花盛开时间（如：3月-5月，或具体描述）
3. 理想伴侣特征（3个关键词，数组形式）
4. 爱情优势（1段温暖的赞美，50-100字）
5. 小建议（1条实用的建议，30-50字）
6. 分数评价（对分数的简短评价，如"桃花运爆棚！"、"正在升温中"等）

【输出格式】
请严格以JSON格式输出，不要包含其他内容：
{
  "score": 数字,
  "blossomTime": "字符串",
  "partnerTraits": ["关键词1", "关键词2", "关键词3"],
  "loveAdvantage": "字符串",
  "advice": "字符串",
  "scoreComment": "字符串"
}

【分析要点】
- 照片分析：关注气质、亲和力、笑容、精神状态
- 答案分析：结合三个问题的答案推断用户的爱情观和生活方式
- 结果要积极向上，给用户鼓励和希望
- 避免过于具体的外貌评价，注重整体气质和能量场
- 分数建议在60-95之间，让用户感到被认可
  `.trim();

  // 构建API请求
  const url = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
  const requestBody = {
    model: 'doubao-1-5-vision-241128',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: { url: photoData }
          }
        ]
      }
    ],
    temperature: 0.8,
    max_tokens: 800
  };

  // 发送API请求
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API请求失败: ${response.status} - ${errorText}`);
  }

  const responseData = await response.json();
  const aiContent = responseData.choices[0].message.content;

  // 解析AI返回的JSON
  let result;
  try {
    // 尝试直接解析
    result = JSON.parse(aiContent);
  } catch (error) {
    // 如果直接解析失败，尝试提取JSON部分
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      result = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('AI返回格式错误');
    }
  }

  // 验证和标准化结果
  const validatedResult = {
    score: Math.min(100, Math.max(0, parseInt(result.score) || 85)),
    blossomTime: result.blossomTime || '即将到来',
    partnerTraits: Array.isArray(result.partnerTraits) ? result.partnerTraits : ['温柔体贴'],
    loveAdvantage: result.loveAdvantage || '你独特的气质总能吸引到对的人。',
    advice: result.advice || '保持自信，你的魅力会自然绽放。',
    scoreComment: result.scoreComment || getScoreComment(parseInt(result.score) || 85)
  };

  return validatedResult;
}

/**
 * 从base64数据提取图片信息（用于Prompt）
 */
function extractImageInfo(photoData) {
  // 这里只是占位，实际图片信息会在API请求的image_url中传递
  return '[用户照片已附加]';
}

/**
 * 根据分数生成评价
 */
function getScoreComment(score) {
  if (score >= 90) return '🌸 桃花运爆棚！你是爱情的宠儿';
  if (score >= 80) return '✨ 桃花运旺盛！爱情就在不远处';
  if (score >= 70) return '💕 桃花运不错！保持积极心态';
  if (score >= 60) return '💝 桃花运稳步上升中';
  return '🌟 桃花运正在酝酿，美好的爱情即将到来';
}
