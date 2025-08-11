export function MonthlyReportPreview() {
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    return (
        <div className="p-8 space-y-8">
            {/* Report Header */}
            <div className="text-center border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-[#769fcd] mb-2">
                    Monthly Progress Summary
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Report Period:</strong> {currentMonth}</p>
                    <p><strong>Student:</strong> [Student Name]</p>
                    <p><strong>Class Level:</strong> [Level]</p>
                    <p><strong>Total Sessions:</strong> [Number of sessions completed]</p>
                </div>
            </div>

            {/* Monthly Overview */}
            <div className="bg-[#f7fbfc] p-6 rounded-lg border border-[#d6e6f2]">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    📊 Monthly Learning Overview
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-medium text-gray-800 mb-3">Key Learning Areas Covered</h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                            <li>• Grammar: [Specific topics covered this month]</li>
                            <li>• Vocabulary: [Themes and word families learned]</li>
                            <li>• Speaking: [Conversation topics and pronunciation focus]</li>
                            <li>• Writing: [Types of writing practiced]</li>
                            <li>• Reading: [Comprehension skills developed]</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-800 mb-3">Progress Metrics</h3>
                        <div className="space-y-3">
                            {[
                                { skill: "Overall Progress", percentage: 78, trend: "↗️" },
                                { skill: "Engagement Level", percentage: 85, trend: "↗️" },
                                { skill: "Homework Completion", percentage: 92, trend: "→" },
                                { skill: "Class Participation", percentage: 73, trend: "↗️" }
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
                    {[
                        { 
                            skill: "Speaking & Pronunciation", 
                            level: "Intermediate+", 
                            improvement: "+15%",
                            color: "bg-blue-100 text-blue-800",
                            highlights: ["Improved confidence", "Better pronunciation", "More fluent responses"]
                        },
                        { 
                            skill: "Listening Comprehension", 
                            level: "Advanced", 
                            improvement: "+12%",
                            color: "bg-green-100 text-green-800",
                            highlights: ["Understanding complex topics", "Following rapid speech", "Excellent retention"]
                        },
                        { 
                            skill: "Reading & Vocabulary", 
                            level: "Advanced+", 
                            improvement: "+8%",
                            color: "bg-emerald-100 text-emerald-800",
                            highlights: ["Expanded vocabulary range", "Better text analysis", "Faster reading speed"]
                        },
                        { 
                            skill: "Grammar & Writing", 
                            level: "Intermediate", 
                            improvement: "+20%",
                            color: "bg-purple-100 text-purple-800",
                            highlights: ["More complex sentences", "Fewer errors", "Better organization"]
                        }
                    ].map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-[#d6e6f2] space-y-3">
                            <div className="flex justify-between items-start">
                                <h3 className="font-medium text-gray-800 text-sm">{item.skill}</h3>
                                <span className="text-xs text-green-600 font-semibold">{item.improvement}</span>
                            </div>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${item.color}`}>
                                {item.level}
                            </span>
                            <ul className="text-xs text-gray-600 space-y-1">
                                {item.highlights.map((highlight, i) => (
                                    <li key={i}>• {highlight}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-gradient-to-r from-[#d6e6f2] to-[#b9d7ea] p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    🏆 Key Achievements This Month
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-medium text-gray-800 mb-3">Breakthrough Moments</h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                            <li>🎯 Successfully completed first advanced reading comprehension</li>
                            <li>🗣️ Delivered first 5-minute presentation with confidence</li>
                            <li>✍️ Wrote first error-free complex paragraph</li>
                            <li>🎵 Mastered challenging pronunciation patterns</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-800 mb-3">Consistency Highlights</h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                            <li>📚 Perfect homework completion rate (100%)</li>
                            <li>⏰ Excellent punctuality and attendance</li>
                            <li>💪 Consistent effort in challenging topics</li>
                            <li>🤝 Great collaboration during group activities</li>
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
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded border border-amber-200">
                            <h3 className="font-medium text-amber-800 mb-2">Priority 1: Grammar</h3>
                            <p className="text-sm text-gray-700">Continue practicing complex verb tenses and conditional structures</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-amber-200">
                            <h3 className="font-medium text-amber-800 mb-2">Priority 2: Fluency</h3>
                            <p className="text-sm text-gray-700">Work on reducing hesitation and increasing natural speech flow</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-amber-200">
                            <h3 className="font-medium text-amber-800 mb-2">Priority 3: Vocabulary</h3>
                            <p className="text-sm text-gray-700">Expand academic and professional vocabulary range</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Month Goals */}
            <div className="border-t border-gray-200 pt-8">
                <div className="bg-[#f7fbfc] p-6 rounded-lg border border-[#d6e6f2]">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        🚀 Goals for Next Month
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-800 mb-3">Learning Objectives</h3>
                            <ul className="text-sm text-gray-700 space-y-2">
                                <li>📖 Master advanced reading strategies</li>
                                <li>🎤 Improve presentation and public speaking skills</li>
                                <li>📝 Develop academic writing proficiency</li>
                                <li>🔧 Strengthen grammar fundamentals</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-800 mb-3">Recommended Activities</h3>
                            <ul className="text-sm text-gray-700 space-y-2">
                                <li>📺 Watch English documentaries with subtitles</li>
                                <li>📚 Read one article daily from English news sources</li>
                                <li>✍️ Keep a daily journal in English</li>
                                <li>🗣️ Practice speaking with language exchange partners</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-[#d6e6f2] rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>Teacher's Note:</strong> Excellent progress this month! Continue with current momentum 
                            while focusing on the priority areas identified. Next month we'll introduce more advanced 
                            conversational topics and business English elements.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}