<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Daily Progress Summary - {{ $report['student_name'] ?? 'Student' }}</title>
    <style>
        @page {
            margin: 0.5in;
            @top-center {
                content: "ESL Daily Progress Report";
                font-size: 10px;
                color: #666;
            }
            @bottom-center {
                content: "Page " counter(page) " of " counter(pages);
                font-size: 10px;
                color: #666;
            }
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #769fcd;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .header h1 {
            color: #769fcd;
            font-size: 24px;
            margin: 0 0 8px 0;
            font-weight: bold;
        }
        
        .header .meta {
            font-size: 10px;
            color: #666;
            line-height: 1.3;
        }
        
        .section {
            margin-bottom: 18px;
            page-break-inside: avoid;
        }
        
        .section-title {
            background: linear-gradient(135deg, #f7fbfc 0%, #d6e6f2 100%);
            color: #333;
            font-size: 14px;
            font-weight: bold;
            padding: 8px 12px;
            margin-bottom: 10px;
            border-left: 4px solid #769fcd;
        }
        
        .section-content {
            padding: 0 8px;
        }
        
        .overview-grid {
            margin-bottom: 12px;
        }
        
        .overview-item {
            margin-bottom: 8px;
        }
        
        .overview-item strong {
            color: #769fcd;
            font-weight: bold;
        }
        
        .highlight-subsection {
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        
        .highlight-title {
            color: #769fcd;
            font-size: 12px;
            font-weight: bold;
            margin: 0 0 6px 0;
            border-bottom: 1px solid #d6e6f2;
            padding-bottom: 3px;
        }
        
        .highlight-list {
            margin: 0;
            padding-left: 15px;
            font-size: 10px;
            line-height: 1.4;
        }
        
        .highlight-list li {
            margin-bottom: 4px;
            padding: 2px 0;
        }
        
        
        .recommendations {
            background: linear-gradient(135deg, #e8f4f8 0%, #d6e6f2 100%);
            padding: 10px;
            border-radius: 5px;
        }
        
        .recommendations ul {
            margin: 0;
            padding-left: 15px;
        }
        
        .recommendations li {
            margin-bottom: 4px;
            font-size: 10px;
        }
        
        .homework-section {
            background: #f8f9fa;
            padding: 12px;
            border: 1px solid #d6e6f2;
            border-radius: 5px;
            margin-top: 15px;
        }
        
        .homework-header {
            text-align: center;
            margin-bottom: 12px;
        }
        
        .homework-header h3 {
            color: #769fcd;
            font-size: 16px;
            margin: 0 0 4px 0;
        }
        
        .homework-subtitle {
            font-size: 10px;
            color: #666;
        }
        
        .homework-part {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .part-title {
            background: linear-gradient(135deg, #769fcd 0%, #5a7ba1 100%);
            color: black;
            font-size: 13px;
            font-weight: bold;
            padding: 8px 12px;
            margin-bottom: 8px;
            border-radius: 3px;
        }
        
        .part-instructions {
            font-size: 10px;
            color: #666;
            margin-bottom: 12px;
            font-style: italic;
        }
        
        .mcq-item {
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        
        .mcq-question {
            font-size: 11px;
            margin-bottom: 6px;
            line-height: 1.3;
        }
        
        .mcq-options {
            margin-left: 15px;
        }
        
        .mcq-option {
            font-size: 10px;
            margin-bottom: 3px;
            padding: 2px 0;
        }
        
        .construction-item {
            margin-bottom: 18px;
            page-break-inside: avoid;
            display: table;
            width: 100%;
        }
        
        .construction-number {
            display: table-cell;
            width: 30px;
            font-weight: bold;
            font-size: 11px;
            vertical-align: top;
            padding-top: 2px;
        }
        
        .construction-content {
            display: table-cell;
            vertical-align: top;
        }
        
        .construction-instruction {
            font-size: 10px;
            margin-bottom: 4px;
            line-height: 1.3;
        }
        
        .construction-example {
            font-size: 10px;
            color: #555;
            margin-bottom: 6px;
            line-height: 1.3;
        }
        
        .construction-space {
            font-size: 10px;
            margin-bottom: 8px;
            line-height: 1.5;
        }
        
        .footer-notes {
            background: #e8f4f8;
            padding: 8px;
            border-radius: 3px;
            margin-top: 10px;
            font-size: 9px;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .no-break {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>Daily Progress Summary</h1>
        <div class="meta">
            <strong>Date:</strong> {{ $report['date'] ? date('F j, Y', strtotime($report['date'])) : date('F j, Y') }}<br>
            <strong>Student:</strong> {{ $report['student_name'] ?? '[Student Name]' }}<br>
            <strong>Class Level:</strong> {{ $report['class_level'] ?? '[Level]' }}
        </div>
    </div>

    <!-- Progress Overview -->
    <div class="section">
        <div class="section-title">📝 Today's Progress Overview</div>
        <div class="section-content">
            <div class="overview-grid">
                <div class="overview-item">
                    <strong>Lesson Focus:</strong> {{ is_array($report['lesson_focus'] ?? null) ? implode(' ', $report['lesson_focus']) : ($report['lesson_focus'] ?? '[AI-generated summary of lesson focus and topics]') }}
                </div>
                <div class="overview-item">
                    <strong>Student Performance:</strong> {{ is_array($report['student_performance'] ?? null) ? implode(' ', $report['student_performance']) : ($report['student_performance'] ?? '[AI analysis of engagement and comprehension]') }}
                </div>
                <div class="overview-item">
                    <strong>Key Achievements:</strong> {{ is_array($report['key_achievements'] ?? null) ? implode(' ', $report['key_achievements']) : ($report['key_achievements'] ?? '[Specific accomplishments during the lesson]') }}
                </div>
                <div class="overview-item">
                    <strong>Areas for Improvement:</strong> {{ is_array($report['areas_for_improvement'] ?? null) ? implode(' ', $report['areas_for_improvement']) : ($report['areas_for_improvement'] ?? '[Constructive feedback areas]') }}
                </div>
            </div>
        </div>
    </div>

    <!-- Lesson Highlights -->
    @if(isset($report['lesson_highlights']) && is_array($report['lesson_highlights']))
    <div class="section">
        <div class="section-title">📝 Lesson Highlights</div>
        <div class="section-content">
            
            <!-- Vocabulary Learned -->
            @if(isset($report['lesson_highlights']['vocabulary_learned']) && is_array($report['lesson_highlights']['vocabulary_learned']))
            <div class="highlight-subsection">
                <h4 class="highlight-title">📚 Vocabulary Learned</h4>
                <ul class="highlight-list">
                    @foreach($report['lesson_highlights']['vocabulary_learned'] as $vocab)
                        <li>{{ is_array($vocab) ? implode(' - ', $vocab) : $vocab }}</li>
                    @endforeach
                </ul>
            </div>
            @endif

            <!-- Grammar Errors Addressed -->
            @if(isset($report['lesson_highlights']['grammar_errors_addressed']) && is_array($report['lesson_highlights']['grammar_errors_addressed']))
            <div class="highlight-subsection">
                <h4 class="highlight-title">📝 Grammar Errors Addressed</h4>
                <ul class="highlight-list">
                    @foreach($report['lesson_highlights']['grammar_errors_addressed'] as $error)
                        <li>
                            @php
                                $errorText = is_array($error) ? implode(' ', $error) : $error;
                                // Try to split by common separators to find wrong/right parts
                                if (strpos($errorText, ' -> ') !== false) {
                                    $parts = explode(' -> ', $errorText, 2);
                                    $wrongPart = trim($parts[0]);
                                    $rightPart = trim($parts[1]);
                                } elseif (strpos($errorText, ' | ') !== false) {
                                    $parts = explode(' | ', $errorText, 2);
                                    $wrongPart = trim($parts[0]);
                                    $rightPart = trim($parts[1]);
                                } else {
                                    $wrongPart = $errorText;
                                    $rightPart = '';
                                }
                            @endphp
                            @if(!empty($rightPart))
                                <strong>Wrong:</strong> {{ $wrongPart }} | <strong>Right:</strong> {{ $rightPart }}
                            @else
                                <strong>Wrong:</strong> {{ $wrongPart }}
                            @endif
                        </li>
                    @endforeach
                </ul>
            </div>
            @endif

            <!-- Pronunciation Challenges -->
            @if(isset($report['lesson_highlights']['pronunciation_challenges']) && is_array($report['lesson_highlights']['pronunciation_challenges']))
            <div class="highlight-subsection">
                <h4 class="highlight-title">🗣️ Pronunciation Challenges</h4>
                <ul class="highlight-list">
                    @foreach($report['lesson_highlights']['pronunciation_challenges'] as $challenge)
                        <li>{{ is_array($challenge) ? implode(' ', $challenge) : $challenge }}</li>
                    @endforeach
                </ul>
            </div>
            @endif
            
        </div>
    </div>
    @endif


    <!-- Recommendations -->
    <div class="section no-break">
        <div class="section-title">💡 Recommendations for Next Session</div>
        <div class="section-content">
            <div class="recommendations">
                <ul>
                    @if(isset($report['recommendations']) && is_array($report['recommendations']))
                        @foreach($report['recommendations'] as $recommendation)
                            <li>{{ is_array($recommendation) ? implode(' ', $recommendation) : $recommendation }}</li>
                        @endforeach
                    @else
                        <li>Focus on specific areas identified during the lesson</li>
                        <li>Continue building vocabulary and confidence</li>
                        <li>Practice pronunciation and speaking fluency</li>
                    @endif
                </ul>
            </div>
        </div>
    </div>

    <!-- Homework Section -->
    <div class="section page-break">
        <div class="homework-section">
            <div class="homework-header">
                <h3>📚 Personalized Homework Worksheet</h3>
                <div class="homework-subtitle">Complete these exercises to reinforce today's learning objectives</div>
            </div>
            
            @if(isset($report['homework_exercises']['multiple_choice_questions']) || isset($report['homework_exercises']['sentence_constructions']))
                
                <!-- Multiple Choice Questions Section -->
                <div class="homework-part">
                    <h4 class="part-title">Part A: Multiple Choice Questions</h4>
                    <div class="part-instructions">Choose the best answer for each question by circling the letter.</div>
                    
                    @if(isset($report['homework_exercises']['multiple_choice_questions']) && is_array($report['homework_exercises']['multiple_choice_questions']))
                        @foreach($report['homework_exercises']['multiple_choice_questions'] as $index => $mcq)
                            <div class="mcq-item">
                                <div class="mcq-question">
                                    <strong>{{ $index + 1 }}.</strong> {{ is_array($mcq['question'] ?? null) ? implode(' ', $mcq['question']) : ($mcq['question'] ?? 'Sample multiple choice question') }}
                                </div>
                                @if(isset($mcq['options']) && is_array($mcq['options']))
                                    <div class="mcq-options">
                                        @foreach($mcq['options'] as $letter => $option)
                                            <div class="mcq-option">
                                                <strong>{{ strtoupper($letter) }})</strong> {{ is_array($option) ? implode(' ', $option) : $option }}
                                            </div>
                                        @endforeach
                                    </div>
                                @else
                                    <div class="mcq-options">
                                        <div class="mcq-option"><strong>A)</strong> Sample option A</div>
                                        <div class="mcq-option"><strong>B)</strong> Sample option B</div>
                                        <div class="mcq-option"><strong>C)</strong> Sample option C</div>
                                        <div class="mcq-option"><strong>D)</strong> Sample option D</div>
                                    </div>
                                @endif
                            </div>
                        @endforeach
                    @else
                        @for($i = 1; $i <= 5; $i++)
                            <div class="mcq-item">
                                <div class="mcq-question">
                                    <strong>{{ $i }}.</strong> Sample multiple choice question {{ $i }} based on lesson content
                                </div>
                                <div class="mcq-options">
                                    <div class="mcq-option"><strong>A)</strong> Sample option A</div>
                                    <div class="mcq-option"><strong>B)</strong> Sample option B</div>
                                    <div class="mcq-option"><strong>C)</strong> Sample option C</div>
                                    <div class="mcq-option"><strong>D)</strong> Sample option D</div>
                                </div>
                            </div>
                        @endfor
                    @endif
                </div>
                
                <!-- Sentence Construction Section -->
                <div class="homework-part">
                    <h4 class="part-title">Part B: Sentence Construction</h4>
                    <div class="part-instructions">Follow the instructions to create sentences. Use the examples as your guide.</div>
                    
                    @if(isset($report['homework_exercises']['sentence_constructions']) && is_array($report['homework_exercises']['sentence_constructions']))
                        @foreach($report['homework_exercises']['sentence_constructions'] as $index => $construction)
                            <div class="construction-item">
                                <div class="construction-number">{{ $index + 1 }}.</div>
                                <div class="construction-content">
                                    <div class="construction-instruction">
                                        <strong>Instructions:</strong> {{ is_array($construction['instruction'] ?? null) ? implode(' ', $construction['instruction']) : ($construction['instruction'] ?? 'Sample sentence construction instruction') }}
                                    </div>
                                    <div class="construction-example">
                                        <strong>Example:</strong> {{ is_array($construction['example'] ?? null) ? implode(' ', $construction['example']) : ($construction['example'] ?? 'Sample example sentence') }}
                                    </div>
                                    <div class="construction-space">
                                        <strong>Your sentence:</strong> ________________________________________________
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    @else
                        @for($i = 1; $i <= 5; $i++)
                            <div class="construction-item">
                                <div class="construction-number">{{ $i }}.</div>
                                <div class="construction-content">
                                    <div class="construction-instruction">
                                        <strong>Instructions:</strong> Sample sentence construction instruction {{ $i }}
                                    </div>
                                    <div class="construction-example">
                                        <strong>Example:</strong> Sample example sentence {{ $i }}
                                    </div>
                                    <div class="construction-space">
                                        <strong>Your sentence:</strong> ________________________________________________
                                    </div>
                                </div>
                            </div>
                        @endfor
                    @endif
                </div>
                
            @else
                <!-- Fallback content if homework_exercises structure is not available -->
                <div class="homework-part">
                    <h4 class="part-title">Part A: Multiple Choice Questions</h4>
                    <div class="part-instructions">Choose the best answer for each question by circling the letter.</div>
                    
                    @for($i = 1; $i <= 5; $i++)
                        <div class="mcq-item">
                            <div class="mcq-question">
                                <strong>{{ $i }}.</strong> Sample multiple choice question {{ $i }} based on lesson content
                            </div>
                            <div class="mcq-options">
                                <div class="mcq-option"><strong>A)</strong> Sample option A</div>
                                <div class="mcq-option"><strong>B)</strong> Sample option B</div>
                                <div class="mcq-option"><strong>C)</strong> Sample option C</div>
                                <div class="mcq-option"><strong>D)</strong> Sample option D</div>
                            </div>
                        </div>
                    @endfor
                </div>
                
                <div class="homework-part">
                    <h4 class="part-title">Part B: Sentence Construction</h4>
                    <div class="part-instructions">Follow the instructions to create sentences. Use the examples as your guide.</div>
                    
                    @for($i = 1; $i <= 5; $i++)
                        <div class="construction-item">
                            <div class="construction-number">{{ $i }}.</div>
                            <div class="construction-content">
                                <div class="construction-instruction">
                                    <strong>Instructions:</strong> Sample sentence construction instruction {{ $i }}
                                </div>
                                <div class="construction-example">
                                    <strong>Example:</strong> Sample example sentence {{ $i }}
                                </div>
                                <div class="construction-space">
                                    <strong>Your sentence:</strong> ________________________________________________
                                </div>
                            </div>
                        </div>
                    @endfor
                </div>
            @endif
            
            <div class="footer-notes">
                <strong>Due Date:</strong> Next class session<br>
                <strong>Instructions:</strong> Complete all exercises and bring any questions to our next meeting. 
                Focus extra attention on areas marked for improvement.
            </div>
        </div>
    </div>
</body>
</html>