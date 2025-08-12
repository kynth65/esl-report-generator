<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Services\PDFGenerationService;
use App\Services\ReportGenerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class DailyReportController extends Controller
{
    private ReportGenerationService $reportService;

    private PDFGenerationService $pdfService;

    public function __construct(
        ReportGenerationService $reportService,
        PDFGenerationService $pdfService
    ) {
        $this->reportService = $reportService;
        $this->pdfService = $pdfService;
    }

    /**
     * Generate a daily report from uploaded PDF and notes
     */
    public function generate(Request $request): JsonResponse
    {
        try {
            // Validate the request
            $request->validate([
                'pdf_file' => 'required|file|mimes:pdf|max:10240', // 10MB max
                'notes' => 'nullable|string|max:1000',
            ]);

            $pdfFile = $request->file('pdf_file');
            $notes = $request->input('notes', '');

            Log::info('Daily report generation request received', [
                'filename' => $pdfFile->getClientOriginalName(),
                'file_size' => $pdfFile->getSize(),
                'notes_length' => strlen($notes),
                'user_id' => auth()->id() ?? 'guest',
            ]);

            // Generate the report
            $result = $this->reportService->generateDailyReport($pdfFile, $notes);

            if (! $result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['error'],
                    'stage' => $result['stage'] ?? 'unknown',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Daily report generated successfully',
                'data' => [
                    'report' => $result['report'],
                    'metadata' => $result['metadata'],
                ],
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Daily report controller error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred while generating the report',
            ], 500);
        }
    }

    /**
     * Get a sample report for testing
     */
    public function sample(): JsonResponse
    {
        try {
            $sampleReport = $this->reportService->getSampleReport();

            return response()->json([
                'success' => true,
                'message' => 'Sample report generated',
                'data' => $sampleReport,
            ]);

        } catch (\Exception $e) {
            Log::error('Sample report generation failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate sample report',
            ], 500);
        }
    }

    /**
     * Test the PDF parsing functionality
     */
    public function testPdfParsing(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'pdf_file' => 'required|file|mimes:pdf|max:10240',
            ]);

            $pdfFile = $request->file('pdf_file');

            // Only validate PDF, don't generate AI report
            $pdfService = app(\App\Services\PDFParsingService::class);
            $result = $pdfService->validatePDF($pdfFile);

            if (! $result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['error'],
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'PDF validation successful - ready for AI processing',
                'data' => [
                    'metadata' => $result['metadata'],
                    'status' => 'PDF is valid and ready for OpenAI analysis',
                ],
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('PDF parsing test failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'PDF parsing test failed: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate and download PDF for daily report
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function downloadPdf(Request $request)
    {
        try {
            $request->validate([
                'report_data' => 'required|array',
                'metadata' => 'nullable|array',
            ]);

            $reportData = $request->input('report_data');
            $metadata = $request->input('metadata', []);

            Log::info('PDF download request received', [
                'student_name' => $reportData['student_name'] ?? 'unknown',
                'user_id' => auth()->id() ?? 'guest',
            ]);

            // Validate report data
            $validation = $this->pdfService->validateReportData($reportData);
            if (! $validation['is_valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid report data',
                    'errors' => $validation['errors'],
                ], 400);
            }

            // Generate and return PDF download
            return $this->pdfService->downloadDailyReportPDF($reportData, $metadata);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('PDF download failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate PDF: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Preview PDF for daily report (inline)
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function previewPdf(Request $request)
    {
        try {
            $request->validate([
                'report_data' => 'required|array',
                'metadata' => 'nullable|array',
            ]);

            $reportData = $request->input('report_data');
            $metadata = $request->input('metadata', []);

            Log::info('PDF preview request received', [
                'student_name' => $reportData['student_name'] ?? 'unknown',
                'user_id' => auth()->id() ?? 'guest',
            ]);

            // Validate report data
            $validation = $this->pdfService->validateReportData($reportData);
            if (! $validation['is_valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid report data',
                    'errors' => $validation['errors'],
                ], 400);
            }

            // Generate and return PDF for preview
            return $this->pdfService->previewDailyReportPDF($reportData, $metadata);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('PDF preview failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to preview PDF: '.$e->getMessage(),
            ], 500);
        }
    }
}
