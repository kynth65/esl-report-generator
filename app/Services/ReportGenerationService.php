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
     */
    public function generateDailyReport(UploadedFile $pdfFile, string $additionalNotes = ''): array
    {
        try {
            // Step 1: Extract text from PDF
            Log::info('Starting PDF text extraction', [
                'filename' => $pdfFile->getClientOriginalName(),
            ]);

            $extractionResult = $this->pdfService->extractText($pdfFile);

            if (! $extractionResult['success']) {
                return [
                    'success' => false,
                    'error' => 'PDF text extraction failed: '.$extractionResult['error'],
                    'stage' => 'pdf_extraction',
                ];
            }

            // Step 2: Generate AI report from extracted text
            Log::info('Starting AI report generation from extracted text', [
                'filename' => $pdfFile->getClientOriginalName(),
                'text_length' => strlen($extractionResult['text']),
                'word_count' => $extractionResult['metadata']['text_stats']['word_count'] ?? 0,
            ]);

            $aiResult = $this->openAIService->generateDailyReport($extractionResult['text'], $additionalNotes);

            if (! $aiResult['success']) {
                return [
                    'success' => false,
                    'error' => $aiResult['error'],
                    'stage' => 'ai_generation',
                ];
            }

            // Step 3: Prepare final response
            $response = [
                'success' => true,
                'report' => $aiResult['report'],
                'metadata' => [
                    'processing_time' => microtime(true),
                    'pdf_metadata' => $extractionResult['metadata'],
                    'content_validation' => $extractionResult['content_validation'],
                    'ai_usage' => $aiResult['usage'] ?? null,
                    'processing_method' => 'text_extraction_analysis',
                ],
            ];

            Log::info('Daily report generated successfully', [
                'filename' => $pdfFile->getClientOriginalName(),
                'student_name' => $aiResult['report']['student_name'] ?? 'unknown',
            ]);

            return $response;

        } catch (Exception $e) {
            Log::error('Report generation failed', [
                'filename' => $pdfFile->getClientOriginalName() ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => 'Report generation failed: '.$e->getMessage(),
                'stage' => 'general_error',
            ];
        }
    }

    /**
     * Generate a monthly report from multiple uploaded PDFs and notes
     */
    public function generateMonthlyReport(array $pdfFiles, string $additionalNotes = ''): array
    {
        try {
            // Step 1: Extract text from all PDFs
            Log::info('Starting monthly report generation', [
                'file_count' => count($pdfFiles),
                'filenames' => array_map(fn($file) => $file->getClientOriginalName(), $pdfFiles),
            ]);

            $extractedTexts = [];
            $extractionMetadata = [];

            foreach ($pdfFiles as $index => $pdfFile) {
                Log::info("Extracting text from PDF " . ($index + 1), [
                    'filename' => $pdfFile->getClientOriginalName(),
                ]);

                $extractionResult = $this->pdfService->extractText($pdfFile);

                if (! $extractionResult['success']) {
                    return [
                        'success' => false,
                        'error' => 'PDF text extraction failed for file "'.$pdfFile->getClientOriginalName().'": '.$extractionResult['error'],
                        'stage' => 'pdf_extraction',
                    ];
                }

                $extractedTexts[] = [
                    'filename' => $pdfFile->getClientOriginalName(),
                    'text' => $extractionResult['text'],
                    'metadata' => $extractionResult['metadata'],
                ];

                $extractionMetadata[] = $extractionResult['metadata'];
            }

            // Step 2: Generate AI monthly report from all extracted texts
            Log::info('Starting AI monthly report generation', [
                'total_files' => count($extractedTexts),
                'total_text_length' => array_sum(array_map(fn($item) => strlen($item['text']), $extractedTexts)),
            ]);

            $aiResult = $this->openAIService->generateMonthlyReport($extractedTexts, $additionalNotes);

            if (! $aiResult['success']) {
                return [
                    'success' => false,
                    'error' => $aiResult['error'],
                    'stage' => 'ai_generation',
                ];
            }

            // Step 3: Prepare final response
            $response = [
                'success' => true,
                'report' => $aiResult['report'],
                'metadata' => [
                    'processing_time' => microtime(true),
                    'pdf_metadata' => $extractionMetadata,
                    'file_count' => count($pdfFiles),
                    'ai_usage' => $aiResult['usage'] ?? null,
                    'processing_method' => 'multi_pdf_analysis',
                ],
            ];

            Log::info('Monthly report generated successfully', [
                'file_count' => count($pdfFiles),
                'period' => $aiResult['report']['period'] ?? 'unknown',
            ]);

            return $response;

        } catch (Exception $e) {
            Log::error('Monthly report generation failed', [
                'file_count' => count($pdfFiles),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => 'Monthly report generation failed: '.$e->getMessage(),
                'stage' => 'general_error',
            ];
        }
    }

    /**
     * Get a sample report structure for testing
     */
    public function getSampleReport(): array
    {
        return [
            'success' => true,
            'report' => [
                'student_name' => 'Sample Student',
                'class_level' => 'Intermediate',
                'date' => date('Y-m-d'),
                'lesson_focus' => 'Today we practiced past tense verbs and daily routines vocabulary.',
                'student_performance' => 'Student showed good engagement and understood most concepts.',
                'key_achievements' => 'Successfully used past tense verbs in conversation practice.',
                'areas_for_improvement' => 'Continue practicing irregular verb conjugations for fluency.',
                'recommendations' => [
                    'Practice more speaking exercises',
                    'Review grammar concepts from today',
                    'Continue vocabulary building activities',
                ],
                'homework_exercises' => array_map(function ($i) {
                    return [
                        'type' => ['Vocabulary Practice', 'Grammar Exercise', 'Reading Comprehension'][$i % 3],
                        'description' => 'Sample exercise '.($i + 1).' based on lesson content',
                        'estimated_time' => (5 + ($i * 2)).' minutes',
                    ];
                }, range(0, 9)),
            ],
            'metadata' => [
                'processing_time' => 0.1,
                'pdf_metadata' => [
                    'filename' => 'sample.pdf',
                    'file_size' => 1024,
                ],
                'text_stats' => [
                    'word_count' => 100,
                    'character_count' => 500,
                ],
            ],
        ];
    }
}
