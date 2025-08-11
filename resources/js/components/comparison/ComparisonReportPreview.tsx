export function ComparisonReportPreview() {
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    return (
        <div className="p-8 space-y-8">
            {/* Report Header */}
            <div className="text-center border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-[#769fcd] mb-2">
                    Monthly Comparison Report
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Comparison Period:</strong> {previousMonth} vs {currentMonth}</p>
                    <p><strong>Student:</strong> [Student Name]</p>
                    <p><strong>Class Level:</strong> [Level]</p>
                    <p><strong>Analysis Date:</strong> {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-gradient-to-r from-[#f7fbfc] to-[#d6e6f2] p-6 rounded-lg border border-[#d6e6f2]">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    📈 Executive Summary
                </h2>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg border border-[#b9d7ea] text-center">
                        <div className="text-2xl font-bold text-green-600">+18%</div>
                        <div className="text-sm text-gray-600">Overall Progress</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-[#b9d7ea] text-center">
                        <div className="text-2xl font-bold text-blue-600">4/4</div>
                        <div className="text-sm text-gray-600">Skills Improved</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-[#b9d7ea] text-center">
                        <div className="text-2xl font-bold text-[#769fcd]">A-</div>
                        <div className="text-sm text-gray-600">Current Grade</div>
                    </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                    Significant improvement observed across all skill areas this month. Student shows enhanced confidence, 
                    better engagement, and notable progress in previously challenging areas. Recommend continuing current 
                    learning strategy while introducing more advanced challenges.
                </p>
            </div>

            {/* Side-by-Side Comparison Charts */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Performance Comparison</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Previous Month */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-4 text-center">
                            {previousMonth}
                        </h3>
                        <div className="space-y-4">
                            {[
                                { skill: "Speaking", score: 65, color: "bg-blue-400" },
                                { skill: "Listening", score: 78, color: "bg-green-400" },
                                { skill: "Reading", score: 82, color: "bg-emerald-400" },
                                { skill: "Writing", score: 58, color: "bg-purple-400" },
                                { skill: "Grammar", score: 70, color: "bg-orange-400" }
                            ].map((item, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">{item.skill}</span>
                                        <span className="font-medium">{item.score}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full">
                                        <div 
                                            className={`h-2 ${item.color} rounded-full transition-all duration-500`} 
                                            style={{ width: `${item.score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Current Month */}
                    <div className="bg-[#f7fbfc] p-6 rounded-lg border-2 border-[#769fcd]">
                        <h3 className="font-semibold text-[#769fcd] mb-4 text-center">
                            {currentMonth} ⭐
                        </h3>
                        <div className="space-y-4">
                            {[
                                { skill: "Speaking", score: 78, improvement: 13, color: "bg-blue-500" },
                                { skill: "Listening", score: 85, improvement: 7, color: "bg-green-500" },
                                { skill: "Reading", score: 88, improvement: 6, color: "bg-emerald-500" },
                                { skill: "Writing", score: 72, improvement: 14, color: "bg-purple-500" },
                                { skill: "Grammar", score: 84, improvement: 14, color: "bg-orange-500" }
                            ].map((item, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">{item.skill}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">{item.score}%</span>
                                            <span className="text-xs text-green-600 font-semibold">
                                                +{item.improvement}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full">
                                        <div 
                                            className={`h-2 ${item.color} rounded-full transition-all duration-500`} 
                                            style={{ width: `${item.score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Improvement Indicators */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">🎯 Detailed Improvement Analysis</h2>
                <div className="space-y-4">
                    {[
                        {
                            skill: "Speaking & Pronunciation",
                            trend: "significant_improvement",
                            details: "Noticeable improvement in fluency and confidence. Better pronunciation of challenging sounds.",
                            metrics: { previous: 65, current: 78, change: "+13%" }
                        },
                        {
                            skill: "Writing Skills",
                            trend: "major_improvement", 
                            details: "Dramatic improvement in sentence structure and vocabulary usage. Fewer grammatical errors.",
                            metrics: { previous: 58, current: 72, change: "+14%" }
                        },
                        {
                            skill: "Grammar Understanding",
                            trend: "significant_improvement",
                            details: "Much better grasp of complex tenses and conditional structures.",
                            metrics: { previous: 70, current: 84, change: "+14%" }
                        },
                        {
                            skill: "Listening Comprehension",
                            trend: "steady_improvement",
                            details: "Consistent progress in understanding native speed conversations.",
                            metrics: { previous: 78, current: 85, change: "+7%" }
                        },
                        {
                            skill: "Reading & Vocabulary",
                            trend: "steady_improvement",
                            details: "Expanded vocabulary and faster reading comprehension.",
                            metrics: { previous: 82, current: 88, change: "+6%" }
                        }
                    ].map((item, index) => {
                        const getTrendInfo = (trend: string) => {
                            switch (trend) {
                                case 'major_improvement':
                                    return { icon: '🚀', color: 'border-green-500 bg-green-50', badgeColor: 'bg-green-500 text-white' };
                                case 'significant_improvement':
                                    return { icon: '📈', color: 'border-blue-500 bg-blue-50', badgeColor: 'bg-blue-500 text-white' };
                                case 'steady_improvement':
                                    return { icon: '➡️', color: 'border-emerald-500 bg-emerald-50', badgeColor: 'bg-emerald-500 text-white' };
                                default:
                                    return { icon: '📊', color: 'border-gray-300 bg-gray-50', badgeColor: 'bg-gray-500 text-white' };
                            }
                        };
                        
                        const trendInfo = getTrendInfo(item.trend);
                        
                        return (
                            <div key={index} className={`p-4 rounded-lg border-2 ${trendInfo.color}`}>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xl">{trendInfo.icon}</span>
                                        <h3 className="font-semibold text-gray-800">{item.skill}</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${trendInfo.badgeColor}`}>
                                        {item.metrics.change}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">{item.details}</p>
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Previous: {item.metrics.previous}%</span>
                                    <span>Current: {item.metrics.current}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recommendations Summary */}
            <div className="bg-gradient-to-r from-[#d6e6f2] to-[#b9d7ea] p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    💡 Strategic Recommendations
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                            🎯 Continue Current Success Strategies
                        </h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                            <li>• Maintain current speaking practice routine - showing excellent results</li>
                            <li>• Continue grammar-focused exercises - major improvement observed</li>
                            <li>• Keep using writing templates and structured approaches</li>
                            <li>• Sustained vocabulary building activities are working well</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                            🚀 Next Level Challenges
                        </h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                            <li>• Introduce advanced conversation topics and debates</li>
                            <li>• Add more complex reading materials and analysis tasks</li>
                            <li>• Begin preparation for higher-level certifications</li>
                            <li>• Incorporate business English and professional communication</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Teacher's Comparative Analysis */}
            <div className="border-t border-gray-200 pt-8">
                <div className="bg-white p-6 rounded-lg border-2 border-[#d6e6f2]">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        👩‍🏫 Teacher's Comparative Analysis
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-[#f7fbfc] rounded-lg border border-[#d6e6f2]">
                            <h3 className="font-medium text-gray-800 mb-2">Most Notable Changes</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                The student has shown remarkable transformation this month. Previously hesitant in speaking activities, 
                                they now actively participate and even volunteer for presentations. The improvement in writing is 
                                particularly impressive - from struggling with basic sentence construction to producing coherent 
                                paragraphs with complex ideas.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <h3 className="font-medium text-amber-800 mb-2">Key Success Factors</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Consistent homework completion, active class participation, and willingness to practice outside 
                                class hours have been crucial. The student's positive attitude and openness to feedback have 
                                accelerated their learning significantly.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-medium text-blue-800 mb-2">Future Learning Path</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Ready to move to more advanced materials and take on leadership roles in group activities. 
                                Consider introducing exam preparation materials and real-world communication scenarios. 
                                The trajectory suggests potential for achieving advanced proficiency within 6-8 months.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}