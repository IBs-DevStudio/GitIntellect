'use client'
import { Presentation, Clock, Users, AlertCircle, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react'
import React from 'react'

const DEMO_MEETING = {
    name: 'Product Sync — Q3 Planning',
    createdAt: new Date('2025-07-15T10:30:00'),
    duration: '31 mins',
    participants: 5,
    issues: [
        {
            id: '1',
            headline: 'Authentication flow needs refactoring',
            gist: 'The current auth flow has inconsistencies across mobile and web.',
            summary: 'Team agreed to refactor the authentication module to use a unified token strategy. Assigned to backend team, due next sprint.',
            start: '00:02:10',
            end: '00:08:45',
            tag: 'Critical',
            tagColor: 'bg-red-100 text-red-600',
            borderColor: 'border-l-red-500',
        },
        {
            id: '2',
            headline: 'Database query performance issues',
            gist: 'Several slow queries identified in the reporting module.',
            summary: 'Need to add indexes on the reports table and cache frequently accessed queries. DBA to review and implement.',
            start: '00:12:00',
            end: '00:19:30',
            tag: 'Performance',
            tagColor: 'bg-orange-100 text-orange-600',
            borderColor: 'border-l-orange-500',
        },
        {
            id: '3',
            headline: 'New onboarding flow design approved',
            gist: 'Design team presented updated onboarding screens.',
            summary: 'New onboarding flow was approved by stakeholders. Frontend team to begin implementation in the next sprint.',
            start: '00:25:00',
            end: '00:31:15',
            tag: 'Approved',
            tagColor: 'bg-green-100 text-green-600',
            borderColor: 'border-l-green-500',
        },
    ]
}

const MeetingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 px-6 ">
            {/* Demo Banner */}
            <div className="flex items-center gap-3 rounded-xl border border-yellow-300 bg-yellow-50 px-5 py-3 text-sm text-yellow-800 mb-6">
                <Sparkles className="h-4 w-4 shrink-0 text-yellow-500" />
                <span><strong>Demo Mode:</strong> Meeting analysis requires paid API credits. Upgrade to unlock AI-powered summaries.</span>
            </div>

            {/* Header Card */}
            <div className="rounded-2xl bg-white border shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div style={{ backgroundColor: '#4f46e5', borderRadius: '12px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
    <Presentation style={{ height: '28px', width: '28px', color: 'white' }} />
</div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                                {DEMO_MEETING.createdAt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <h1 className="text-2xl font-bold text-gray-900">{DEMO_MEETING.name}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                                    <Clock className="h-3 w-3" /> {DEMO_MEETING.duration}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                                    <Users className="h-3 w-3" /> {DEMO_MEETING.participants} participants
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                                    <AlertCircle className="h-3 w-3" /> {DEMO_MEETING.issues.length} issues
                                </span>
                            </div>
                        </div>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-4 py-1.5 text-xs font-semibold text-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                    </span>
                </div>
            </div>

            {/* Issues Grid */}
            <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-indigo-500" />
                Issues Identified
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {DEMO_MEETING.issues.map((issue) => (
                    <div key={issue.id} className={`rounded-xl bg-white border-l-4 ${issue.borderColor} border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}>
                        <div className="flex items-center justify-between">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${issue.tagColor}`}>
                                {issue.tag}
                            </span>
                            <span className="text-xs font-mono text-gray-400">{issue.start} → {issue.end}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{issue.headline}</h3>
                        <p className="text-xs text-gray-500 italic leading-relaxed">{issue.gist}</p>
                        <div className="border-t pt-3 mt-auto">
                            <p className="text-xs text-gray-600 leading-relaxed">{issue.summary}</p>
                        </div>
                        <button className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:underline mt-1">
                            View details <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MeetingPage