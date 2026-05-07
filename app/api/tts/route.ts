import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { ttsRequestSchema } from "@/lib/validations";
import { ttsRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Text-to-speech is not configured." },
        { status: 503 }
      );
    }

    const ip = getClientIp(req);
    const { success } = await ttsRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = ttsRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const client = new ElevenLabsClient({ apiKey });

    // "Adam" voice — change to your preferred voice ID
    const voiceId =
      parsed.data.voiceId ??
      process.env.ELEVENLABS_VOICE_ID ??
      "pNInz6obpgDQGcFmaJgB";

    const audio = await client.textToSpeech.convert(voiceId, {
      text: parsed.data.text,
      model_id: "eleven_turbo_v2_5",
      output_format: "mp3_44100_128",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
      },
    });

    const chunks: Uint8Array[] = [];
    for await (const chunk of audio) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[/api/tts]", err);
    const status =
      err instanceof Error && err.message.includes("Status code: 401")
        ? 401
        : 500;

    return NextResponse.json({ error: "TTS failed" }, { status });
  }
}
