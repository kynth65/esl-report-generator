<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Services\PDFGenerationService;
use App\Services\ReportGenerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class MonthlyReportController extends Controller
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
     * Generate a monthly report from multiple uploaded PDFs and notes
     */
    public function generate(Request $request): JsonResponse
    {
        try {
            // Validate the request
            $request->validate([
                'pdf_files.*' => 'required|file|mimes:pdf|max:10240', // 10MB max per file
                'notes' => 'nullable|string|max:2000',
            ]);

            $pdfFiles = $request->file('pdf_files') ?? [];
            $notes = $request->input('notes', '');

            // Ensure we have at least one PDF
            if (empty($pdfFiles) || count($pdfFiles) < 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please upload at least one daily report PDF.',
                ], 400);
            }

            // Allow up to 20 files to be flexible for different class schedules
            if (count($pdfFiles) > 20) {
                return response()->json([
                    'success' => false,
                    'message' => 'Maximum 20 PDF files allowed for monthly analysis.',
                ], 400);
            }

            Log::info('Monthly report generation request received', [
                'file_count' => count($pdfFiles),
                'file_names' => array_map(fn($file) => $file->getClientOriginalName(), $pdfFiles),
                'total_size' => array_sum(array_map(fn($file) => $file->getSize(), $pdfFiles)),
                'notes_length' => strlen($notes),
                'user_id' => auth()->id() ?? 'guest',
            ]);

            // Generate the monthly report
            $result = $this->reportService->generateMonthlyReport($pdfFiles, $notes);

            if (! $result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['error'],
                    'stage' => $result['stage'] ?? 'unknown',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Monthly report generated successfully',
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
            Log::error('Monthly report controller error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred while generating the monthly report',
            ], 500);
        }
    }

    /**
     * Generate and download PDF for monthly report
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

            Log::info('Monthly PDF download request received', [
                'period' => $reportData['period'] ?? 'unknown',
                'user_id' => auth()->id() ?? 'guest',
            ]);

            // Validate report data
            $validation = $this->pdfService->validateMonthlyReportData($reportData);
            if (! $validation['is_valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid monthly report data',
                    'errors' => $validation['errors'],
                ], 400);
            }

            // Generate and return PDF download
            return $this->pdfService->downloadMonthlyReportPDF($reportData, $metadata);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Monthly PDF download failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate monthly PDF: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Preview PDF for monthly report (inline)
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

            Log::info('Monthly PDF preview request received', [
                'period' => $reportData['period'] ?? 'unknown',
                'user_id' => auth()->id() ?? 'guest',
            ]);

            // Validate report data
            $validation = $this->pdfService->validateMonthlyReportData($reportData);
            if (! $validation['is_valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid monthly report data',
                    'errors' => $validation['errors'],
                ], 400);
            }

            // Generate and return PDF for preview
            return $this->pdfService->previewMonthlyReportPDF($reportData, $metadata);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Monthly PDF preview failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to preview monthly PDF: '.$e->getMessage(),
            ], 500);
        }
    }
}