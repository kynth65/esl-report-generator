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
        
        .skills-grid {
            display: table;
            width: 100%;
            margin-bottom: 12px;
        }
        
        .skill-item {
            display: table-row;
            margin-bottom: 6px;
        }
        
        .skill-name, .skill-level, .skill-details {
            display: table-cell;
            padding: 6px 8px;
            border-bottom: 1px solid #e0e0e0;
            vertical-align: top;
        }
        
        .skill-name {
            font-weight: bold;
            width: 25%;
            background: #f9f9f9;
        }
        
        .skill-level {
            width: 20%;
            text-align: center;
        }
        
        .skill-details {
            width: 55%;
            font-size: 10px;
        }
        
        .level-excellent {
            background: #d4edda;
            color: #155724;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        
        .level-good {
            background: #d1ecf1;
            color: #0c5460;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        
        .level-progressing {
            background: #cce5ff;
            color: #004085;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        
        .level-needs-practice {
            background: #fff3cd;
            color: #856404;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
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
        
        .homework-grid {
            display: table;
            width: 100%;
        }
        
        .homework-item {
            display: table-row;
            page-break-inside: avoid;
        }
        
        .homework-number, .homework-type, .homework-description, .homework-time {
            display: table-cell;
            padding: 8px 6px;
            border-bottom: 1px solid #ddd;
            vertical-align: top;
        }
        
        .homework-number {
            width: 8%;
            text-align: center;
            font-weight: bold;
            background: #769fcd;
            color: white;
            border-radius: 3px;
        }
        
        .homework-type {
            width: 22%;
            font-weight: bold;
            font-size: 10px;
        }
        
        .homework-description {
            width: 55%;
            font-size: 10px;
            line-height: 1.3;
        }
        
        .homework-time {
            width: 15%;
            font-size: 9px;
            text-align: center;
            background: #f0f0f0;
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

    <!-- Skills Assessment -->
    <div class="section">
        <div class="section-title">📊 Skills Assessment</div>
        <div class="section-content">
            <div class="skills-grid">
                @if(isset($report['skills_assessment']) && is_array($report['skills_assessment']))
                    @foreach($report['skills_assessment'] as $skillKey => $assessment)
                        <div class="skill-item">
                            <div class="skill-name">{{ ucwords(str_replace('_', ' & ', $skillKey)) }}</div>
                            <div class="skill-level">
                                <span class="level-{{ strtolower(str_replace(' ', '-', $assessment['level'])) }}">
                                    {{ $assessment['level'] }}
                                </span>
                            </div>
                            <div class="skill-details">{{ is_array($assessment['details'] ?? null) ? implode(' ', $assessment['details']) : ($assessment['details'] ?? '') }}</div>
                        </div>
                    @endforeach
                @else
                    <div class="skill-item">
                        <div class="skill-name">Speaking & Pronunciation</div>
                        <div class="skill-level"><span class="level-progressing">Progressing</span></div>
                        <div class="skill-details">Sample assessment details</div>
                    </div>
                    <div class="skill-item">
                        <div class="skill-name">Listening Comprehension</div>
                        <div class="skill-level"><span class="level-good">Good</span></div>
                        <div class="skill-details">Sample assessment details</div>
                    </div>
                    <div class="skill-item">
                        <div class="skill-name">Reading & Vocabulary</div>
                        <div class="skill-level"><span class="level-excellent">Excellent</span></div>
                        <div class="skill-details">Sample assessment details</div>
                    </div>
                    <div class="skill-item">
                        <div class="skill-name">Grammar & Writing</div>
                        <div class="skill-level"><span class="level-needs-practice">Needs Practice</span></div>
                        <div class="skill-details">Sample assessment details</div>
                    </div>
                @endif
            </div>
        </div>
    </div>

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
            
            <div class="homework-grid">
                @if(isset($report['homework_exercises']) && is_array($report['homework_exercises']))
                    @foreach($report['homework_exercises'] as $index => $exercise)
                        <div class="homework-item">
                            <div class="homework-number">{{ $index + 1 }}</div>
                            <div class="homework-type">{{ is_array($exercise['type'] ?? null) ? implode(' ', $exercise['type']) : ($exercise['type'] ?? 'Exercise') }}</div>
                            <div class="homework-description">{{ is_array($exercise['description'] ?? null) ? implode(' ', $exercise['description']) : ($exercise['description'] ?? 'Exercise description') }}</div>
                            <div class="homework-time">{{ is_array($exercise['estimated_time'] ?? null) ? implode(' ', $exercise['estimated_time']) : ($exercise['estimated_time'] ?? '5-10 min') }}</div>
                        </div>
                    @endforeach
                @else
                    @for($i = 1; $i <= 10; $i++)
                        <div class="homework-item">
                            <div class="homework-number">{{ $i }}</div>
                            <div class="homework-type">
                                @if($i <= 3)
                                    Vocabulary Practice
                                @elseif($i <= 6)
                                    Grammar Exercise
                                @elseif($i <= 8)
                                    Reading Comprehension
                                @else
                                    Writing Practice
                                @endif
                            </div>
                            <div class="homework-description">AI-generated exercise based on lesson content and student needs</div>
                            <div class="homework-time">{{ 5 + ($i * 2) }} min</div>
                        </div>
                    @endfor
                @endif
            </div>
            
            <div class="footer-notes">
                <strong>Due Date:</strong> Next class session<br>
                <strong>Instructions:</strong> Complete all exercises and bring any questions to our next meeting. 
                Focus extra attention on areas marked for improvement.
            </div>
        </div>
    </div>
</body>
</html>