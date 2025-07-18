import React, { useState } from 'react';
import { runAlgorithmTests, analyzeWeightDistribution, generateAlgorithmAnalysisReport, generateComprehensiveTestMatrix, testWithSpecificInputs } from '../utils/algorithmTester';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const AlgorithmTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [weightAnalysis, setWeightAnalysis] = useState<any[]>([]);
  const [fullReport, setFullReport] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('standard-tests');
  const [comprehensiveResults, setComprehensiveResults] = useState<any[]>([]);
  const [allCareers, setAllCareers] = useState<{ title: string, count: number }[]>([]);
  const [matchCounts, setMatchCounts] = useState<{ range: string, count: number }[]>([]);
  const [customTestInput, setCustomTestInput] = useState<string>('{\n  "interests": [\n    {"interest": "technology", "percentage": 90},\n    {"interest": "business", "percentage": 80}\n  ],\n  "workStyle": {\n    "independent": 80,\n    "creative": 70\n  }\n}');
  const [customTestResults, setCustomTestResults] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Run standard algorithm tests
  const runTests = () => {
    setLoading(true);
    try {
      // Use setTimeout to prevent UI blocking
      setTimeout(() => {
        const results = runAlgorithmTests();
        setTestResults(results);
        setLoading(false);
      }, 100);
    } catch (error) {
      console.error('Error running tests:', error);
      setLoading(false);
      setErrorMsg('Error running tests. See console for details.');
    }
  };

  // Run weight distribution analysis
  const runWeightAnalysis = () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const analysis = analyzeWeightDistribution();
        setWeightAnalysis(analysis);
        setLoading(false);
      }, 100);
    } catch (error) {
      console.error('Error analyzing weights:', error);
      setLoading(false);
      setErrorMsg('Error analyzing weight distribution. See console for details.');
    }
  };

  // Generate full algorithm analysis report
  const generateFullReport = () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const report = generateAlgorithmAnalysisReport();
        setFullReport(report);
        setLoading(false);
      }, 100);
    } catch (error) {
      console.error('Error generating report:', error);
      setLoading(false);
      setErrorMsg('Error generating full report. See console for details.');
    }
  };

  // Run comprehensive test matrix
  const runComprehensiveTests = () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const results = generateComprehensiveTestMatrix(100); // Run 100 tests
        setComprehensiveResults(results);
        
        // Analyze the distribution of top careers
        const careerCounts: Record<string, number> = {};
        results.forEach(result => {
          const career = result.actualTopCareer;
          careerCounts[career] = (careerCounts[career] || 0) + 1;
        });
        
        // Sort by frequency
        const sortedCareers = Object.entries(careerCounts)
          .map(([title, count]) => ({ title, count }))
          .sort((a, b) => b.count - a.count);
        
        setAllCareers(sortedCareers);
        
        // Analyze match percentage ranges
        const ranges: Record<string, number> = {
          '90-100%': 0,
          '80-89%': 0,
          '70-79%': 0,
          '60-69%': 0,
          '50-59%': 0,
          '40-49%': 0,
          '30-39%': 0,
          '20-29%': 0,
          '10-19%': 0,
          '0-9%': 0
        };
        
        results.forEach(result => {
          const match = result.actualTopMatch;
          if (match >= 90) ranges['90-100%']++;
          else if (match >= 80) ranges['80-89%']++;
          else if (match >= 70) ranges['70-79%']++;
          else if (match >= 60) ranges['60-69%']++;
          else if (match >= 50) ranges['50-59%']++;
          else if (match >= 40) ranges['40-49%']++;
          else if (match >= 30) ranges['30-39%']++;
          else if (match >= 20) ranges['20-29%']++;
          else if (match >= 10) ranges['10-19%']++;
          else ranges['0-9%']++;
        });
        
        const matchCountsArray = Object.entries(ranges)
          .map(([range, count]) => ({ range, count }))
          .sort((a, b) => {
            // Extract the lower bound of each range for sorting
            const aLower = parseInt(a.range.split('-')[0]);
            const bLower = parseInt(b.range.split('-')[0]);
            return bLower - aLower;
          });
        
        setMatchCounts(matchCountsArray);
        setLoading(false);
      }, 100);
    } catch (error) {
      console.error('Error running comprehensive tests:', error);
      setLoading(false);
      setErrorMsg('Error running comprehensive tests. See console for details.');
    }
  };

  // Run a custom test with specific inputs
  const runCustomTest = () => {
    setErrorMsg('');
    setLoading(true);
    try {
      // Parse the JSON input
      const inputs = JSON.parse(customTestInput);
      
      setTimeout(() => {
        const results = testWithSpecificInputs(inputs);
        setCustomTestResults(results);
        setLoading(false);
      }, 100);
    } catch (error) {
      console.error('Error running custom test:', error);
      setLoading(false);
      setErrorMsg('Error parsing JSON input or running custom test. Please check your input format.');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Career Matching Algorithm Test</h1>
      
      {errorMsg && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="standard-tests" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="standard-tests">Standard Tests</TabsTrigger>
          <TabsTrigger value="weight-analysis">Weight Analysis</TabsTrigger>
          <TabsTrigger value="comprehensive-tests">Comprehensive Tests</TabsTrigger>
          <TabsTrigger value="custom-test">Custom Test</TabsTrigger>
          <TabsTrigger value="full-report">Full Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standard-tests">
          <Card>
            <CardHeader>
              <CardTitle>Standard Algorithm Tests</CardTitle>
              <CardDescription>
                Run predefined test cases to validate algorithm accuracy for various career profiles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Test Results Summary</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Total Tests:</span> {testResults.length}
                      </div>
                      <div>
                        <span className="font-medium">Passed:</span> {testResults.filter(r => r.passed).length}
                      </div>
                      <div>
                        <span className="font-medium">Failed:</span> {testResults.filter(r => !r.passed).length}
                      </div>
                      <div>
                        <span className="font-medium">Success Rate:</span> {((testResults.filter(r => r.passed).length / testResults.length) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Detailed Test Results</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Top Career</TableHead>
                          <TableHead>Match %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testResults.map((result, index) => (
                          <TableRow key={index} className={result.passed ? '' : 'bg-red-50'}>
                            <TableCell>{result.testName}</TableCell>
                            <TableCell>
                              {result.passed ? 
                                <span className="text-green-600 font-semibold">PASSED</span> : 
                                <span className="text-red-600 font-semibold">FAILED</span>
                              }
                            </TableCell>
                            <TableCell>{result.actualTopCareer}</TableCell>
                            <TableCell>{result.actualTopMatch}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No test results yet. Click the button below to run the tests.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={runTests} disabled={loading}>
                {loading ? 'Running Tests...' : 'Run Algorithm Tests'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="weight-analysis">
          <Card>
            <CardHeader>
              <CardTitle>Weight Distribution Analysis</CardTitle>
              <CardDescription>
                Analyze how different factors contribute to career match scores across career types.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {weightAnalysis.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Weight Distribution by Career</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Career</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Work Style</TableHead>
                        <TableHead>Cognitive</TableHead>
                        <TableHead>Social</TableHead>
                        <TableHead>Motivation</TableHead>
                        <TableHead>Mini-Game</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weightAnalysis.map((analysis, index) => (
                        <TableRow key={index}>
                          <TableCell>{analysis.careerTitle}</TableCell>
                          <TableCell>{analysis.interestWeight.toFixed(1)}%</TableCell>
                          <TableCell>{analysis.workStyleWeight.toFixed(1)}%</TableCell>
                          <TableCell>{analysis.cognitiveWeight.toFixed(1)}%</TableCell>
                          <TableCell>{analysis.socialWeight.toFixed(1)}%</TableCell>
                          <TableCell>{analysis.motivationWeight.toFixed(1)}%</TableCell>
                          <TableCell>{analysis.miniGameWeight.toFixed(1)}%</TableCell>
                          <TableCell>{analysis.totalScore.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Weight Distribution Visualization</h3>
                    <div className="space-y-4">
                      {weightAnalysis.map((analysis, index) => (
                        <div key={index} className="border p-4 rounded-lg">
                          <div className="font-semibold mb-2">{analysis.careerTitle}</div>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Interest Alignment</span>
                                <span>{analysis.interestWeight.toFixed(1)}%</span>
                              </div>
                              <Progress value={analysis.interestWeight} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Work Style</span>
                                <span>{analysis.workStyleWeight.toFixed(1)}%</span>
                              </div>
                              <Progress value={analysis.workStyleWeight} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Cognitive Strengths</span>
                                <span>{analysis.cognitiveWeight.toFixed(1)}%</span>
                              </div>
                              <Progress value={analysis.cognitiveWeight} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Social Traits</span>
                                <span>{analysis.socialWeight.toFixed(1)}%</span>
                              </div>
                              <Progress value={analysis.socialWeight} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Motivation</span>
                                <span>{analysis.motivationWeight.toFixed(1)}%</span>
                              </div>
                              <Progress value={analysis.motivationWeight} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Mini-Game Performance</span>
                                <span>{analysis.miniGameWeight.toFixed(1)}%</span>
                              </div>
                              <Progress value={analysis.miniGameWeight} className="h-2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No weight analysis results yet. Click the button below to run the analysis.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={runWeightAnalysis} disabled={loading}>
                {loading ? 'Analyzing...' : 'Run Weight Analysis'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="comprehensive-tests">
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Algorithm Tests</CardTitle>
              <CardDescription>
                Run a large number of randomized tests to validate algorithm behavior across different input combinations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {comprehensiveResults.length > 0 ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Career Distribution in Top Matches</h3>
                    <p className="text-sm text-gray-500 mb-4">This shows which careers are most commonly matched as the top result across all test cases.</p>
                    
                    <div className="space-y-2">
                      {allCareers.slice(0, 10).map((career, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span>{career.title}</span>
                            <span>{career.count} matches ({((career.count / comprehensiveResults.length) * 100).toFixed(1)}%)</span>
                          </div>
                          <Progress 
                            value={(career.count / comprehensiveResults.length) * 100} 
                            className="h-2" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Match Percentage Distribution</h3>
                    <p className="text-sm text-gray-500 mb-4">This shows the distribution of match percentages across all test cases.</p>
                    
                    <div className="space-y-2">
                      {matchCounts.map((range, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span>{range.range}</span>
                            <span>{range.count} matches ({((range.count / comprehensiveResults.length) * 100).toFixed(1)}%)</span>
                          </div>
                          <Progress 
                            value={(range.count / comprehensiveResults.length) * 100} 
                            className="h-2" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sample Results (First 10)</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test ID</TableHead>
                          <TableHead>Top Career</TableHead>
                          <TableHead>Match %</TableHead>
                          <TableHead>Other Top Matches</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {comprehensiveResults.slice(0, 10).map((result, index) => (
                          <TableRow key={index}>
                            <TableCell>{result.testId}</TableCell>
                            <TableCell>{result.actualTopCareer}</TableCell>
                            <TableCell>{result.actualTopMatch}%</TableCell>
                            <TableCell>{result.actualTop5.slice(1, 3).join(", ")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    No comprehensive test results yet. Click the button below to run tests with randomized inputs.
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Note: This will run 100 tests with varied inputs to analyze algorithm behavior across different scenarios.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={runComprehensiveTests} disabled={loading}>
                {loading ? 'Running Tests...' : 'Run Comprehensive Tests'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom-test">
          <Card>
            <CardHeader>
              <CardTitle>Custom Algorithm Test</CardTitle>
              <CardDescription>
                Test the algorithm with your own custom inputs to see how specific combinations affect results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Custom Test Inputs (JSON format)
                </label>
                <Textarea
                  value={customTestInput}
                  onChange={(e) => setCustomTestInput(e.target.value)}
                  rows={10}
                  placeholder="Enter JSON test input..."
                  className="w-full font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a JSON object with test inputs. You can specify values for workStyle, cognitive, personality, interests, motivation, and miniGameMetrics.
                </p>
              </div>
              
              {customTestResults.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Custom Test Results</h3>
                  <div className="space-y-4">
                    {customTestResults.map((result, index) => (
                      <Card key={index} className={index === 0 ? "border-green-400" : ""}>
                        <CardHeader className={index === 0 ? "bg-green-50" : ""}>
                          <CardTitle className="text-base flex justify-between">
                            <span>#{index + 1}: {result.title}</span>
                            <span className="text-lg font-bold">{result.match}%</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{result.description}</p>
                          <div className="mt-2">
                            <span className="text-sm font-medium">Category:</span> {result.category}
                          </div>
                          <div className="mt-1">
                            <span className="text-sm font-medium">Key Skills:</span> {result.skills.join(", ")}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={runCustomTest} disabled={loading}>
                {loading ? 'Testing...' : 'Run Custom Test'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="full-report">
          <Card>
            <CardHeader>
              <CardTitle>Full Algorithm Analysis Report</CardTitle>
              <CardDescription>
                Generate a comprehensive report analyzing all aspects of the career matching algorithm.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fullReport ? (
                <div>
                  <Textarea
                    value={fullReport}
                    readOnly
                    rows={20}
                    className="w-full font-mono text-sm whitespace-pre-wrap"
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No report generated yet. Click the button below to generate a full analysis report.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={generateFullReport} disabled={loading}>
                {loading ? 'Generating Report...' : 'Generate Full Report'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlgorithmTest;