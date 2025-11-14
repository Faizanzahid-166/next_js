import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
  
    const result = streamText({
      model: openai('gpt-4o'),
      messages: convertToModelMessages(messages),
    });
  
    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
        const {name, status, message, headers} = error
        return NextResponse.json({
            name, status, message, headers
        },{status})
    }else{
        console.error("unexecpted error", error);
        throw error
    }
  }
}