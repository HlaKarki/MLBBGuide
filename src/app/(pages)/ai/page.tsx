'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { guessHeroName } from '@/app/(pages)/ai/helper';
import { Agent } from '@/app/(pages)/ai/agent';

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
      const guessedName = guessHeroName(message);

      const response = await fetch('/api/ai/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero_id: (guessedName.found && guessedName.hero_id) || -1,
          question: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
    onSuccess: data => {
      const aiMessage = {
        role: 'assistant' as const,
        content: data.content[0].text,
        ambient_details: data.ambient_details,
      };
      setMessages(prev => [...prev, aiMessage]);
      queryClient
        .invalidateQueries({ queryKey: ['chat-history'] })
        .catch(console.error);
    },
    onError: () => {
      const errorMessage = {
        role: 'assistant' as const,
        content:
          'The mystical energies are disturbed. Please seek wisdom again shortly.',
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
    <Agent messages={messages} isPending={isPending} input={input} setInput={setInput} handleSubmit={handleSubmit} />
  );
}
