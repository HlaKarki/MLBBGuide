'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  ambient_details?: {
    time_of_day: string;
    location: string;
    atmosphere: string;
  };
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/ai/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero_id: "30",
          question: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage = {
        role: 'assistant' as const,
        content: data.content[0].text,
        ambient_details: data.ambient_details,
      };
      setMessages(prev => [...prev, aiMessage]);
      queryClient.invalidateQueries({ queryKey: ['chat-history'] }).catch(console.error);
    },
    onError: () => {
      const errorMessage = {
        role: 'assistant' as const,
        content: "The mystical energies are disturbed. Please seek wisdom again shortly.",
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    mutate(input);
    setInput('');
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-gray-900/80 backdrop-blur-sm border-violet-500/20 p-6">
          <div className="flex items-center gap-4 mb-6">
            <MessageSquare className="w-8 h-8 text-violet-400" />
            <h1 className="text-2xl font-bold text-violet-200">
              The Ancient Chronicler
            </h1>
          </div>

          <ScrollArea className="h-[500px] mb-4 pr-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {message.role === 'assistant' && message.ambient_details && (
                  <div className="text-sm text-violet-400/60 mb-1 italic">
                    {message.ambient_details.time_of_day},{' '}
                    {message.ambient_details.location}...
                    {message.ambient_details.atmosphere}
                  </div>
                )}
                <div
                  className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
            {isPending && (
              <div className="text-violet-400 text-sm animate-pulse">
                The Ancient Chronicler is consulting the scrolls...
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about a hero's tale..."
              className="bg-gray-800 border-violet-500/20 focus:border-violet-500"
            />
            <Button
              type="submit"
              disabled={isPending || !input.trim()}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
