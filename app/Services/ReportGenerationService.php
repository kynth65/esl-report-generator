<?php

namespace App\Services;

use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class ReportGenerationService
{
    private PDFParsingService $pdfService;
    private OpenAIService $openAIService;

    public function __construct(
        PDFParsingService $pdfService,
        OpenAIService $openAIService
    ) {
        $this->pdfService = $pdfService;
        $this->openAIService = $openAIService;
    }

    /**
     * Generate a complete daily report from uploaded PDF and notes
     *
     * @param UploadedFile $pdfFile
     * @param string $additionalNotes
     * @return array
     */
    public function generateDailyReport(UploadedFile $pdfFile, string $additionalNotes = ''): array
    {
        try {
            // Step 1: Extract text from PDF
            Log::info('Starting PDF text extraction', [
                'filename' => $pdfFile->getClientOriginalName()
            ]);

            $extractionResult = $this->pdfService->extractText($pdfFile);
            
            if (!$extractionResult['success']) {
                return [
                    'success' => false,
                    'error' => 'Failed to extract text from PDF: ' . $extractionResult['error'],
                    'stage' => 'pdf_extraction'
                ];
            }

            $extractedText = $extractionResult['text'];
            
            // Step 2: Validate content
            $validation = $this->pdfService->validateLessonContent($extractedText);
            
            // Step 3: Generate AI report
            Log::info('Starting AI report generation', [
                'text_length' => strlen($extractedText),
                'word_count' => $extractionResult['word_count']
            ]);

            $aiResult = $this->openAIService->generateDailyReport($extractedText, $additionalNotes);
            
            if (!$aiResult['success']) {
                return [
                    'success' => false,
                    'error' => $aiResult['error'],
                    'stage' => 'ai_generation',
                    'extracted_text' => $extractedText, // For debugging
                ];
            }

            // Step 4: Prepare final response
            $response = [
                'success' => true,
                'report' => $aiResult['report'],
                'metadata' => [
                    'processing_time' => microtime(true),
                    'pdf_metadata' => $extractionResult['metadata'],
                    'text_stats' => [
                        'word_count' => $extractionResult['word_count'],
                        'character_count' => $extractionResult['character_count']
                    ],
                    'validation' => $validation,
                    'ai_usage' => $aiResult['usage'] ?? null
                ]
            ];

            Log::info('Daily report generated successfully', [
                'filename' => $pdfFile->getClientOriginalName(),
                'student_name' => $aiResult['report']['student_name'] ?? 'unknown'
            ]);

            return $response;

        } catch (Exception $e) {
            Log::error('Report generation failed', [
                'filename' => $pdfFile->getClientOriginalName() ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => 'Report generation failed: ' . $e->getMessage(),
                'stage' => 'general_error'
            ];
        }
    }

    /**
     * Get a sample report structure for testing
     *
     * @return array
     */
    public function getSampleReport(): array
    {
        return [
            'success' => true,
            'report' => [
                'student_name' => 'Sample Student',
                'class_level' => 'Intermediate',
                'date' => date('Y-m-d'),
                'lesson_focus' => 'This is a sample report structure for testing the integration.',
                'student_performance' => 'Student engagement was good during the sample lesson.',
                'key_achievements' => 'Successfully demonstrated understanding of sample concepts.',
                'areas_for_improvement' => 'Continue practicing sample exercises for better fluency.',
                'skills_assessment' => [
                    'speaking_pronunciation' => [
                        'level' => 'Good',
                        'details' => 'Sample assessment details'
                    ],
                    'listening_comprehension' => [
                        'level' => 'Excellent',
                        'details' => 'Sample assessment details'
                    ],
                    'reading_vocabulary' => [
                        'level' => 'Progressing',
                        'details' => 'Sample assessment details'
                    ],
                    'grammar_writing' => [
                        'level' => 'Needs Practice',
                        'details' => 'Sample assessment details'
                    ]
                ],
                'recommendations' => [
                    'Practice more speaking exercises',
                    'Review grammar concepts from today',
                    'Continue vocabulary building activities'
                ],
                'homework_exercises' => array_map(function($i) {
                    return [
                        'type' => ['Vocabulary Practice', 'Grammar Exercise', 'Reading Comprehension'][$i % 3],
                        'description' => "Sample exercise " . ($i + 1) . " based on lesson content",
                        'estimated_time' => (5 + ($i * 2)) . ' minutes'
                    ];
                }, range(0, 9))
            ],
            'metadata' => [
                'processing_time' => 0.1,
                'pdf_metadata' => [
                    'filename' => 'sample.pdf',
                    'file_size' => 1024
                ],
                'text_stats' => [
                    'word_count' => 100,
                    'character_count' => 500
                ]
            ]
        ];
    }
}