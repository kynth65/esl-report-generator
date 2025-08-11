export function DailyReportPreview() {
    return (
        <div className="p-8 space-y-8">
            {/* Report Header */}
            <div className="text-center border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-[#769fcd] mb-2">
                    Daily Progress Summary
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Student:</strong> [Student Name]</p>
                    <p><strong>Class Level:</strong> [Level]</p>
                </div>
            </div>

            {/* Daily Summary Section */}
            <div className="space-y-6">
                <div className="bg-[#f7fbfc] p-6 rounded-lg border border-[#d6e6f2]">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        📝 Today's Progress Overview
                    </h2>
                    <div className="prose prose-sm text-gray-700 space-y-3">
                        <p>
                            <strong>Lesson Focus:</strong> [AI-generated summary of today's lesson focus and main topics covered]
                        </p>
                        <p>
                            <strong>Student Performance:</strong> [AI analysis of student engagement, participation, and comprehension levels]
                        </p>
                        <p>
                            <strong>Key Achievements:</strong> [Specific accomplishments and breakthroughs observed during the lesson]
                        </p>
                        <p>
                            <strong>Areas for Improvement:</strong> [Constructive feedback on areas that need additional attention]
                        </p>
                    </div>
                </div>

                {/* Skills Assessment Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { skill: "Speaking & Pronunciation", level: "Progressing", color: "bg-blue-100 text-blue-800" },
                        { skill: "Listening Comprehension", level: "Good", color: "bg-green-100 text-green-800" },
                        { skill: "Reading & Vocabulary", level: "Excellent", color: "bg-emerald-100 text-emerald-800" },
                        { skill: "Grammar & Writing", level: "Needs Practice", color: "bg-amber-100 text-amber-800" }
                    ].map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-[#d6e6f2]">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">{item.skill}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.color}`}>
                                    {item.level}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-r from-[#d6e6f2] to-[#b9d7ea] p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        💡 Recommendations for Next Session
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Focus on [specific grammar point] with additional practice exercises</li>
                        <li>• Continue vocabulary building in [topic area] to reinforce today's learning</li>
                        <li>• Practice pronunciation of [specific sounds/words] identified during the lesson</li>
                        <li>• Review and expand on [concept] that showed good understanding</li>
                    </ul>
                </div>
            </div>

            {/* Homework Section */}
            <div className="border-t border-gray-200 pt-8">
                <div className="bg-[#f7fbfc] p-6 rounded-lg border border-[#d6e6f2]">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        📚 Personalized Homework Worksheet
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Complete these 10 exercises to reinforce today's learning objectives
                    </p>
                    
                    <div className="space-y-4">
                        {Array.from({ length: 10 }, (_, i) => (
                            <div key={i} className="bg-white p-4 rounded border border-[#d6e6f2]">
                                <div className="flex items-start space-x-3">
                                    <span className="flex-shrink-0 w-8 h-8 bg-[#769fcd] text-white rounded-full flex items-center justify-center text-sm font-medium">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 space-y-2">
                                        <p className="font-medium text-gray-800">
                                            [Exercise Type]: {
                                                i < 3 ? 'Vocabulary Practice' :
                                                i < 6 ? 'Grammar Exercise' :
                                                i < 8 ? 'Reading Comprehension' :
                                                'Writing Practice'
                                            }
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            [AI-generated exercise based on today's lesson content and student's specific needs]
                                        </p>
                                        <div className="text-xs text-gray-500 mt-2">
                                            <span className="inline-block bg-gray-100 px-2 py-1 rounded">
                                                Estimated time: {Math.floor(Math.random() * 10) + 5} minutes
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-[#d6e6f2] rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>Due Date:</strong> Next class session<br/>
                            <strong>Instructions:</strong> Complete all exercises and bring any questions to our next meeting. 
                            Focus extra attention on areas marked for improvement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}