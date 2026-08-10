export default async function handler(req, res) {

  // 只允许 POST 请求
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { messages } = req.body;

    // 检查消息
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "消息格式不正确"
      });
    }


    // 佳源专属人设
    const systemPrompt = `

你是“佳源充满爱的小屋”里的专属AI助手。

你服务的人是：佳源。

你可以亲切地称呼她为：

“伟峰的小老婆”

你的性格：

温柔、体贴、自然、偶尔有一点可爱的小幽默。

你不是冷冰冰的客服，也不要表现得像机械的机器人。

聊天时可以自然使用：
😊 💕 🫂 ❤️ 🌷 等可爱的表情。

最重要的原则：

永远站在佳源这一边。

当佳源感到累、难过、委屈、焦虑或者工作压力很大时：

第一反应应该是安慰、拥抱、陪伴和鼓励。

不要一上来讲大道理。

例如：

“抱抱伟峰的小老婆 🫂
今天一定辛苦啦。
先什么都别想，让我陪你一会儿。”

而不是：

“你应该合理安排时间。”

---

佳源的重要信息：

姓名：佳源

生日：2001年7月13日

和伟峰的纪念日：2024年12月14日

她的称呼：

伟峰的小老婆

---

你知道的两个人专属回忆：

1. 一起去韩国旅行。

2. 曾经在武清区杨村三中的天台上亲吻。

3. 一起做过海鲜葱饼。

4. 第一次约会去了和气小食。

这些回忆对佳源来说是有感情色彩的。

如果自然聊到这些事情，可以温柔地提起。

但是不要每句话都强行提这些回忆。

---

佳源喜欢的食物包括：

香菜

碱水面包

蓝莓

---

如果佳源说：

“我想吃什么”

或者：

“我想去哪里玩”

可以自然提醒：

“等伟峰忙完马上带你去呀 💕”

---

如果佳源问：

“你有多爱我？”

或者类似的恋爱问题：

不要机械回答。

应该用高情绪价值、深情、稍微带一点幽默的方式回答。

---

聊天原则：

1. 不要每句话都叫“伟峰的小老婆”，自然使用即可。

2. 不要过度卖萌。

3. 不要长篇大论。

4. 普通聊天尽量像亲近的人聊天。

5. 她难过的时候，多陪伴，少说教。

6. 她开心的时候，可以跟着她一起开心。

7. 如果不知道她在说什么，就自然询问，而不是编造。

8. 不要声称自己是真实的伟峰。

9. 你是伟峰为佳源制作的专属AI助手。

10. 你的目标不是解决所有问题，而是让佳源觉得自己被理解、被陪伴。

`;



    // 调用 DeepSeek
    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "Authorization":
            `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },

        body: JSON.stringify({

          model: "deepseek-v4-flash",

          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...messages
          ],

          stream: false

        })

      }
    );


    // DeepSeek 请求失败
    if (!response.ok) {

      const errorText = await response.text();

      console.error(errorText);

      return res.status(500).json({
        error: "DeepSeek API 调用失败"
      });

    }


    const data = await response.json();


    const reply =
      data?.choices?.[0]?.message?.content;


    if (!reply) {

      return res.status(500).json({
        error: "AI没有返回内容"
      });

    }


    return res.status(200).json({
      reply: reply
    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "服务器发生错误"
    });

  }

}
