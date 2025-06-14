
import { ResearchPaper } from '@/types/portalData';

interface BibTeXEntry {
  type: string;
  key: string;
  fields: Record<string, string>;
}

export class BibTeXParser {
  static parse(bibtexContent: string): Omit<ResearchPaper, 'id'>[] {
    const entries = this.extractEntries(bibtexContent);
    return entries.map(entry => this.convertToPaper(entry)).filter(Boolean) as Omit<ResearchPaper, 'id'>[];
  }

  private static extractEntries(content: string): BibTeXEntry[] {
    const entries: BibTeXEntry[] = [];
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let currentEntry: BibTeXEntry | null = null;
    let braceDepth = 0;
    let currentField = '';
    let currentValue = '';
    let inValue = false;

    for (const line of lines) {
      // Skip comments
      if (line.startsWith('%')) continue;

      // Start of new entry
      const entryMatch = line.match(/^@(\w+)\s*\{\s*([^,\s]+)\s*,?/);
      if (entryMatch) {
        if (currentEntry) {
          entries.push(currentEntry);
        }
        currentEntry = {
          type: entryMatch[1].toLowerCase(),
          key: entryMatch[2],
          fields: {}
        };
        continue;
      }

      // End of entry
      if (line === '}' && currentEntry && braceDepth === 0) {
        if (currentField && currentValue) {
          currentEntry.fields[currentField] = this.cleanValue(currentValue);
        }
        entries.push(currentEntry);
        currentEntry = null;
        currentField = '';
        currentValue = '';
        inValue = false;
        continue;
      }

      if (!currentEntry) continue;

      // Field assignment
      const fieldMatch = line.match(/^(\w+)\s*=\s*(.*)/);
      if (fieldMatch && !inValue) {
        if (currentField && currentValue) {
          currentEntry.fields[currentField] = this.cleanValue(currentValue);
        }
        currentField = fieldMatch[1].toLowerCase();
        currentValue = fieldMatch[2];
        inValue = true;
        
        // Handle single-line values
        if (currentValue.endsWith(',')) {
          currentValue = currentValue.slice(0, -1);
          currentEntry.fields[currentField] = this.cleanValue(currentValue);
          currentField = '';
          currentValue = '';
          inValue = false;
        }
        continue;
      }

      // Continue multi-line value
      if (inValue) {
        currentValue += ' ' + line;
        if (line.endsWith(',')) {
          currentValue = currentValue.slice(0, -1);
          currentEntry.fields[currentField] = this.cleanValue(currentValue);
          currentField = '';
          currentValue = '';
          inValue = false;
        }
      }
    }

    // Handle last entry
    if (currentEntry) {
      if (currentField && currentValue) {
        currentEntry.fields[currentField] = this.cleanValue(currentValue);
      }
      entries.push(currentEntry);
    }

    return entries;
  }

  private static cleanValue(value: string): string {
    return value
      .replace(/^\{+|\}+$/g, '') // Remove outer braces
      .replace(/^"+|"+$/g, '') // Remove outer quotes
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private static convertToPaper(entry: BibTeXEntry): Omit<ResearchPaper, 'id'> | null {
    const validTypes = ['article', 'inproceedings', 'conference', 'book', 'incollection', 'techreport'];
    
    if (!validTypes.includes(entry.type)) {
      return null;
    }

    const fields = entry.fields;
    
    // Extract authors
    const authors = fields.author 
      ? fields.author.split(' and ').map(author => author.trim()).filter(Boolean)
      : [];

    // Extract keywords
    const keywords = fields.keywords 
      ? fields.keywords.split(/[,;]/).map(keyword => keyword.trim()).filter(Boolean)
      : [];

    // Determine journal/venue
    let journal = fields.journal || fields.booktitle || fields.venue || 'Unknown';
    
    return {
      title: fields.title || 'Untitled',
      authors,
      journal,
      year: fields.year || 'Unknown',
      doi: fields.doi || undefined,
      abstract: fields.abstract || '',
      keywords,
      citations: 0 // Default to 0 as BibTeX doesn't include citation count
    };
  }
}
