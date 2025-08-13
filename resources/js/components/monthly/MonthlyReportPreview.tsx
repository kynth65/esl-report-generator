interface MonthlyReportData {
    period: string;
    total_sessions: number;
    overall_progress: {
        summary: string;
        achievements: string[];
        improvements: string[];
        focus_areas: string[];
    };
    skills_progression: {
        [key: string]: {
            initial_level: string;
            current_level: string;
            improvement_percentage: number;
            highlights: string[];
        };
    };
    consistency_metrics: {
        attendance_rate: number;
        engagement_level: number;
        homework_completion: number;
        participation_score: number;
    };
    recommendations: string[];
    next_month_goals: string[];
}

interface MonthlyReportPreviewProps {
    data?: MonthlyReportData;
}

export function MonthlyReportPreview({ data }: MonthlyReportPreviewProps) {
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Default data for when no real data is provided
    const displayData = data || {
        period: currentMonth,
        total_sessions: 8,
        overall_progress: {
            summary: "The student has demonstrated consistent progress across all language skills this month.",
            achievements: [
                "Successfully completed first advanced reading comprehension",
                "Delivered first 5-minute presentation with confidence", 
                "Wrote first error-free complex paragraph"
            ],
            improvements: [
                "Improved confidence in speaking situations",
                "Better pronunciation of challenging sounds",
                "More fluent conversation responses"
            ],
            focus_areas: [
                "Continue practicing complex verb tenses",
                "Work on reducing hesitation in speaking",
                "Expand academic vocabulary range"
            ]
        },
        skills_progression: {
            speaking_pronunciation: {
                initial_level: "Intermediate",
                current_level: "Intermediate+",
                improvement_percentage: 15,
                highlights: [
                    "Improved confidence in discussions",
                    "Better pronunciation accuracy",
                    "More fluent responses"
                ]
            },
            listening_comprehension: {
                initial_level: "Intermediate+",
                current_level: "Advanced",
                improvement_percentage: 12,
                highlights: [
                    "Understanding complex topics",
                    "Following rapid speech",
                    "Excellent retention"
                ]
            },
            reading_vocabulary: {
                initial_level: "Advanced",
                current_level: "Advanced+",
                improvement_percentage: 8,
                highlights: [
                    "Expanded vocabulary range",
                    "Better text analysis",
                    "Faster reading speed"
                ]
            },
            grammar_writing: {
                initial_level: "Intermediate",
                current_level: "Intermediate+",
                improvement_percentage: 20,
                highlights: [
                    "More complex sentences",
                    "Fewer errors",
                    "Better organization"
                ]
            }
        },
        consistency_metrics: {
            attendance_rate: 100,
            engagement_level: 85,
            homework_completion: 92,
            participation_score: 78
        },
        recommendations: [
            "Continue with current momentum while focusing on priority areas",
            "Introduce more advanced conversational topics",
            "Practice writing longer, more complex texts"
        ],
        next_month_goals: [
            "Master advanced reading strategies",
            "Improve presentation and public speaking skills",
            "Develop academic writing proficiency"
        ]
    };

    return (
        <div className="p-8 space-y-8">
            {/* Report Header */}
            <div className="text-center border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-[#769fcd] mb-2">
                    Monthly Progress Analysis
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Report Period:</strong> {displayData.period}</p>
                    <p><strong>Total Sessions Analyzed:</strong> {displayData.total_sessions}</p>
                    <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Monthly Overview */}
            <div className="bg-[#f7fbfc] p-6 rounded-lg border border-[#d6e6f2]">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    📊 Overall Progress Summary
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-medium text-gray-800 mb-3">Progress Overview</h3>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            {displayData.overall_progress.summary}
                        </p>
                        <h4 className="font-medium text-gray-800 mb-2">Key Improvements</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                            {displayData.overall_progress.improvements.map((improvement, index) => (
                                <li key={index}>• {improvement}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-800 mb-3">Consistency Metrics</h3>
                        <div className="space-y-3">
                            {[
                                { skill: "Attendance Rate", percentage: displayData.consistency_metrics.attendance_rate, trend: "↗️" },
                                { skill: "Engagement Level", percentage: displayData.consistency_metrics.engagement_level, trend: "↗️" },
                                { skill: "Homework Completion", percentage: displayData.consistency_metrics.homework_completion, trend: "→" },
                                { skill: "Class Participation", percentage: displayData.consistency_metrics.participation_score, trend: "↗️" }
                            ].map((metric, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">{metric.skill}</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                                            <div 
                                                className="h-2 bg-[#769fcd] rounded-full" 
                                                style={{ width: `${metric.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-600 w-8">{metric.percentage}%</span>
                                        <span className="text-sm">{metric.trend}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Development Grid */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills Development Analysis</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(displayData.skills_progression).map(([skillKey, skillData], index) => {
                        const skillNames = {
                            speaking_pronunciation: "Speaking & Pronunciation",
                            listening_comprehension: "Listening Comprehension", 
                            reading_vocabulary: "Reading & Vocabulary",
                            grammar_writing: "Grammar & Writing"
                        };
                        
                        const colors = [
                            "bg-blue-100 text-blue-800",
                            "bg-green-100 text-green-800", 
                            "bg-emerald-100 text-emerald-800",
                            "bg-purple-100 text-purple-800"
                        ];
                        
                        return (
                            <div key={skillKey} className="bg-white p-4 rounded-lg border border-[#d6e6f2] space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-gray-800 text-sm">
                                        {skillNames[skillKey as keyof typeof skillNames] || skillKey}
                                    </h3>
                                    <span className="text-xs text-green-600 font-semibold">
                                        +{skillData.improvement_percentage}%
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colors[index % colors.length]}`}>
                                        {skillData.current_level}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                        From: {skillData.initial_level}
                                    </div>
                                </div>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    {skillData.highlights.map((highlight, i) => (
                                        <li key={i}>• {highlight}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-gradient-to-r from-[#d6e6f2] to-[#b9d7ea] p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    🏆 Key Achievements This Period
                </h2>
                <div className="grid md:grid-cols-1 gap-6">
                    <div>
                        <h3 className="font-medium text-gray-800 mb-3">Breakthrough Moments</h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                            {displayData.overall_progress.achievements.map((achievement, index) => (
                                <li key={index}>🎯 {achievement}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    🎯 Focus Areas for Continued Growth
                </h2>
                <div className="space-y-4">
                    <div className="grid md:grid-cols-1 gap-4">
                        {displayData.overall_progress.focus_areas.map((area, index) => (
                            <div key={index} className="bg-white p-4 rounded border border-amber-200">
                                <h3 className="font-medium text-amber-800 mb-2">Priority {index + 1}</h3>
                                <p className="text-sm text-gray-700">{area}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recommendations and Goals */}
            <div className="border-t border-gray-200 pt-8">
                <div className="bg-[#f7fbfc] p-6 rounded-lg border border-[#d6e6f2]">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        🚀 Recommendations & Next Steps
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-800 mb-3">Teacher Recommendations</h3>
                            <ul className="text-sm text-gray-700 space-y-2">
                                {displayData.recommendations.map((recommendation, index) => (
                                    <li key={index}>📋 {recommendation}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-800 mb-3">Goals for Next Period</h3>
                            <ul className="text-sm text-gray-700 space-y-2">
                                {displayData.next_month_goals.map((goal, index) => (
                                    <li key={index}>🎯 {goal}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-[#d6e6f2] rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>Analysis Summary:</strong> This monthly analysis is based on {displayData.total_sessions} daily reports, 
                            providing comprehensive insights into learning patterns, skill development, and progress trends. 
                            Continue building on the identified strengths while addressing the focus areas for optimal learning outcomes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}