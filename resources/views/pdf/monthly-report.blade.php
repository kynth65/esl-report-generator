<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Monthly Progress Analysis - {{ $report['period'] ?? 'Monthly Report' }}</title>
    <style>
        @page {
            margin: 0.5in;
            @top-center {
                content: "ESL Monthly Progress Analysis";
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
            margin-bottom: 20px;
            break-inside: avoid;
        }
        
        .section-title {
            color: #769fcd;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
            border-bottom: 1px solid #d6e6f2;
            padding-bottom: 4px;
        }
        
        .subsection-title {
            color: #333;
            font-size: 12px;
            font-weight: bold;
            margin: 12px 0 6px 0;
        }
        
        .grid {
            display: table;
            width: 100%;
            table-layout: fixed;
        }
        
        .grid-col {
            display: table-cell;
            vertical-align: top;
            padding-right: 15px;
        }
        
        .grid-col:last-child {
            padding-right: 0;
        }
        
        .grid-2 .grid-col {
            width: 50%;
        }
        
        .grid-4 .grid-col {
            width: 25%;
        }
        
        .progress-bar {
            background: #f0f0f0;
            height: 8px;
            border-radius: 4px;
            margin: 4px 0;
            position: relative;
        }
        
        .progress-fill {
            background: #769fcd;
            height: 100%;
            border-radius: 4px;
        }
        
        .skill-card {
            border: 1px solid #d6e6f2;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
            background: #fafbfc;
        }
        
        .skill-card-title {
            font-weight: bold;
            font-size: 10px;
            margin-bottom: 6px;
            display: flex;
            justify-content: space-between;
        }
        
        .improvement-badge {
            color: #059669;
            font-weight: bold;
        }
        
        .level-badge {
            background: #dbeafe;
            color: #1e40af;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 4px;
        }
        
        .achievement-section {
            background: linear-gradient(135deg, #d6e6f2, #b9d7ea);
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .focus-section {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .recommendations-section {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
        }
        
        ul {
            margin: 6px 0;
            padding-left: 15px;
        }
        
        li {
            margin-bottom: 3px;
            font-size: 10px;
        }
        
        .metric-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            font-size: 10px;
        }
        
        .metric-label {
            flex: 1;
        }
        
        .metric-value {
            margin-left: 10px;
            font-weight: bold;
        }
        
        .summary-text {
            background: #f7fbfc;
            border-left: 4px solid #769fcd;
            padding: 10px;
            margin: 10px 0;
            font-style: italic;
        }
        
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 9px;
            color: #666;
            border-top: 1px solid #d6e6f2;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Monthly Progress Analysis Report</h1>
        <div class="meta">
            <strong>Reporting Period:</strong> {{ $report['period'] ?? date('F Y') }}<br>
            <strong>Total Sessions Analyzed:</strong> {{ $report['total_sessions'] ?? 0 }}<br>
            <strong>Generated:</strong> {{ $generated_at ?? date('F j, Y \a\t g:i A') }}
        </div>
    </div>

    <!-- Overall Progress Summary -->
    <div class="section">
        <div class="section-title">📊 Overall Progress Summary</div>
        
        <div class="summary-text">
            {{ $report['overall_progress']['summary'] ?? 'Progress summary not available.' }}
        </div>
        
        <div class="grid grid-2">
            <div class="grid-col">
                <div class="subsection-title">Key Improvements</div>
                <ul>
                    @if(isset($report['overall_progress']['improvements']) && is_array($report['overall_progress']['improvements']))
                        @foreach($report['overall_progress']['improvements'] as $improvement)
                            <li>{{ $improvement }}</li>
                        @endforeach
                    @else
                        <li>No specific improvements recorded</li>
                    @endif
                </ul>
            </div>
            
            <div class="grid-col">
                <div class="subsection-title">Consistency Metrics</div>
                @if(isset($report['consistency_metrics']) && is_array($report['consistency_metrics']))
                    <div class="metric-row">
                        <span class="metric-label">Attendance Rate</span>
                        <div class="progress-bar" style="width: 60px;">
                            <div class="progress-fill" style="width: {{ $report['consistency_metrics']['attendance_rate'] ?? 0 }}%;"></div>
                        </div>
                        <span class="metric-value">{{ $report['consistency_metrics']['attendance_rate'] ?? 0 }}%</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Engagement Level</span>
                        <div class="progress-bar" style="width: 60px;">
                            <div class="progress-fill" style="width: {{ $report['consistency_metrics']['engagement_level'] ?? 0 }}%;"></div>
                        </div>
                        <span class="metric-value">{{ $report['consistency_metrics']['engagement_level'] ?? 0 }}%</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Homework Completion</span>
                        <div class="progress-bar" style="width: 60px;">
                            <div class="progress-fill" style="width: {{ $report['consistency_metrics']['homework_completion'] ?? 0 }}%;"></div>
                        </div>
                        <span class="metric-value">{{ $report['consistency_metrics']['homework_completion'] ?? 0 }}%</span>
                    </div>
                    <div class="metric-row">
                        <span class="metric-label">Class Participation</span>
                        <div class="progress-bar" style="width: 60px;">
                            <div class="progress-fill" style="width: {{ $report['consistency_metrics']['participation_score'] ?? 0 }}%;"></div>
                        </div>
                        <span class="metric-value">{{ $report['consistency_metrics']['participation_score'] ?? 0 }}%</span>
                    </div>
                @else
                    <p style="font-size: 10px; color: #666;">Consistency metrics not available.</p>
                @endif
            </div>
        </div>
    </div>

    <!-- Skills Development Analysis -->
    <div class="section">
        <div class="section-title">📈 Skills Development Analysis</div>
        
        @if(isset($report['skills_progression']) && is_array($report['skills_progression']))
            @php
                $skillNames = [
                    'speaking_pronunciation' => 'Speaking & Pronunciation',
                    'listening_comprehension' => 'Listening Comprehension',
                    'reading_vocabulary' => 'Reading & Vocabulary',
                    'grammar_writing' => 'Grammar & Writing'
                ];
            @endphp
            
            @foreach($report['skills_progression'] as $skillKey => $skillData)
                <div class="skill-card">
                    <div class="skill-card-title">
                        <span>{{ $skillNames[$skillKey] ?? ucfirst(str_replace('_', ' ', $skillKey)) }}</span>
                        <span class="improvement-badge">+{{ $skillData['improvement_percentage'] ?? 0 }}%</span>
                    </div>
                    
                    <div style="margin-bottom: 6px;">
                        <span class="level-badge">{{ $skillData['current_level'] ?? 'N/A' }}</span>
                        <span style="font-size: 9px; color: #666; margin-left: 8px;">
                            From: {{ $skillData['initial_level'] ?? 'N/A' }}
                        </span>
                    </div>
                    
                    @if(isset($skillData['highlights']) && is_array($skillData['highlights']))
                        <ul style="margin: 6px 0 0 0;">
                            @foreach($skillData['highlights'] as $highlight)
                                <li style="font-size: 9px;">{{ $highlight }}</li>
                            @endforeach
                        </ul>
                    @endif
                </div>
            @endforeach
        @else
            <p style="font-size: 10px; color: #666;">Skills progression data not available.</p>
        @endif
    </div>

    <!-- Key Achievements -->
    <div class="section">
        <div class="achievement-section">
            <div class="subsection-title">🏆 Key Achievements This Period</div>
            
            @if(isset($report['overall_progress']['achievements']) && is_array($report['overall_progress']['achievements']))
                <ul>
                    @foreach($report['overall_progress']['achievements'] as $achievement)
                        <li>🎯 {{ $achievement }}</li>
                    @endforeach
                </ul>
            @else
                <p style="font-size: 10px; color: #666;">No specific achievements recorded for this period.</p>
            @endif
        </div>
    </div>

    <!-- Focus Areas for Growth -->
    <div class="section">
        <div class="focus-section">
            <div class="subsection-title">🎯 Focus Areas for Continued Growth</div>
            
            @if(isset($report['overall_progress']['focus_areas']) && is_array($report['overall_progress']['focus_areas']))
                @foreach($report['overall_progress']['focus_areas'] as $index => $area)
                    <div style="margin-bottom: 10px;">
                        <strong style="color: #f59e0b;">Priority {{ $index + 1 }}:</strong>
                        <span style="font-size: 10px;">{{ $area }}</span>
                    </div>
                @endforeach
            @else
                <p style="font-size: 10px; color: #666;">No specific focus areas identified.</p>
            @endif
        </div>
    </div>

    <!-- Recommendations and Next Steps -->
    <div class="section">
        <div class="recommendations-section">
            <div class="subsection-title">🚀 Recommendations & Next Steps</div>
            
            <div class="grid grid-2">
                <div class="grid-col">
                    <div style="font-weight: bold; margin-bottom: 6px; font-size: 11px;">Teacher Recommendations</div>
                    @if(isset($report['recommendations']) && is_array($report['recommendations']))
                        <ul>
                            @foreach($report['recommendations'] as $recommendation)
                                <li>📋 {{ $recommendation }}</li>
                            @endforeach
                        </ul>
                    @else
                        <p style="font-size: 10px; color: #666;">No specific recommendations provided.</p>
                    @endif
                </div>
                
                <div class="grid-col">
                    <div style="font-weight: bold; margin-bottom: 6px; font-size: 11px;">Goals for Next Period</div>
                    @if(isset($report['next_month_goals']) && is_array($report['next_month_goals']))
                        <ul>
                            @foreach($report['next_month_goals'] as $goal)
                                <li>🎯 {{ $goal }}</li>
                            @endforeach
                        </ul>
                    @else
                        <p style="font-size: 10px; color: #666;">No specific goals set for next period.</p>
                    @endif
                </div>
            </div>
            
            <div style="margin-top: 15px; padding: 8px; background: rgba(14, 165, 233, 0.1); border-radius: 4px;">
                <strong style="font-size: 10px;">Analysis Summary:</strong>
                <span style="font-size: 10px;">
                    This monthly analysis is based on {{ $report['total_sessions'] ?? 0 }} daily reports, 
                    providing comprehensive insights into learning patterns, skill development, and progress trends. 
                    Continue building on the identified strengths while addressing the focus areas for optimal learning outcomes.
                </span>
            </div>
        </div>
    </div>

</body>
</html>