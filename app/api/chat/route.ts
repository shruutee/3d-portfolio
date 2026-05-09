import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/validations";
import { chatRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are an AI assistant for a Software Development Engineer's portfolio. 
You answer questions about their skills, projects, and experience concisely. 
Keep answers under 120 words. Be friendly, sharp, and professional.`;

function localPortfolioReply(input: string) {
  const text = input.toLowerCase();

  if (text.includes("project")) {
    return "Shruti builds polished web experiences with React, Next.js, TypeScript, 3D UI, and AI features. You can explore the Projects section for the strongest examples and use the contact form to discuss a specific opportunity.";
  }

  if (text.includes("skill") || text.includes("tech") || text.includes("stack")) {
    return "Shruti's core stack includes Java, DSA, React, Next.js, TypeScript, AI integrations, and modern frontend engineering. She focuses on clean UI, performance, and thoughtful user experience.";
  }

  if (text.includes("contact") || text.includes("email") || text.includes("hire")) {
    return "You can contact Shruti through the form on this page or directly at shruti100905@gmail.com. She is open to internships, collaborations, and software engineering opportunities.";
  }

  return "Hi, I am Shruti's portfolio assistant. Ask me about her skills, projects, experience, or how to contact her, and I will keep it concise.";
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const { success, limit, remaining } = await chatRateLimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429, headers: { "X-RateLimit-Remaining": String(remaining), "X-RateLimit-Limit": String(limit) } }
      );
    }

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      const last = parsed.data.messages.at(-1)?.content ?? "";
      return new Response(localPortfolioReply(last), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }

    const anthropic = new Anthropic({ apiKey });

    const stream = await anthropic.messages.stream({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: parsed.data.messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
