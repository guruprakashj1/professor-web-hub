
import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

interface QuoteData {
  text: string;
  author: string;
}

const quotes: QuoteData[] = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Leadership is not about being in charge. It is about taking care of those in your charge.",
    author: "Simon Sinek"
  },
  {
    text: "A leader is one who knows the way, goes the way, and shows the way.",
    author: "John C. Maxwell"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  }
];

const DynamicQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState<QuoteData>(quotes[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setCurrentQuote(quotes[randomIndex]);
        setIsVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-8 border-t border-gray-200">
      <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-center mb-3">
          <Quote className="w-6 h-6 text-gray-400 mr-2" />
          <span className="text-sm text-gray-500 font-light">Quote of the moment</span>
        </div>
        <blockquote className="text-lg font-light text-gray-700 italic mb-2 max-w-2xl mx-auto">
          "{currentQuote.text}"
        </blockquote>
        <cite className="text-sm text-gray-500 font-medium">
          — {currentQuote.author}
        </cite>
      </div>
    </div>
  );
};

export default DynamicQuotes;
