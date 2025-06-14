import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePortalData } from '@/hooks/usePortalData';
import { ResearchPaper } from '@/types/portalData';
import { toast } from '@/hooks/use-toast';
import { BibTeXParser } from '@/utils/bibtexParser';
import { Plus, Edit, Trash2, Save, X, Upload, FileText } from 'lucide-react';

const ResearchEditor = () => {
  const { data, createItem, updateItem, deleteItem } = usePortalData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [formData, setFormData] = useState<Partial<ResearchPaper>>({});

  // Sync form data when editing an existing item
  useEffect(() => {
    if (editingId && data?.research) {
      const item = data.research.find(paper => paper.id === editingId);
      if (item) {
        setFormData(item);
      }
    }
  }, [editingId, data?.research]);

  const handleSave = () => {
    try {
      if (editingId) {
        updateItem('research', editingId, formData);
        toast({
          title: "Research Paper Updated",
          description: "Research paper has been updated successfully.",
        });
      } else {
        createItem('research', formData as Omit<ResearchPaper, 'id'>);
        toast({
          title: "Research Paper Added",
          description: "New research paper has been added successfully.",
        });
      }
      resetForm();
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Failed to save research paper.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this research paper?')) {
      try {
        deleteItem('research', id);
        toast({
          title: "Research Paper Deleted",
          description: "Research paper has been deleted successfully.",
        });
      } catch (err) {
        toast({
          title: "Delete Failed",
          description: "Failed to delete research paper.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.bib')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a .bib file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const papers = BibTeXParser.parse(content);

        if (papers.length === 0) {
          toast({
            title: "No Papers Found",
            description: "No valid research papers found in the BibTeX file.",
            variant: "destructive",
          });
          return;
        }

        // Create all papers
        let successCount = 0;
        papers.forEach(paper => {
          try {
            createItem('research', paper);
            successCount++;
          } catch (err) {
            console.error('Failed to create paper:', err);
          }
        });

        toast({
          title: "Bulk Upload Complete",
          description: `Successfully uploaded ${successCount} out of ${papers.length} research papers.`,
        });

        setShowBulkUpload(false);
        // Reset file input
        if (event.target) {
          event.target.value = '';
        }
      } catch (err) {
        toast({
          title: "Upload Failed",
          description: "Failed to parse BibTeX file. Please check the file format.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
  };

  const startEdit = (item: ResearchPaper) => {
    setFormData(item);
    setEditingId(item.id);
    setShowAddForm(false);
  };

  const startAdd = () => {
    setFormData({
      title: '',
      authors: [],
      journal: '',
      year: '',
      doi: '',
      abstract: '',
      keywords: [],
      citations: 0
    });
    setEditingId(null);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowAddForm(false);
  };

  const addArrayItem = (field: 'authors' | 'keywords', value: string) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] || []), value.trim()]
      });
    }
  };

  const removeArrayItem = (field: 'authors' | 'keywords', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field]?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Research Papers Management</h3>
        <div className="flex space-x-2">
          <Button onClick={() => setShowBulkUpload(true)} variant="outline" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Bulk Upload (BibTeX)</span>
          </Button>
          <Button onClick={startAdd} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Research Paper</span>
          </Button>
        </div>
      </div>

      {showBulkUpload && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Bulk Upload Research Papers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Upload a BibTeX (.bib) file to automatically import multiple research papers. 
                The system will parse the file and create entries for all valid papers found.
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".bib"
                  onChange={handleBulkUpload}
                  className="hidden"
                  id="bibtex-upload"
                />
                <label
                  htmlFor="bibtex-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Click to upload BibTeX file
                  </span>
                  <span className="text-xs text-gray-500">
                    Supports .bib files
                  </span>
                </label>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowBulkUpload(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(showAddForm || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Research Paper' : 'Add New Research Paper'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Research paper title"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Journal</label>
                <Input
                  value={formData.journal || ''}
                  onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                  placeholder="Journal name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Year</label>
                <Input
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2023"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">DOI (Optional)</label>
                <Input
                  value={formData.doi || ''}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  placeholder="10.1000/xyz123"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Citations</label>
                <Input
                  type="number"
                  value={formData.citations || 0}
                  onChange={(e) => setFormData({ ...formData, citations: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Abstract</label>
              <Textarea
                value={formData.abstract || ''}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                placeholder="Research paper abstract"
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Authors</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="Add author name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addArrayItem('authors', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button 
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addArrayItem('authors', input.value);
                    input.value = '';
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.authors?.map((author, index) => (
                  <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    <span>{author}</span>
                    <button
                      onClick={() => removeArrayItem('authors', index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Keywords</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="Add keyword"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addArrayItem('keywords', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button 
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addArrayItem('keywords', input.value);
                    input.value = '';
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords?.map((keyword, index) => (
                  <div key={index} className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    <span>{keyword}</span>
                    <button
                      onClick={() => removeArrayItem('keywords', index)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {data?.research?.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <p className="text-blue-600 font-medium">{item.journal}</p>
                  <p className="text-gray-600">{item.year} • {item.citations} citations</p>
                  <p className="text-gray-700 mt-2 line-clamp-2">{item.abstract}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.authors.slice(0, 3).map((author, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {author}
                      </span>
                    ))}
                    {item.authors.length > 3 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        +{item.authors.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResearchEditor;
