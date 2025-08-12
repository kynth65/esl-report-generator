interface ReportData {
    student_name: string;
    class_level: string;
    date: string;
    lesson_focus: string;
    student_performance: string;
    key_achievements: string;
    areas_for_improvement: string;
    skills_assessment: {
        [key: string]: {
            level: string;
            details: string;
        };
    };
    recommendations: string[];
    homework_exercises: {
        multiple_choice_questions: Array<{
            question: string;
            options: {
                a: string;
                b: string;
                c: string;
                d: string;
            };
            correct_answer: string;
        }>;
        sentence_constructions: Array<{
            instruction: string;
            example: string;
        }>;
    };
}

interface DailyReportPreviewProps {
    data?: ReportData;
}

export function DailyReportPreview({ data }: DailyReportPreviewProps) {
    return (
        <div className="p-8 space-y-8">
            {/* Report Header */}
            <div className="text-center border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-[#769fcd] mb-2">
                    Daily Progress Summary
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Date:</strong> {data?.date ? new Date(data.date).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                    <p><strong>Student:</strong> {data?.student_name || '[Student Name]'}</p>
                    <p><strong>Class Level:</strong> {data?.class_level || '[Level]'}</p>
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
                            <strong>Lesson Focus:</strong> {data?.lesson_focus || '[AI-generated summary of today\'s lesson focus and main topics covered]'}
                        </p>
                        <p>
                            <strong>Student Performance:</strong> {data?.student_performance || '[AI analysis of student engagement, participation, and comprehension levels]'}
                        </p>
                        <p>
                            <strong>Key Achievements:</strong> {data?.key_achievements || '[Specific accomplishments and breakthroughs observed during the lesson]'}
                        </p>
                        <p>
                            <strong>Areas for Improvement:</strong> {data?.areas_for_improvement || '[Constructive feedback on areas that need additional attention]'}
                        </p>
                    </div>
                </div>

                {/* Skills Assessment Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                    {data?.skills_assessment ? Object.entries(data.skills_assessment).map(([skill, assessment], index) => {
                        const getColorClass = (level: string) => {
                            switch (level.toLowerCase()) {
                                case 'excellent': return 'bg-emerald-100 text-emerald-800';
                                case 'good': return 'bg-green-100 text-green-800';
                                case 'progressing': return 'bg-blue-100 text-blue-800';
                                case 'needs practice': return 'bg-amber-100 text-amber-800';
                                default: return 'bg-gray-100 text-gray-800';
                            }
                        };
                        
                        return (
                            <div key={index} className="bg-white p-4 rounded-lg border border-[#d6e6f2]">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-gray-800 capitalize">
                                        {skill.replace(/_/g, ' & ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass(assessment.level)}`}>
                                        {assessment.level}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600">{assessment.details}</p>
                            </div>
                        );
                    }) : [
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
                        {data?.recommendations && data.recommendations.length > 0 ? 
                            data.recommendations.map((recommendation, index) => (
                                <li key={index}>• {recommendation}</li>
                            )) : 
                            [
                                'Focus on [specific grammar point] with additional practice exercises',
                                'Continue vocabulary building in [topic area] to reinforce today\'s learning',
                                'Practice pronunciation of [specific sounds/words] identified during the lesson',
                                'Review and expand on [concept] that showed good understanding'
                            ].map((recommendation, index) => (
                                <li key={index}>• {recommendation}</li>
                            ))
                        }
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
                        Complete these exercises to reinforce today's learning objectives
                    </p>
                    
                    {/* Multiple Choice Questions Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 bg-gradient-to-r from-[#769fcd] to-[#5a7ba1] text-white p-3 rounded">
                            Part A: Multiple Choice Questions
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 italic">Choose the best answer for each question by circling the letter.</p>
                        
                        <div className="space-y-4">
                            {data?.homework_exercises?.multiple_choice_questions && data.homework_exercises.multiple_choice_questions.length > 0 ? 
                                data.homework_exercises.multiple_choice_questions.map((mcq, i) => (
                                    <div key={i} className="bg-white p-4 rounded border border-[#d6e6f2]">
                                        <div className="space-y-3">
                                            <p className="font-medium text-gray-800">
                                                <strong>{i + 1}.</strong> {mcq.question}
                                            </p>
                                            <div className="ml-4 space-y-2">
                                                <div className="text-sm text-gray-700"><strong>A)</strong> {mcq.options.a}</div>
                                                <div className="text-sm text-gray-700"><strong>B)</strong> {mcq.options.b}</div>
                                                <div className="text-sm text-gray-700"><strong>C)</strong> {mcq.options.c}</div>
                                                <div className="text-sm text-gray-700"><strong>D)</strong> {mcq.options.d}</div>
                                            </div>
                                        </div>
                                    </div>
                                )) :
                                Array.from({ length: 5 }, (_, i) => (
                                    <div key={i} className="bg-white p-4 rounded border border-[#d6e6f2]">
                                        <div className="space-y-3">
                                            <p className="font-medium text-gray-800">
                                                <strong>{i + 1}.</strong> Sample multiple choice question {i + 1} based on lesson content
                                            </p>
                                            <div className="ml-4 space-y-2">
                                                <div className="text-sm text-gray-700"><strong>A)</strong> Sample option A</div>
                                                <div className="text-sm text-gray-700"><strong>B)</strong> Sample option B</div>
                                                <div className="text-sm text-gray-700"><strong>C)</strong> Sample option C</div>
                                                <div className="text-sm text-gray-700"><strong>D)</strong> Sample option D</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* Sentence Construction Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 bg-gradient-to-r from-[#769fcd] to-[#5a7ba1] text-white p-3 rounded">
                            Part B: Sentence Construction
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 italic">Follow the instructions to create sentences. Use the examples as your guide.</p>
                        
                        <div className="space-y-4">
                            {data?.homework_exercises?.sentence_constructions && data.homework_exercises.sentence_constructions.length > 0 ? 
                                data.homework_exercises.sentence_constructions.map((construction, i) => (
                                    <div key={i} className="bg-white p-4 rounded border border-[#d6e6f2]">
                                        <div className="flex">
                                            <div className="w-8 flex-shrink-0">
                                                <span className="font-semibold text-gray-800">{i + 1}.</span>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="text-sm">
                                                    <strong>Instructions:</strong> {construction.instruction}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <strong>Example:</strong> {construction.example}
                                                </div>
                                                <div className="text-sm pt-2">
                                                    <strong>Your sentence:</strong> ________________________________________________
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) :
                                Array.from({ length: 5 }, (_, i) => (
                                    <div key={i} className="bg-white p-4 rounded border border-[#d6e6f2]">
                                        <div className="flex">
                                            <div className="w-8 flex-shrink-0">
                                                <span className="font-semibold text-gray-800">{i + 1}.</span>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="text-sm">
                                                    <strong>Instructions:</strong> Sample sentence construction instruction {i + 1}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <strong>Example:</strong> Sample example sentence {i + 1}
                                                </div>
                                                <div className="text-sm pt-2">
                                                    <strong>Your sentence:</strong> ________________________________________________
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
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