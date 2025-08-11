<?php

namespace App\Services;

use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\PdfToText\Pdf;

class PDFParsingService
{
    /**
     * Extract text content from a PDF file
     *
     * @param UploadedFile $file
     * @return array
     * @throws Exception
     */
    public function extractText(UploadedFile $file): array
    {
        try {
            // Validate file type
            if ($file->getMimeType() !== 'application/pdf') {
                throw new Exception('File must be a PDF');
            }

            // Store the file temporarily
            $tempPath = $file->storeAs('temp', uniqid() . '.pdf', 'local');
            $fullPath = Storage::disk('local')->path($tempPath);

            // Extract text from PDF
            $extractedText = Pdf::getText($fullPath);
            
            // Clean up the temporary file
            Storage::disk('local')->delete($tempPath);

            // Process and clean the extracted text
            $cleanedText = $this->cleanText($extractedText);

            return [
                'success' => true,
                'text' => $cleanedText,
                'word_count' => str_word_count($cleanedText),
                'character_count' => strlen($cleanedText),
                'metadata' => [
                    'filename' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]
            ];

        } catch (Exception $e) {
            Log::error('PDF parsing failed', [
                'filename' => $file->getClientOriginalName() ?? 'unknown',
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'metadata' => [
                    'filename' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                ]
            ];
        }
    }

    /**
     * Clean and process the extracted text
     *
     * @param string $text
     * @return string
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
        $lines = array_filter(explode("\n", $text), function($line) {
            return trim($line) !== '';
        });
        
        return trim(implode("\n", $lines));
    }

    /**
     * Validate if the extracted text seems reasonable for ESL lesson report
     *
     * @param string $text
     * @return array
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
            'grammar', 'vocabulary', 'speaking', 'listening', 'reading', 'writing'
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
            'keywords_found' => $foundKeywords
        ];
    }
}