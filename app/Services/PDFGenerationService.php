<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Support\Facades\Log;

class PDFGenerationService
{
    /**
     * Generate a PDF from daily report data
     */
    public function generateDailyReportPDF(array $reportData, array $metadata = []): array
    {
        try {
            Log::info('Starting PDF generation for daily report', [
                'student_name' => $reportData['student_name'] ?? 'unknown',
                'date' => $reportData['date'] ?? 'unknown',
            ]);

            // Prepare data for the PDF template
            $pdfData = [
                'report' => $reportData,
                'metadata' => $metadata,
                'generated_at' => now()->format('F j, Y \a\t g:i A'),
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
            
            // Ensure the date uses the current year (2025)
            if (empty($date) || !strtotime($date)) {
                $date = date('Y-m-d');
            } else {
                // Parse the date and ensure it uses current year
                $parsedDate = date_parse($date);
                if ($parsedDate && !$parsedDate['errors']) {
                    $currentYear = date('Y');
                    $month = str_pad($parsedDate['month'] ?: date('n'), 2, '0', STR_PAD_LEFT);
                    $day = str_pad($parsedDate['day'] ?: date('j'), 2, '0', STR_PAD_LEFT);
                    $date = $currentYear . '-' . $month . '-' . $day;
                } else {
                    $date = date('Y-m-d');
                }
            }
            
            $filename = 'ESL_Daily_Report_'.str_replace([' ', '-'], '_', $studentName).'_'.str_replace('-', '_', $date).'.pdf';

            Log::info('PDF generated successfully', [
                'filename' => $filename,
                'size_kb' => round(strlen($pdfContent) / 1024, 2),
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
                    'file_size_kb' => round(strlen($pdfContent) / 1024, 2),
                ],
            ];
        } catch (Exception $e) {
            Log::error('PDF generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => 'Failed to generate PDF: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Stream PDF to browser for download
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function downloadDailyReportPDF(array $reportData, array $metadata = [])
    {
        try {
            $result = $this->generateDailyReportPDF($reportData, $metadata);

            if (! $result['success']) {
                throw new Exception($result['error']);
            }

            // Return PDF as download response
            return response($result['pdf_content'])
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="'.$result['filename'].'"')
                ->header('Content-Length', (string) $result['size'])
                ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
                ->header('Pragma', 'no-cache')
                ->header('Expires', '0');
        } catch (Exception $e) {
            Log::error('PDF download failed', [
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Preview PDF in browser (inline)
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function previewDailyReportPDF(array $reportData, array $metadata = [])
    {
        try {
            $result = $this->generateDailyReportPDF($reportData, $metadata);

            if (! $result['success']) {
                throw new Exception($result['error']);
            }

            // Return PDF for inline viewing
            return response($result['pdf_content'])
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="'.$result['filename'].'"')
                ->header('Content-Length', (string) $result['size']);
        } catch (Exception $e) {
            Log::error('PDF preview failed', [
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Validate report data for PDF generation
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
            if (! is_array($reportData['homework_exercises'])) {
                $errors[] = 'Homework exercises must be an array';
            } else {
                // Check for new format (multiple_choice_questions and sentence_constructions)
                if (isset($reportData['homework_exercises']['multiple_choice_questions'])) {
                    if (! is_array($reportData['homework_exercises']['multiple_choice_questions'])) {
                        $errors[] = 'Multiple choice questions must be an array';
                    } else {
                        foreach ($reportData['homework_exercises']['multiple_choice_questions'] as $index => $mcq) {
                            if (! is_array($mcq) || empty($mcq['question']) || empty($mcq['options'])) {
                                $errors[] = "Multiple choice question {$index} missing required fields";
                            }
                        }
                    }
                }

                if (isset($reportData['homework_exercises']['sentence_constructions'])) {
                    if (! is_array($reportData['homework_exercises']['sentence_constructions'])) {
                        $errors[] = 'Sentence constructions must be an array';
                    } else {
                        foreach ($reportData['homework_exercises']['sentence_constructions'] as $index => $construction) {
                            if (! is_array($construction) || empty($construction['instruction']) || empty($construction['example'])) {
                                $errors[] = "Sentence construction {$index} missing required fields";
                            }
                        }
                    }
                }

                // Also support legacy format for backward compatibility
                if (
                    ! isset($reportData['homework_exercises']['multiple_choice_questions']) &&
                    ! isset($reportData['homework_exercises']['sentence_constructions']) &&
                    is_array($reportData['homework_exercises'])
                ) {
                    // Legacy format validation
                    foreach ($reportData['homework_exercises'] as $index => $exercise) {
                        if (! is_array($exercise)) {
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
            if (! is_array($reportData['skills_assessment'])) {
                $errors[] = 'Skills assessment must be an array';
            } else {
                foreach ($reportData['skills_assessment'] as $skill => $assessment) {
                    if (! is_array($assessment) || empty($assessment['level'])) {
                        $errors[] = "Skills assessment for {$skill} is invalid";
                    }
                }
            }
        }

        return [
            'is_valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Generate a PDF from monthly report data
     */
    public function generateMonthlyReportPDF(array $reportData, array $metadata = []): array
    {
        try {
            Log::info('Starting PDF generation for monthly report', [
                'period' => $reportData['period'] ?? 'unknown',
                'total_sessions' => $reportData['total_sessions'] ?? 'unknown',
            ]);

            // Prepare data for the PDF template
            $pdfData = [
                'report' => $reportData,
                'metadata' => $metadata,
                'generated_at' => now()->format('F j, Y \a\t g:i A'),
            ];

            // Configure PDF settings
            $pdf = Pdf::loadView('pdf.monthly-report', $pdfData)
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
            $period = $reportData['period'] ?? date('F Y');
            $filename = 'ESL_Monthly_Report_'.str_replace([' ', '-'], '_', $period).'_'.date('Y_m_d').'.pdf';

            Log::info('Monthly PDF generated successfully', [
                'filename' => $filename,
                'size_kb' => round(strlen($pdfContent) / 1024, 2),
            ]);

            return [
                'success' => true,
                'pdf_content' => $pdfContent,
                'filename' => $filename,
                'size' => strlen($pdfContent),
                'metadata' => [
                    'generated_at' => now()->toISOString(),
                    'period' => $period,
                    'total_sessions' => $reportData['total_sessions'] ?? 0,
                    'file_size_kb' => round(strlen($pdfContent) / 1024, 2),
                ],
            ];
        } catch (Exception $e) {
            Log::error('Monthly PDF generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => 'Failed to generate monthly PDF: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Stream monthly PDF to browser for download
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function downloadMonthlyReportPDF(array $reportData, array $metadata = [])
    {
        try {
            $result = $this->generateMonthlyReportPDF($reportData, $metadata);

            if (! $result['success']) {
                throw new Exception($result['error']);
            }

            // Return PDF as download response
            return response($result['pdf_content'])
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="'.$result['filename'].'"')
                ->header('Content-Length', (string) $result['size'])
                ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
                ->header('Pragma', 'no-cache')
                ->header('Expires', '0');
        } catch (Exception $e) {
            Log::error('Monthly PDF download failed', [
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Preview monthly PDF in browser (inline)
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function previewMonthlyReportPDF(array $reportData, array $metadata = [])
    {
        try {
            $result = $this->generateMonthlyReportPDF($reportData, $metadata);

            if (! $result['success']) {
                throw new Exception($result['error']);
            }

            // Return PDF for inline viewing
            return response($result['pdf_content'])
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="'.$result['filename'].'"')
                ->header('Content-Length', (string) $result['size']);
        } catch (Exception $e) {
            Log::error('Monthly PDF preview failed', [
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Validate monthly report data for PDF generation
     */
    public function validateMonthlyReportData(array $reportData): array
    {
        $errors = [];

        // Check required fields
        $requiredFields = ['period', 'total_sessions', 'overall_progress', 'skills_progression'];
        foreach ($requiredFields as $field) {
            if (empty($reportData[$field])) {
                $errors[] = "Missing required field: {$field}";
            }
        }

        // Validate overall_progress structure
        if (isset($reportData['overall_progress'])) {
            if (! is_array($reportData['overall_progress'])) {
                $errors[] = 'Overall progress must be an array';
            } else {
                $progressFields = ['summary', 'achievements', 'improvements', 'focus_areas'];
                foreach ($progressFields as $field) {
                    if (empty($reportData['overall_progress'][$field])) {
                        $errors[] = "Missing overall_progress field: {$field}";
                    }
                }
            }
        }

        // Validate skills_progression structure
        if (isset($reportData['skills_progression'])) {
            if (! is_array($reportData['skills_progression'])) {
                $errors[] = 'Skills progression must be an array';
            } else {
                foreach ($reportData['skills_progression'] as $skill => $progression) {
                    if (! is_array($progression)) {
                        $errors[] = "Skills progression for {$skill} must be an array";
                    } else {
                        $requiredProgressionFields = ['initial_level', 'current_level', 'improvement_percentage', 'highlights'];
                        foreach ($requiredProgressionFields as $field) {
                            if (! isset($progression[$field])) {
                                $errors[] = "Missing skills progression field {$field} for {$skill}";
                            }
                        }
                    }
                }
            }
        }

        // Validate consistency_metrics if present
        if (isset($reportData['consistency_metrics'])) {
            if (! is_array($reportData['consistency_metrics'])) {
                $errors[] = 'Consistency metrics must be an array';
            } else {
                $metricsFields = ['attendance_rate', 'engagement_level', 'homework_completion', 'participation_score'];
                foreach ($metricsFields as $field) {
                    if (! isset($reportData['consistency_metrics'][$field]) || ! is_numeric($reportData['consistency_metrics'][$field])) {
                        $errors[] = "Missing or invalid consistency metric: {$field}";
                    }
                }
            }
        }

        return [
            'is_valid' => empty($errors),
            'errors' => $errors,
        ];
    }
}
