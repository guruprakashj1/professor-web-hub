
import { useEffect, useState, useMemo } from 'react';
import WordCloud from 'react-wordcloud';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WordCloudProps {
  text: string;
  title?: string;
}

interface WordFrequency {
  text: string;
  value: number;
}

const ResearchWordCloud = ({ text, title = "Word Cloud" }: WordCloudProps) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Process text to create word frequency data
  const wordData = useMemo(() => {
    if (!text) return [];

    // Common stop words to filter out
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
      'his', 'her', 'its', 'our', 'their', 'from', 'up', 'about', 'into', 'over', 'after'
    ]);

    // Clean and split text into words
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));

    // Count word frequencies
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Convert to array and sort by frequency
    const sortedWords = Object.entries(wordFreq)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50); // Take top 50 words

    return sortedWords;
  }, [text]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.min(800, window.innerWidth - 100),
        height: 400
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const options = {
    colors: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#6B7280', '#9CA3AF'],
    enableTooltip: true,
    deterministic: false,
    fontFamily: 'system-ui',
    fontSizes: [12, 60] as [number, number],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 2,
    rotations: 3,
    rotationAngles: [-90, 0] as [number, number],
    scale: 'sqrt' as const,
    spiral: 'archimedean' as const,
    transitionDuration: 1000,
  };

  if (wordData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center font-light">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground font-light">No text available to generate word cloud</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center font-light">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div style={{ width: dimensions.width, height: dimensions.height }}>
          <WordCloud
            words={wordData}
            options={options}
            size={[dimensions.width, dimensions.height]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchWordCloud;
