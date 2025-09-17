'use client';

import { answerUserQuestion } from '@/ai/flows/answer-user-questions';
import { compareToStandards } from '@/ai/flows/compare-to-standards';
import { flagRiskyClauses } from '@/ai/flows/flag-risky-clauses';
import { simulateScenario } from '@/ai/flows/simulate-scenarios';
import { suggestNegotiations } from '@/ai/flows/suggest-negotiations';
import { summarizeClause } from '@/ai/flows/summarize-clause';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import type { Clause, DocumentDetails, RiskScore } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  ArrowRight,
  Bot,
  FileText,
  HeartHandshake,
  Loader2,
  Newspaper,
  Scale,
  Search,
  Sparkles,
  User,
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { Logo } from './icons';

// Main Application Component
export function NomikoApp() {
  const [documentDetails, setDocumentDetails] = useState<DocumentDetails | null>(null);
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (details: DocumentDetails) => {
    setIsLoading(true);
    try {
      const results = await flagRiskyClauses({ documentText: details.text });
      const clausesWithIds = results.map((c, index) => ({
        ...c,
        id: crypto.randomUUID(),
      }));
      setClauses(clausesWithIds);
      setDocumentDetails(details);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the document. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDocumentDetails(null);
    setClauses([]);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-headline font-bold">Analyzing Your Document...</h1>
        <p className="text-muted-foreground">The AI is reading every clause, please wait a moment.</p>
      </div>
    );
  }

  if (!documentDetails) {
    return <DocumentUpload onAnalyze={handleAnalyze} />;
  }

  return <AnalysisDashboard documentDetails={documentDetails} clauses={clauses} onReset={handleReset} />;
}

// Document Upload View
function DocumentUpload({ onAnalyze }: { onAnalyze: (details: DocumentDetails) => void }) {
  const [text, setText] = useState('');
  const [type, setType] = useState('rental');
  const [profile, setProfile] = useState('tenant');
  const [jurisdiction, setJurisdiction] = useState('California, USA');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAnalyze({ text, type, profile, jurisdiction });
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full mb-4 font-headline">
          <Sparkles className="w-4 h-4" />
          Powered by Generative AI
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
          Understand Contracts Instantly.
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Nomiko translates complex legal documents into plain English. Upload your contract to flag
          risks, get negotiation guidance, and ask questions.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto mt-10 shadow-2xl shadow-primary/10">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Analyze Your Document</CardTitle>
            <CardDescription>
              Paste your document text below. We&apos;ll break it down clause-by-clause.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea
              placeholder="Paste the full text of your rental agreement, terms of service, or other contract here..."
              className="min-h-[250px] text-base"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="doc-type">Document Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="doc-type">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rental">Rental Agreement</SelectItem>
                    <SelectItem value="loan">Loan Agreement</SelectItem>
                    <SelectItem value="service">Service Agreement</SelectItem>
                    <SelectItem value="tos">Terms of Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="user-profile">Your Role</Label>
                <Select value={profile} onValueChange={setProfile}>
                  <SelectTrigger id="user-profile">
                    <SelectValue placeholder="Select your role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="business-owner">Small Business Owner</SelectItem>
                    <SelectItem value="consumer">Consumer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Input
                  id="jurisdiction"
                  placeholder="e.g., California, USA"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full md:w-auto">
              Analyze Document <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// Risk Indicator Icon
function RiskIcon({ score }: { score?: RiskScore }) {
    if (!score) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="h-3 w-3 rounded-full bg-gray-300" />
            </TooltipTrigger>
            <TooltipContent>
              <p>No Risk Detected</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  
    const scoreMap = {
      '🟢 Low': {
        color: 'bg-green-500',
        text: 'Low Risk',
      },
      '🟡 Medium': {
        color: 'bg-yellow-400',
        text: 'Medium Risk',
      },
      '🔴 High': {
        color: 'bg-destructive',
        text: 'High Risk',
      },
    };
  
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className={cn('h-3 w-3 rounded-full', scoreMap[score].color)} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{scoreMap[score].text}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

// Analysis Dashboard
function AnalysisDashboard({
  documentDetails,
  clauses,
  onReset,
}: {
  documentDetails: DocumentDetails;
  clauses: Clause[];
  onReset: () => void;
}) {
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(
    clauses.find((c) => c.riskAssessment)?.id || null
  );

  const selectedClause = useMemo(
    () => clauses.find((c) => c.id === selectedClauseId),
    [clauses, selectedClauseId]
  );
  
  const handlePrint = () => {
    window.print();
  };

  const riskyClauses = useMemo(() => clauses.filter(c => c.riskAssessment), [clauses]);

  return (
    <div className="print-container">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b no-print">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold font-headline text-lg">Nomiko</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>Export Report</Button>
            <Button onClick={onReset}>Analyze New Document</Button>
          </div>
        </div>
      </header>

      <div className="print-only hidden p-8">
        <h1 className="text-3xl font-bold font-headline mb-2">Contract Analysis Report</h1>
        <p className="text-muted-foreground mb-6">Generated by Nomiko</p>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-headline border-b pb-2">Risk Summary</h2>
          {riskyClauses.length > 0 ? (
            riskyClauses.map(clause => (
              <div key={`print-${clause.id}`} className="p-4 border rounded-lg break-inside-avoid">
                <div className="flex items-center gap-2 mb-2">
                  <RiskIcon score={clause.riskAssessment?.riskScore} />
                  <h3 className="font-bold">{clause.riskAssessment?.riskScore.substring(2)} Risk</h3>
                </div>
                <p className="italic text-muted-foreground mb-2">"{clause.clauseText}"</p>
                <p><span className="font-semibold">Rationale:</span> {clause.riskAssessment?.rationale}</p>
              </div>
            ))
          ) : (
            <p>No significant risks were detected.</p>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto no-print">
            <TabsTrigger value="analysis"><FileText className="w-4 h-4 mr-2" />Clause Analysis</TabsTrigger>
            <TabsTrigger value="qa"><Search className="w-4 h-4 mr-2" />Ask a Question</TabsTrigger>
            <TabsTrigger value="scenarios"><Bot className="w-4 h-4 mr-2" />Simulate Scenarios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ScrollArea className="h-[calc(100vh-12rem)] lg:col-span-1 no-print">
                <div className="pr-4 space-y-2">
                  <h2 className="font-headline font-semibold text-lg p-2">Document Clauses</h2>
                  {clauses.map((clause) => (
                    <button
                      key={clause.id}
                      onClick={() => setSelectedClauseId(clause.id)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg border transition-all',
                        'hover:bg-accent/50 hover:border-accent',
                        selectedClauseId === clause.id
                          ? 'bg-accent/20 border-accent shadow-sm'
                          : 'bg-card'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <RiskIcon score={clause.riskAssessment?.riskScore} />
                        <p className="text-sm text-muted-foreground flex-1">{clause.clauseText}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="lg:col-span-2">
                <ClauseDetails clause={selectedClause} documentDetails={documentDetails} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qa" className="mt-6 max-w-3xl mx-auto">
            <QaPanel documentText={documentDetails.text} />
          </TabsContent>

          <TabsContent value="scenarios" className="mt-6 max-w-3xl mx-auto">
             <ScenarioPanel documentText={documentDetails.text} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Clause Details View
function ClauseDetails({ clause, documentDetails }: { clause?: Clause, documentDetails: DocumentDetails }) {
  if (!clause) {
    return (
      <div className="flex flex-col items-center justify-center text-center rounded-lg border-2 border-dashed h-full min-h-[400px] p-8">
        <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-headline font-semibold">Select a Clause</h3>
        <p className="text-muted-foreground">Choose a clause from the left to see a detailed analysis.</p>
      </div>
    );
  }

  return (
    <Card className="sticky top-20 no-print">
      <CardHeader>
        <CardTitle className="font-headline">Clause Deep Dive</CardTitle>
        <CardDescription className="italic">"{clause.clauseText}"</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary"><Newspaper className="w-4 h-4 mr-2"/>Summary</TabsTrigger>
            <TabsTrigger value="risk" disabled={!clause.riskAssessment}><AlertCircle className="w-4 h-4 mr-2"/>Risk</TabsTrigger>
            <TabsTrigger value="standards"><Scale className="w-4 h-4 mr-2"/>Standards</TabsTrigger>
            <TabsTrigger value="negotiation"><HeartHandshake className="w-4 h-4 mr-2"/>Negotiate</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 text-sm min-h-[200px] p-4 bg-background rounded-md border">
            <TabsContent value="summary"><AnalysisTab contentLoader={() => summarizeClause({ clause: clause.clauseText })} formatter={data => data.summary} /></TabsContent>
            <TabsContent value="risk">
                {clause.riskAssessment && (
                    <div className="space-y-2">
                        <Badge variant="destructive" className="text-base">{clause.riskAssessment.riskScore.substring(2)} Risk</Badge>
                        <p>{clause.riskAssessment.rationale}</p>
                    </div>
                )}
            </TabsContent>
            <TabsContent value="standards"><AnalysisTab contentLoader={() => compareToStandards({ clause: clause.clauseText, documentType: documentDetails.type, jurisdiction: documentDetails.jurisdiction })} formatter={data => (
                <div className="space-y-2">
                    <Badge variant={data.isStandard ? 'secondary' : 'outline'}>{data.isStandard ? "Standard" : "Not Standard"}</Badge>
                    <p><span className="font-semibold">Comparison:</span> {data.comparison}</p>
                    <p><span className="font-semibold">Rationale:</span> {data.rationale}</p>
                </div>
            )} /></TabsContent>
            <TabsContent value="negotiation"><AnalysisTab contentLoader={() => suggestNegotiations({ clauseText: clause.clauseText, documentType: documentDetails.type, userProfile: documentDetails.profile, jurisdiction: documentDetails.jurisdiction })} formatter={data => (
                <div className="space-y-4">
                    <p>{data.rationale}</p>
                    <ul className="list-disc pl-5 space-y-2">
                        {data.negotiationSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            )} /></TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Reusable component for loading AI content in tabs
function AnalysisTab<T>({ contentLoader, formatter }: { contentLoader: () => Promise<T>, formatter: (data: T) => React.ReactNode }) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      setIsLoading(true);
      contentLoader()
        .then(setData)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }, [contentLoader]);
  
    if (isLoading) {
      return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /><span>Analyzing...</span></div>;
    }
  
    if (!data) {
      return <div className="text-destructive">Could not load analysis.</div>;
    }
  
    return <div>{formatter(data)}</div>;
}

// Q&A Panel
function QaPanel({ documentText }: { documentText: string }) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAsk = async () => {
        if (!question.trim()) return;
        setIsLoading(true);
        setAnswer('');
        try {
            const result = await answerUserQuestion({ documentText, userQuestion: question });
            setAnswer(result.answer);
        } catch (error) {
            console.error(error);
            setAnswer('Sorry, I encountered an error trying to answer your question.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Ask a Question</CardTitle>
                <CardDescription>Get answers about your document from an AI assistant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input placeholder="e.g., Can my landlord raise the rent?" value={question} onChange={e => setQuestion(e.target.value)} />
                    <Button onClick={handleAsk} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask'}
                    </Button>
                </div>
                {(isLoading || answer) && (
                    <div className="p-4 bg-background rounded-md border min-h-[100px]">
                        {isLoading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /><span>Finding answer...</span></div>}
                        {answer && <p>{answer}</p>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Scenario Simulation Panel
function ScenarioPanel({ documentText }: { documentText: string }) {
    const [scenario, setScenario] = useState('');
    const [result, setResult] = useState<{ outcome: string; riskLevel: string; rationale: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSimulate = async () => {
        if (!scenario.trim()) return;
        setIsLoading(true);
        setResult(null);
        try {
            const simResult = await simulateScenario({ documentText, scenario });
            setResult(simResult);
        } catch (error) {
            console.error(error);
            setResult({ outcome: 'Simulation failed.', riskLevel: '🔴 High', rationale: 'An error occurred during simulation.'});
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Simulate Scenarios</CardTitle>
                <CardDescription>Understand potential outcomes by simulating "what if" situations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input placeholder="e.g., What if I default on payments?" value={scenario} onChange={e => setScenario(e.target.value)} />
                    <Button onClick={handleSimulate} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simulate'}
                    </Button>
                </div>
                {isLoading && (
                    <div className="p-4 bg-background rounded-md border flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /><span>Running simulation...</span></div>
                )}
                {result && (
                    <Card className="bg-background">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">Outcome <RiskIcon score={result.riskLevel as RiskScore} /></CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div>
                                <h4 className="font-semibold">Predicted Outcome</h4>
                                <p className="text-muted-foreground">{result.outcome}</p>
                           </div>
                           <div>
                                <h4 className="font-semibold">Rationale</h4>
                                <p className="text-muted-foreground">{result.rationale}</p>
                           </div>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}
