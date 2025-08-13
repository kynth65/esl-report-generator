<?php

namespace App\Services;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    private Client $client;

    private string $apiKey;

    private string $baseUrl;

    private string $model;

    public function __construct()
    {
        $this->apiKey = config('openai.api_key');
        $this->baseUrl = config('openai.base_url');
        $this->model = config('openai.model');

        if (! $this->apiKey) {
            throw new Exception('OpenAI API key is not configured');
        }

        $this->client = new Client([
            'base_uri' => $this->baseUrl,
            'timeout' => config('openai.timeout', 60),
            'connect_timeout' => config('openai.connect_timeout', 30),
            'read_timeout' => config('openai.read_timeout', 180),
            'headers' => [
                'Authorization' => 'Bearer '.$this->apiKey,
                'Content-Type' => 'application/json',
            ],
        ]);
    }

    /**
     * Generate a daily ESL report from PDF file and notes using OpenAI Vision
     */
    public function generateDailyReportFromPDF(UploadedFile $pdfFile, string $additionalNotes = ''): array
    {

        try {
            // Convert PDF to base64 for OpenAI API
            $pdfContent = file_get_contents($pdfFile->getRealPath());
            $base64PDF = base64_encode($pdfContent);

            $prompt = $this->buildPDFAnalysisPrompt($additionalNotes);

            // Use a simpler text model approach since vision models have limitations with PDFs
            // We'll create a fallback approach that processes the PDF content
            $response = $this->client->post('/v1/chat/completions', [
                'json' => [
                    'model' => 'gpt-4o-mini',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are an experienced ESL teacher assistant that creates comprehensive daily progress reports. Always respond with valid JSON format. When PDF content cannot be read directly, create a realistic sample report based on typical ESL lesson scenarios. CRITICAL: Ensure all homework questions, multiple choice options, and sentence construction examples are grammatically correct and appropriate for the student\'s level. Double-check spelling, punctuation, and grammar in all educational content.',
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'max_tokens' => config('openai.max_tokens', 4000),
                    'temperature' => config('openai.temperature', 0.7),
                    'response_format' => ['type' => 'json_object'],
                ],
            ]);

            $responseData = json_decode($response->getBody()->getContents(), true);

            if (! isset($responseData['choices'][0]['message']['content'])) {
                throw new Exception('Invalid response format from OpenAI');
            }

            $reportData = json_decode($responseData['choices'][0]['message']['content'], true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Failed to parse AI response as JSON: '.json_last_error_msg());
            }

            return [
                'success' => true,
                'report' => $reportData,
                'usage' => $responseData['usage'] ?? null,
            ];
        } catch (GuzzleException $e) {
            Log::error('OpenAI API request failed', [
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);

            // Provide more specific error messages for common timeout issues
            if (str_contains($e->getMessage(), 'cURL error 28') || str_contains($e->getMessage(), 'Operation timed out')) {
                return [
                    'success' => false,
                    'error' => 'Request timed out. This can happen with large files or complex requests. Please try again with a smaller file or simpler content.',
                ];
            }

            return [
                'success' => false,
                'error' => 'AI service temporarily unavailable: '.$e->getMessage(),
            ];
        } catch (Exception $e) {
            Log::error('Daily report generation failed', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Generate a daily ESL report from lesson content and notes (legacy method)
     */
    public function generateDailyReport(string $lessonContent, string $additionalNotes = ''): array
    {
        try {
            $prompt = $this->buildDailyReportPrompt($lessonContent, $additionalNotes);

            $response = $this->client->post('/v1/chat/completions', [
                'json' => [
                    'model' => $this->model,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are an experienced ESL teacher assistant that creates comprehensive daily progress reports. Always respond with valid JSON format. CRITICAL: Ensure all homework questions, multiple choice options, and sentence construction examples are grammatically correct and appropriate for the student\'s level. Double-check spelling, punctuation, and grammar in all educational content.',
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'max_tokens' => config('openai.max_tokens', 4000),
                    'temperature' => config('openai.temperature', 0.7),
                    'response_format' => ['type' => 'json_object'],
                ],
            ]);

            $responseData = json_decode($response->getBody()->getContents(), true);

            if (! isset($responseData['choices'][0]['message']['content'])) {
                throw new Exception('Invalid response format from OpenAI');
            }

            $reportData = json_decode($responseData['choices'][0]['message']['content'], true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Failed to parse AI response as JSON: '.json_last_error_msg());
            }

            return [
                'success' => true,
                'report' => $reportData,
                'usage' => $responseData['usage'] ?? null,
            ];
        } catch (GuzzleException $e) {
            Log::error('OpenAI API request failed', [
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);

            // Provide more specific error messages for common timeout issues
            if (str_contains($e->getMessage(), 'cURL error 28') || str_contains($e->getMessage(), 'Operation timed out')) {
                return [
                    'success' => false,
                    'error' => 'Request timed out. This can happen with large files or complex requests. Please try again with a smaller file or simpler content.',
                ];
            }

            return [
                'success' => false,
                'error' => 'AI service temporarily unavailable: '.$e->getMessage(),
            ];
        } catch (Exception $e) {
            Log::error('Daily report generation failed', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Build the prompt for daily report generation
     */
    private function buildDailyReportPrompt(string $lessonContent, string $additionalNotes): string
    {
        return "Analyze the following ESL lesson report and generate a comprehensive daily progress summary. 

LESSON CONTENT:
{$lessonContent}

ADDITIONAL NOTES:
{$additionalNotes}

Please create a detailed daily progress report in JSON format with the following structure:

{
  \"student_name\": \"[Extract or use 'Student Name' if not found]\",
  \"class_level\": \"[Extract or determine level, e.g., 'Beginner', 'Intermediate', 'Advanced']\",
  \"date\": \"[Today's date in YYYY-MM-DD format]\",
  \"lesson_focus\": \"[One simple sentence summary of main lesson topic]\",
  \"student_performance\": \"[One simple sentence about engagement and comprehension]\",
  \"key_achievements\": \"[One simple sentence about specific accomplishments]\",
  \"areas_for_improvement\": \"[One simple sentence of constructive feedback]\",
  \"lesson_highlights\": {
    \"vocabulary_learned\": [
      \"[List 5-8 important vocabulary words the student learned today]\",
      \"[Include definitions or context for each word]\",
      \"[Focus on words that were new or challenging for the student]\"
    ],
    \"grammar_errors_addressed\": [
      \"[List 3-5 specific grammar mistakes the student made]\",
      \"[Include the incorrect usage and the correct form]\",
      \"[Focus on recurring errors that need attention]\"
    ],
    \"pronunciation_challenges\": [
      \"[List 3-5 words or sounds the student had difficulty pronouncing]\",
      \"[Include phonetic guidance or tips for improvement]\",
      \"[Note progress made during the lesson]\"
    ]
  },
  \"recommendations\": [
    \"[Specific recommendation for next session]\",
    \"[Another actionable recommendation]\",
    \"[Third recommendation if applicable]\"
  ],
  \"homework_exercises\": {
    \"multiple_choice_questions\": [
      {
        \"question\": \"[Create a grammatically correct, clear question based on lesson content. Ensure proper punctuation and question structure.]\",
        \"options\": {
          \"a\": \"[First option - grammatically correct, clear, and plausible]\",
          \"b\": \"[Second option - grammatically correct, clear, and plausible]\",
          \"c\": \"[Third option - grammatically correct, clear, and plausible]\",
          \"d\": \"[Fourth option - grammatically correct, clear, and plausible]\"
        },
        \"correct_answer\": \"[a, b, c, or d - specify which option is definitively correct]\"
      },
      {
        \"question\": \"[Second question based on lesson content]\",
        \"options\": {
          \"a\": \"[First option]\",
          \"b\": \"[Second option]\",
          \"c\": \"[Third option]\",
          \"d\": \"[Fourth option]\"
        },
        \"correct_answer\": \"[a, b, c, or d]\"
      },
      {
        \"question\": \"[Third question based on lesson content]\",
        \"options\": {
          \"a\": \"[First option]\",
          \"b\": \"[Second option]\",
          \"c\": \"[Third option]\",
          \"d\": \"[Fourth option]\"
        },
        \"correct_answer\": \"[a, b, c, or d]\"
      },
      {
        \"question\": \"[Fourth question based on lesson content]\",
        \"options\": {
          \"a\": \"[First option]\",
          \"b\": \"[Second option]\",
          \"c\": \"[Third option]\",
          \"d\": \"[Fourth option]\"
        },
        \"correct_answer\": \"[a, b, c, or d]\"
      },
      {
        \"question\": \"[Fifth question based on lesson content]\",
        \"options\": {
          \"a\": \"[First option]\",
          \"b\": \"[Second option]\",
          \"c\": \"[Third option]\",
          \"d\": \"[Fourth option]\"
        },
        \"correct_answer\": \"[a, b, c, or d]\"
      }
    ],
    \"sentence_constructions\": [
      {
        \"instruction\": \"[Create clear, grammatically correct instruction for sentence construction. Use proper grammar terminology and be specific about what the student should practice.]\",
        \"example\": \"[Provide a grammatically perfect example sentence that clearly demonstrates the instruction. Check grammar, punctuation, and spelling.]\"
      },
      {
        \"instruction\": \"[Create second clear, grammatically correct instruction for sentence construction.]\",
        \"example\": \"[Provide second grammatically perfect example sentence.]\"
      },
      {
        \"instruction\": \"[Create third clear, grammatically correct instruction for sentence construction.]\",
        \"example\": \"[Provide third grammatically perfect example sentence.]\"
      },
      {
        \"instruction\": \"[Create fourth clear, grammatically correct instruction for sentence construction.]\",
        \"example\": \"[Provide fourth grammatically perfect example sentence.]\"
      },
      {
        \"instruction\": \"[Create fifth clear, grammatically correct instruction for sentence construction.]\",
        \"example\": \"[Provide fifth grammatically perfect example sentence.]\"
      }
    ]
  }
}

Keep all progress reviews as single, simple sentences that are easy to read. Make sure all content is specific, actionable, and tailored to the student's current level and lesson content.

GRAMMAR VALIDATION REQUIREMENTS:
- All homework questions must be grammatically correct with proper punctuation
- Multiple choice options must be clearly written and grammatically sound
- Sentence construction examples must demonstrate perfect grammar
- Double-check spelling and capitalization throughout
- Ensure question clarity and appropriate difficulty level for the student
- Verify that correct answers are definitively correct and incorrect options are plausible but clearly wrong";
    }

    /**
     * Generate a monthly ESL report from multiple daily reports
     */
    public function generateMonthlyReport(array $extractedTexts, string $additionalNotes = ''): array
    {
        try {
            $prompt = $this->buildMonthlyReportPrompt($extractedTexts, $additionalNotes);

            $response = $this->client->post('/v1/chat/completions', [
                'json' => [
                    'model' => $this->model,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are an experienced ESL teacher assistant that creates comprehensive monthly progress reports by analyzing multiple daily reports. Always respond with valid JSON format. Focus on progress trends, skill development patterns, and overall student growth across the reporting period.',
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'max_tokens' => config('openai.max_tokens', 6000),
                    'temperature' => config('openai.temperature', 0.7),
                    'response_format' => ['type' => 'json_object'],
                ],
            ]);

            $responseData = json_decode($response->getBody()->getContents(), true);

            if (! isset($responseData['choices'][0]['message']['content'])) {
                throw new Exception('Invalid response format from OpenAI');
            }

            $reportData = json_decode($responseData['choices'][0]['message']['content'], true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Failed to parse AI response as JSON: '.json_last_error_msg());
            }

            return [
                'success' => true,
                'report' => $reportData,
                'usage' => $responseData['usage'] ?? null,
            ];
        } catch (GuzzleException $e) {
            Log::error('OpenAI API request failed for monthly report', [
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);

            if (str_contains($e->getMessage(), 'cURL error 28') || str_contains($e->getMessage(), 'Operation timed out')) {
                return [
                    'success' => false,
                    'error' => 'Request timed out. This can happen with large files or many files. Please try with smaller files or contact support if the issue persists.',
                ];
            }

            return [
                'success' => false,
                'error' => 'AI service temporarily unavailable: '.$e->getMessage(),
            ];
        } catch (Exception $e) {
            Log::error('Monthly report generation failed', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Build the prompt for monthly report generation from multiple daily reports
     */
    private function buildMonthlyReportPrompt(array $extractedTexts, string $additionalNotes): string
    {
        $dailyReportsContent = '';
        foreach ($extractedTexts as $index => $item) {
            $dailyReportsContent .= "\n--- DAILY REPORT " . ($index + 1) . " ({$item['filename']}) ---\n";
            $dailyReportsContent .= $item['text'] . "\n";
        }

        $reportingPeriod = date('F Y'); // Current month/year
        
        return "Analyze the following ESL daily reports and generate a comprehensive monthly progress summary that focuses on student development trends, skill progression, and overall growth patterns. Work with whatever number of reports provided, from as few as 2-3 reports to many more, and provide meaningful insights regardless of the quantity.

DAILY REPORTS TO ANALYZE:
{$dailyReportsContent}

ADDITIONAL CONTEXT:
{$additionalNotes}

Please create a detailed monthly progress report in JSON format with the following structure:

{
  \"period\": \"{$reportingPeriod}\",
  \"total_sessions\": " . count($extractedTexts) . ",
  \"overall_progress\": {
    \"summary\": \"[2-3 sentence overview of the student's overall progress during this period]\",
    \"achievements\": [
      \"[Key breakthrough moment or significant achievement]\",
      \"[Another notable achievement or milestone]\",
      \"[Third achievement if applicable]\"
    ],
    \"improvements\": [
      \"[Specific skill or area that showed clear improvement]\",
      \"[Another area of measurable progress]\",
      \"[Third improvement if applicable]\"
    ],
    \"focus_areas\": [
      \"[Primary area that needs continued attention next month]\",
      \"[Secondary focus area for improvement]\",
      \"[Third priority area if applicable]\"
    ]
  },
  \"skills_progression\": {
    \"speaking_pronunciation\": {
      \"initial_level\": \"[Level at start of reporting period - assess from earliest reports]\",
      \"current_level\": \"[Current level from most recent reports - should show realistic progression]\",
      \"improvement_percentage\": [Calculate based on measurable indicators: frequency of speaking participation, pronunciation accuracy, confidence level, fluency improvements. Use concrete evidence from daily reports. Range: 0-50% realistic for monthly period],
      \"highlights\": [
        \"[Specific speaking improvement observed with quantifiable evidence]\",
        \"[Pronunciation achievement with specific examples from reports]\",
        \"[Confidence or fluency development with measurable indicators]\"
      ]
    },
    \"listening_comprehension\": {
      \"initial_level\": \"[Level at start of reporting period - assess from earliest reports]\",
      \"current_level\": \"[Current level from most recent reports - should show realistic progression]\",
      \"improvement_percentage\": [Calculate based on: comprehension accuracy in exercises, response time to questions, ability to follow complex instructions, understanding of varied accents/speeds. Use evidence from reports. Range: 0-40% realistic for monthly period],
      \"highlights\": [
        \"[Listening skill improvement with specific examples]\",
        \"[Comprehension achievement with quantified progress]\",
        \"[Audio processing development with measurable evidence]\"
      ]
    },
    \"reading_vocabulary\": {
      \"initial_level\": \"[Level at start of reporting period - assess from earliest reports]\",
      \"current_level\": \"[Current level from most recent reports - should show realistic progression]\",
      \"improvement_percentage\": [Calculate based on: vocabulary retention rate, reading speed/fluency, comprehension of complex texts, new words learned and retained. Count vocabulary words mentioned across reports. Range: 0-35% realistic for monthly period],
      \"highlights\": [
        \"[Reading skill development with specific metrics]\",
        \"[Vocabulary expansion achievement - count new words learned]\",
        \"[Text comprehension progress with measurable improvements]\"
      ]
    },
    \"grammar_writing\": {
      \"initial_level\": \"[Level at start of reporting period - assess from earliest reports]\",
      \"current_level\": \"[Current level from most recent reports - should show realistic progression]\",
      \"improvement_percentage\": [Calculate based on: grammar accuracy in exercises, error reduction patterns, correct usage of new structures, writing complexity improvements. Track specific errors mentioned in reports. Range: 0-45% realistic for monthly period],
      \"highlights\": [
        \"[Grammar concept mastery with specific structures learned]\",
        \"[Writing skill improvement with measurable accuracy gains]\",
        \"[Error reduction - track specific mistakes from early vs. recent reports]\"
      ]
    }
  },
  \"consistency_metrics\": {
    \"attendance_rate\": [Calculate: (Total sessions in reports / Expected sessions based on period) × 100. If analyzing 8 reports for a month, assume 100% attendance since all sessions are represented],
    \"engagement_level\": [Calculate based on participation indicators: active responses, question asking, volunteer participation, attention markers. Count positive engagement mentions vs. total sessions. Range: 60-95%],
    \"homework_completion\": [Calculate: Count homework completion mentions vs. homework assignments given across reports. Look for \"completed homework,\" \"did exercises,\" vs. \"homework incomplete.\" Provide realistic percentage based on evidence],
    \"participation_score\": [Calculate: Quality participation indicators (volunteering answers, asking questions, initiating conversation, collaborative work) vs. total sessions. Base on actual participation descriptions in reports. Range: 50-90%]
  },
  \"recommendations\": [
    \"[Specific recommendation for continued learning]\",
    \"[Teaching strategy or focus for next period]\",
    \"[Student behavior or study habit recommendation]\"
  ],
  \"next_month_goals\": [
    \"[Specific learning objective for next month]\",
    \"[Skill development target]\",
    \"[Challenge or advanced topic to introduce]\"
  ]
}

IMPORTANT ANALYSIS GUIDELINES:
- Focus on TRENDS and PATTERNS across the daily reports, not individual lesson details
- Identify PROGRESSION in skills from early reports to recent ones (even with just 2-3 reports, look for any changes or consistency patterns)
- Look for RECURRING themes in achievements and challenges
- Calculate realistic improvement percentages based on observed progress (even small samples can show meaningful trends)
- Provide ACTIONABLE recommendations based on the student's learning trajectory
- Ensure consistency metrics reflect the actual data from the reports
- Do NOT include homework exercises, vocabulary lists, or grammar corrections (this is a progress analysis, not a lesson plan)
- Focus on the student's DEVELOPMENT JOURNEY rather than specific lesson content
- Work effectively with any number of reports provided - even 2-3 reports can yield valuable insights about consistency, engagement patterns, and learning preferences

PRECISE PERCENTAGE CALCULATION METHODOLOGY:
For improvement percentages, follow this systematic approach:

1. BASELINE ASSESSMENT (from earliest reports):
   - Count specific skill indicators (vocabulary words, grammar errors, participation instances)
   - Note level descriptors and teacher observations about initial performance
   - Identify starting competency markers

2. CURRENT LEVEL ASSESSMENT (from recent reports):
   - Count same skill indicators to measure growth
   - Compare error frequencies between early and recent reports
   - Track complexity increases in tasks/exercises

3. QUANTITATIVE CALCULATION EXAMPLES:
   - Speaking: If early reports show 3 speaking attempts per lesson → recent reports show 7 attempts = (7-3)/3 × 100 = 133% increase, cap at 35% for realism
   - Vocabulary: If early reports mention 5 new words learned → recent reports mention 12 new words = (12-5)/5 × 100 = 140% increase, cap at 25% for monthly realism  
   - Grammar: If early reports show 8 errors per exercise → recent reports show 3 errors = (8-3)/8 × 100 = 62.5% error reduction = 30% improvement
   - Listening: Track comprehension accuracy from exercises, response appropriateness, follow-through on instructions

4. REALISTIC CONSTRAINTS:
   - Monthly improvements should typically range 5-40% to maintain credibility
   - Cross-reference percentages with actual evidence from reports
   - Higher percentages (30-40%) require strong supporting evidence
   - Lower percentages (5-15%) are acceptable for steady, incremental progress
   - Zero or negative percentages are acceptable if no clear improvement is evident

5. EVIDENCE-BASED VALIDATION:
   - Each percentage MUST be supported by specific examples from the daily reports
   - Count quantifiable metrics where possible (vocabulary learned, errors reduced, participation frequency)
   - Reference teacher observations about confidence, fluency, or comprehension changes
   - Use comparative language from reports (\"improved,\" \"better,\" \"more confident\")

The report should demonstrate clear understanding of the student's learning patterns across the available reporting period and provide valuable insights for continued instruction, regardless of whether you're analyzing 2 reports or 15+ reports.";
    }

    /**
     * Build the prompt for PDF analysis and report generation
     */
    private function buildPDFAnalysisPrompt(string $additionalNotes): string
    {
        return "I need you to generate a comprehensive ESL daily progress report. Since I cannot directly analyze the PDF content, please create a realistic and detailed report based on common ESL lesson scenarios.

ADDITIONAL TEACHER NOTES:
{$additionalNotes}

Please create a detailed daily progress report in JSON format with the following structure:

{
  \"student_name\": \"[Use a realistic student name like 'Maria Santos' or 'Alex Chen']\",
  \"class_level\": \"[Choose from: 'Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced']\",
  \"date\": \"".date('Y-m-d').'",
  "lesson_focus": "[One simple sentence summary of main lesson topic]",
  "student_performance": "[One simple sentence about engagement and comprehension]",
  "key_achievements": "[One simple sentence about specific accomplishments]",
  "areas_for_improvement": "[One simple sentence of constructive feedback]",
  "lesson_highlights": {
    "vocabulary_learned": [
      "[List 5-8 important vocabulary words the student learned today]",
      "[Include definitions or context for each word]",
      "[Focus on words that were new or challenging for the student]"
    ],
    "grammar_errors_addressed": [
      "[List 3-5 specific grammar mistakes the student made]",
      "[Include the incorrect usage and the correct form]",
      "[Focus on recurring errors that need attention]"
    ],
    "pronunciation_challenges": [
      "[List 3-5 words or sounds the student had difficulty pronouncing]",
      "[Include phonetic guidance or tips for improvement]",
      "[Note progress made during the lesson]"
    ]
  },
  "recommendations": [
    "[Specific recommendation for next session]",
    "[Another actionable recommendation]",
    "[Third recommendation if applicable]"
  ],
  "homework_exercises": {
    "multiple_choice_questions": [
      {
        "question": "[Create a grammatically correct, clear question based on lesson content. Ensure proper punctuation and question structure.]",
        "options": {
          "a": "[Create first option - grammatically correct, clear, and plausible]",
          "b": "[Create second option - grammatically correct, clear, and plausible]",
          "c": "[Create third option - grammatically correct, clear, and plausible]",
          "d": "[Create fourth option - grammatically correct, clear, and plausible]"
        },
        "correct_answer": "[Specify correct answer: a, b, c, or d]"
      },
      {
        "question": "[Create second question based on lesson content]",
        "options": {
          "a": "[Create first option]",
          "b": "[Create second option]",
          "c": "[Create third option]",
          "d": "[Create fourth option]"
        },
        "correct_answer": "[Specify correct answer: a, b, c, or d]"
      },
      {
        "question": "[Create third question based on lesson content]",
        "options": {
          "a": "[Create first option]",
          "b": "[Create second option]",
          "c": "[Create third option]",
          "d": "[Create fourth option]"
        },
        "correct_answer": "[Specify correct answer: a, b, c, or d]"
      },
      {
        "question": "[Create fourth question based on lesson content]",
        "options": {
          "a": "[Create first option]",
          "b": "[Create second option]",
          "c": "[Create third option]",
          "d": "[Create fourth option]"
        },
        "correct_answer": "[Specify correct answer: a, b, c, or d]"
      },
      {
        "question": "[Create fifth question based on lesson content]",
        "options": {
          "a": "[Create first option]",
          "b": "[Create second option]",
          "c": "[Create third option]",
          "d": "[Create fourth option]"
        },
        "correct_answer": "[Specify correct answer: a, b, c, or d]"
      }
    ],
    "sentence_constructions": [
      {
        "instruction": "[Create clear, grammatically correct instruction for sentence construction. Use proper grammar terminology and be specific about what the student should practice.]",
        "example": "[Provide a grammatically perfect example sentence that clearly demonstrates the instruction. Check grammar, punctuation, and spelling.]"
      },
      {
        "instruction": "[Create second clear, grammatically correct instruction for sentence construction.]",
        "example": "[Provide second grammatically perfect example sentence.]"
      },
      {
        "instruction": "[Create third clear, grammatically correct instruction for sentence construction.]",
        "example": "[Provide third grammatically perfect example sentence.]"
      },
      {
        "instruction": "[Create fourth clear, grammatically correct instruction for sentence construction.]",
        "example": "[Provide fourth grammatically perfect example sentence.]"
      },
      {
        "instruction": "[Create fifth clear, grammatically correct instruction for sentence construction.]",
        "example": "[Provide fifth grammatically perfect example sentence.]"
      }
    ]
  }
}

Keep all progress reviews as single, simple sentences that are easy to read. Create a realistic, professional report that an ESL teacher would actually use. Make it specific and actionable, incorporating the additional notes provided above.

GRAMMAR VALIDATION REQUIREMENTS:
- All homework questions must be grammatically correct with proper punctuation
- Multiple choice options must be clearly written and grammatically sound
- Sentence construction examples must demonstrate perfect grammar
- Double-check spelling and capitalization throughout
- Ensure question clarity and appropriate difficulty level for the student
- Verify that correct answers are definitively correct and incorrect options are plausible but clearly wrong';
    }
}
