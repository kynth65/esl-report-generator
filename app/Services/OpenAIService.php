<?php

namespace App\Services;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
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

        if (!$this->apiKey) {
            throw new Exception('OpenAI API key is not configured');
        }

        $this->client = new Client([
            'base_uri' => $this->baseUrl,
            'timeout' => config('openai.timeout', 30),
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ]
        ]);
    }

    /**
     * Generate a daily ESL report from lesson content and notes
     *
     * @param string $lessonContent
     * @param string $additionalNotes
     * @return array
     */
    public function generateDailyReport(string $lessonContent, string $additionalNotes = ''): array
    {
        try {
            $prompt = $this->buildDailyReportPrompt($lessonContent, $additionalNotes);
            
            $response = $this->client->post('/chat/completions', [
                'json' => [
                    'model' => $this->model,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are an experienced ESL teacher assistant that creates comprehensive daily progress reports. Always respond with valid JSON format.'
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt
                        ]
                    ],
                    'max_tokens' => config('openai.max_tokens', 4000),
                    'temperature' => config('openai.temperature', 0.7),
                    'response_format' => ['type' => 'json_object']
                ]
            ]);

            $responseData = json_decode($response->getBody()->getContents(), true);
            
            if (!isset($responseData['choices'][0]['message']['content'])) {
                throw new Exception('Invalid response format from OpenAI');
            }

            $reportData = json_decode($responseData['choices'][0]['message']['content'], true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Failed to parse AI response as JSON: ' . json_last_error_msg());
            }

            return [
                'success' => true,
                'report' => $reportData,
                'usage' => $responseData['usage'] ?? null
            ];

        } catch (GuzzleException $e) {
            Log::error('OpenAI API request failed', [
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);

            return [
                'success' => false,
                'error' => 'AI service temporarily unavailable: ' . $e->getMessage()
            ];

        } catch (Exception $e) {
            Log::error('Daily report generation failed', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Build the prompt for daily report generation
     *
     * @param string $lessonContent
     * @param string $additionalNotes
     * @return string
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
  \"lesson_focus\": \"[2-3 sentence summary of main lesson topics]\",
  \"student_performance\": \"[2-3 sentence analysis of engagement and comprehension]\",
  \"key_achievements\": \"[Specific accomplishments and breakthroughs]\",
  \"areas_for_improvement\": \"[Constructive feedback on areas needing attention]\",
  \"skills_assessment\": {
    \"speaking_pronunciation\": {
      \"level\": \"[Excellent/Good/Progressing/Needs Practice]\",
      \"details\": \"[Specific observations]\"
    },
    \"listening_comprehension\": {
      \"level\": \"[Excellent/Good/Progressing/Needs Practice]\",
      \"details\": \"[Specific observations]\"
    },
    \"reading_vocabulary\": {
      \"level\": \"[Excellent/Good/Progressing/Needs Practice]\",
      \"details\": \"[Specific observations]\"
    },
    \"grammar_writing\": {
      \"level\": \"[Excellent/Good/Progressing/Needs Practice]\",
      \"details\": \"[Specific observations]\"
    }
  },
  \"recommendations\": [
    \"[Specific recommendation for next session]\",
    \"[Another actionable recommendation]\",
    \"[Third recommendation if applicable]\"
  ],
  \"homework_exercises\": [
    {
      \"type\": \"Vocabulary Practice\",
      \"description\": \"[Specific exercise based on lesson content]\",
      \"estimated_time\": \"[5-15 minutes]\"
    },
    {
      \"type\": \"Grammar Exercise\", 
      \"description\": \"[Targeted grammar practice]\",
      \"estimated_time\": \"[5-15 minutes]\"
    },
    {
      \"type\": \"Reading Comprehension\",
      \"description\": \"[Reading task relevant to lesson]\",
      \"estimated_time\": \"[10-20 minutes]\"
    },
    {
      \"type\": \"Writing Practice\",
      \"description\": \"[Writing exercise reinforcing lesson]\",
      \"estimated_time\": \"[10-15 minutes]\"
    },
    {
      \"type\": \"Speaking Practice\",
      \"description\": \"[Pronunciation or conversation task]\",
      \"estimated_time\": \"[5-10 minutes]\"
    },
    {
      \"type\": \"Listening Exercise\",
      \"description\": \"[Audio comprehension task]\",
      \"estimated_time\": \"[10-15 minutes]\"
    },
    {
      \"type\": \"Review Activity\",
      \"description\": \"[Review of previous lesson concepts]\",
      \"estimated_time\": \"[5-10 minutes]\"
    },
    {
      \"type\": \"Creative Task\",
      \"description\": \"[Fun, engaging activity using new skills]\",
      \"estimated_time\": \"[15-20 minutes]\"
    },
    {
      \"type\": \"Self-Assessment\",
      \"description\": \"[Student reflection on learning]\",
      \"estimated_time\": \"[5 minutes]\"
    },
    {
      \"type\": \"Preparation Task\",
      \"description\": \"[Preview of next lesson topic]\",
      \"estimated_time\": \"[5-10 minutes]\"
    }
  ]
}

Make sure all content is specific, actionable, and tailored to the student's current level and lesson content. The homework exercises should be varied and engaging while reinforcing the lesson objectives.";
    }
}