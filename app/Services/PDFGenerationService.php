<?php

namespace App\Services;

use Exception;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class PDFGenerationService
{
    /**
     * Generate a PDF from daily report data
     *
     * @param array $reportData
     * @param array $metadata
     * @return array
     */
    public function generateDailyReportPDF(array $reportData, array $metadata = []): array
    {
        try {
            Log::info('Starting PDF generation for daily report', [
                'student_name' => $reportData['student_name'] ?? 'unknown',
                'date' => $reportData['date'] ?? 'unknown'
            ]);

            // Prepare data for the PDF template
            $pdfData = [
                'report' => $reportData,
                'metadata' => $metadata,
                'generated_at' => now()->format('F j, Y \a\t g:i A')
            ];

            // Configure PDF settings
            $pdf = Pdf::loadView('pdf.daily-report', $pdfData)
                ->setPaper('letter', 'portrait')
                ->setOptions([
                    'defaultFont' => 'DejaVu Sans',
                    'isRemoteEnabled' => false,
                    'isHtml5ParserEnabled' => true,
                    'debugPng' => false,
                    'debugKeepTemp' => false,
                    'debugCss' => false,
                    'isPhpEnabled' => false,
                    'chroot' => public_path(),
                ]);

            // Generate the PDF content
            $pdfContent = $pdf->output();

            // Generate filename
            $studentName = $reportData['student_name'] ?? 'Student';
            $date = $reportData['date'] ?? date('Y-m-d');
            $filename = 'ESL_Daily_Report_' . str_replace([' ', '-'], '_', $studentName) . '_' . str_replace('-', '_', $date) . '.pdf';

            Log::info('PDF generated successfully', [
                'filename' => $filename,
                'size_kb' => round(strlen($pdfContent) / 1024, 2)
            ]);

            return [
                'success' => true,
                'pdf_content' => $pdfContent,
                'filename' => $filename,
                'size' => strlen($pdfContent),
                'metadata' => [
                    'generated_at' => now()->toISOString(),
                    'student_name' => $studentName,
                    'report_date' => $date,
                    'file_size_kb' => round(strlen($pdfContent) / 1024, 2)
                ]
            ];

        } catch (Exception $e) {
            Log::error('PDF generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => 'Failed to generate PDF: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Stream PDF to browser for download
     *
     * @param array $reportData
     * @param array $metadata
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function downloadDailyReportPDF(array $reportData, array $metadata = [])
    {
        try {
            $result = $this->generateDailyReportPDF($reportData, $metadata);
            
            if (!$result['success']) {
                throw new Exception($result['error']);
            }

            // Return PDF as download response
            return response($result['pdf_content'])
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $result['filename'] . '"')
                ->header('Content-Length', (string) $result['size'])
                ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
                ->header('Pragma', 'no-cache')
                ->header('Expires', '0');

        } catch (Exception $e) {
            Log::error('PDF download failed', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Preview PDF in browser (inline)
     *
     * @param array $reportData
     * @param array $metadata
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function previewDailyReportPDF(array $reportData, array $metadata = [])
    {
        try {
            $result = $this->generateDailyReportPDF($reportData, $metadata);
            
            if (!$result['success']) {
                throw new Exception($result['error']);
            }

            // Return PDF for inline viewing
            return response($result['pdf_content'])
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="' . $result['filename'] . '"')
                ->header('Content-Length', (string) $result['size']);

        } catch (Exception $e) {
            Log::error('PDF preview failed', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Validate report data for PDF generation
     *
     * @param array $reportData
     * @return array
     */
    public function validateReportData(array $reportData): array
    {
        $errors = [];

        // Check required fields
        $requiredFields = ['student_name', 'class_level', 'date'];
        foreach ($requiredFields as $field) {
            if (empty($reportData[$field])) {
                $errors[] = "Missing required field: {$field}";
            }
        }

        // Validate homework exercises format (new structure with MCQ and sentence constructions)
        if (isset($reportData['homework_exercises'])) {
            if (!is_array($reportData['homework_exercises'])) {
                $errors[] = 'Homework exercises must be an array';
            } else {
                // Check for new format (multiple_choice_questions and sentence_constructions)
                if (isset($reportData['homework_exercises']['multiple_choice_questions'])) {
                    if (!is_array($reportData['homework_exercises']['multiple_choice_questions'])) {
                        $errors[] = 'Multiple choice questions must be an array';
                    } else {
                        foreach ($reportData['homework_exercises']['multiple_choice_questions'] as $index => $mcq) {
                            if (!is_array($mcq) || empty($mcq['question']) || empty($mcq['options'])) {
                                $errors[] = "Multiple choice question {$index} missing required fields";
                            }
                        }
                    }
                }
                
                if (isset($reportData['homework_exercises']['sentence_constructions'])) {
                    if (!is_array($reportData['homework_exercises']['sentence_constructions'])) {
                        $errors[] = 'Sentence constructions must be an array';
                    } else {
                        foreach ($reportData['homework_exercises']['sentence_constructions'] as $index => $construction) {
                            if (!is_array($construction) || empty($construction['instruction']) || empty($construction['example'])) {
                                $errors[] = "Sentence construction {$index} missing required fields";
                            }
                        }
                    }
                }
                
                // Also support legacy format for backward compatibility
                if (!isset($reportData['homework_exercises']['multiple_choice_questions']) && 
                    !isset($reportData['homework_exercises']['sentence_constructions']) &&
                    is_array($reportData['homework_exercises'])) {
                    // Legacy format validation
                    foreach ($reportData['homework_exercises'] as $index => $exercise) {
                        if (!is_array($exercise)) {
                            $errors[] = "Homework exercise {$index} must be an array";
                        } elseif (empty($exercise['type']) || empty($exercise['description'])) {
                            $errors[] = "Homework exercise {$index} missing required fields";
                        }
                    }
                }
            }
        }

        // Validate skills assessment format
        if (isset($reportData['skills_assessment'])) {
            if (!is_array($reportData['skills_assessment'])) {
                $errors[] = 'Skills assessment must be an array';
            } else {
                foreach ($reportData['skills_assessment'] as $skill => $assessment) {
                    if (!is_array($assessment) || empty($assessment['level'])) {
                        $errors[] = "Skills assessment for {$skill} is invalid";
                    }
                }
            }
        }

        return [
            'is_valid' => empty($errors),
            'errors' => $errors
        ];
    }
}