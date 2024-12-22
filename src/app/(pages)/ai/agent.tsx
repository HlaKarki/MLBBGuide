import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MessageSquare, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  ambient_details?: {
    time_of_day: string;
    location: string;
    atmosphere: string;
  };
}

export const Agent = ({ messages, isPending, input, setInput, handleSubmit} : {
  messages: Message[];
  isPending: boolean;
  input: string;
  setInput: (input: string) => void;
  handleSubmit: any
}) => {
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
              <Send className="w-4 h-4 text-violet-50" />
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}