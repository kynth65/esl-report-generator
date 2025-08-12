<?php

namespace App\Services;

use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Spatie\PdfToText\Pdf;

class PDFParsingService
{
    /**
     * Validate and prepare PDF file for processing
     *
     * @throws Exception
     */
    public function validatePDF(UploadedFile $file): array
    {
        try {
            // Validate file type
            if ($file->getMimeType() !== 'application/pdf') {
                throw new Exception('File must be a PDF');
            }

            // Validate file size (max 10MB)
            if ($file->getSize() > 10 * 1024 * 1024) {
                throw new Exception('PDF file is too large. Maximum size is 10MB.');
            }

            return [
                'success' => true,
                'metadata' => [
                    'filename' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ],
            ];

        } catch (Exception $e) {
            Log::error('PDF validation failed', [
                'filename' => $file->getClientOriginalName() ?? 'unknown',
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'metadata' => [
                    'filename' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                ],
            ];
        }
    }

    /**
     * Extract text content from PDF file
     *
     * @throws Exception
     */
    public function extractText(UploadedFile $file): array
    {
        try {
            // First validate the PDF
            $validationResult = $this->validatePDF($file);

            if (! $validationResult['success']) {
                return $validationResult;
            }

            // Extract text from PDF using spatie/pdf-to-text
            $pdfPath = $file->getRealPath();
            
            // Log the extraction attempt
            Log::info('Starting PDF text extraction', [
                'filename' => $file->getClientOriginalName(),
            ]);
            
            try {
                // Configure PDF binary path if specified in environment
                if ($binPath = config('app.pdftotext_binary_path')) {
                    $text = Pdf::getText($pdfPath, $binPath);
                } else {
                    $text = Pdf::getText($pdfPath);
                }
                
            } catch (\Exception $extractionException) {
                // Log the specific extraction error
                Log::error('PDF text extraction failed', [
                    'filename' => $file->getClientOriginalName(),
                    'error' => $extractionException->getMessage(),
                ]);
                
                throw new Exception('The required binary was not found or is not executable.');
            }

            if (empty(trim($text))) {
                throw new Exception('Could not extract text from PDF. The file may be image-based or encrypted.');
            }

            // Clean and process the extracted text
            $cleanedText = $this->cleanText($text);

            // Validate content for ESL lesson report
            $contentValidation = $this->validateLessonContent($cleanedText);

            return [
                'success' => true,
                'text' => $cleanedText,
                'metadata' => array_merge($validationResult['metadata'], [
                    'text_stats' => [
                        'character_count' => strlen($cleanedText),
                        'word_count' => str_word_count($cleanedText),
                        'line_count' => substr_count($cleanedText, "\n") + 1,
                    ],
                ]),
                'content_validation' => $contentValidation,
            ];

        } catch (Exception $e) {
            $errorMessage = $e->getMessage();
            
            // Provide more helpful error message for missing binary
            if (strpos($errorMessage, 'required binary was not found') !== false || 
                strpos($errorMessage, 'not executable') !== false) {
                $errorMessage = 'PDF text extraction failed: The required poppler-utils binary (pdftotext) was not found. ' .
                               'To fix this issue:\n\n' .
                               '1. Windows: Download and install Poppler from https://github.com/oschwartz10612/poppler-windows/releases\n' .
                               '2. Extract to C:\\poppler and add C:\\poppler\\Library\\bin to your system PATH\n' .
                               '3. Alternatively, set PDFTOTEXT_BINARY_PATH="C:\\poppler\\Library\\bin\\pdftotext.exe" in your .env file\n' .
                               '4. Linux/Mac: Install poppler-utils (apt install poppler-utils / brew install poppler)\n\n' .
                               'Current error: ' . $e->getMessage();
            }
            
            Log::error('PDF text extraction failed', [
                'filename' => $file->getClientOriginalName() ?? 'unknown',
                'error' => $e->getMessage(),
                'original_error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $errorMessage,
                'metadata' => [
                    'filename' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                ],
            ];
        }
    }

    /**
     * Clean and process the extracted text
     */
    private function cleanText(string $text): string
    {
        // Remove excessive whitespace
        $text = preg_replace('/\s+/', ' ', $text);

        // Remove common PDF artifacts
        $text = preg_replace('/\f/', ' ', $text); // Form feed
        $text = preg_replace('/\x00/', '', $text); // Null bytes

        // Normalize line endings
        $text = str_replace(["\r\n", "\r"], "\n", $text);

        // Remove empty lines and trim
        $lines = array_filter(explode("\n", $text), function ($line) {
            return trim($line) !== '';
        });

        return trim(implode("\n", $lines));
    }

    /**
     * Validate if the extracted text seems reasonable for ESL lesson report
     */
    public function validateLessonContent(string $text): array
    {
        $warnings = [];
        $wordCount = str_word_count($text);

        // Check minimum content length
        if ($wordCount < 50) {
            $warnings[] = 'Document seems too short for a lesson report (less than 50 words)';
        }

        // Check maximum content length
        if ($wordCount > 5000) {
            $warnings[] = 'Document seems very long for a lesson report (more than 5000 words)';
        }

        // Check for common lesson report keywords
        $lessonKeywords = [
            'student', 'lesson', 'class', 'learning', 'progress', 'homework',
            'grammar', 'vocabulary', 'speaking', 'listening', 'reading', 'writing',
        ];

        $foundKeywords = 0;
        $textLower = strtolower($text);

        foreach ($lessonKeywords as $keyword) {
            if (strpos($textLower, $keyword) !== false) {
                $foundKeywords++;
            }
        }

        if ($foundKeywords < 3) {
            $warnings[] = 'Document may not be an ESL lesson report (few relevant keywords found)';
        }

        return [
            'is_valid' => count($warnings) === 0,
            'warnings' => $warnings,
            'word_count' => $wordCount,
            'keywords_found' => $foundKeywords,
        ];
    }
}
