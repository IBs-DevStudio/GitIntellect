'use client'
import { Presentation } from 'lucide-react'
import React from 'react'

const DEMO_MEETING = {
    name: 'Product Sync — Q3 Planning',
    createdAt: new Date('2025-07-15T10:30:00'),
    issues: [
        {
            id: '1',
            headline: 'Authentication flow needs refactoring',
            gist: 'The current auth flow has inconsistencies across mobile and web.',
            summary: 'Team agreed to refactor the authentication module to use a unified token strategy. Assigned to backend team, due next sprint.',
            start: '00:02:10',
            end: '00:08:45',
        },
        {
            id: '2',
            headline: 'Database query performance issues',
            gist: 'Several slow queries identified in the reporting module.',
            summary: 'Need to add indexes on the reports table and cache frequently accessed queries. DBA to review and implement.',
            start: '00:12:00',
            end: '00:19:30',
        },
        {
            id: '3',
            headline: 'New onboarding flow design approved',
            gist: 'Design team presented updated onboarding screens.',
            summary: 'New onboarding flow was approved by stakeholders. Frontend team to begin implementation in the next sprint.',
            start: '00:25:00',
            end: '00:31:15',
        },
    ]
}

const MeetingDetails = ({ meetingId }: { meetingId: string }) => {
    return (
        <div className="p-8">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 mb-6">
                ⚠️ <strong>Demo Mode:</strong> Meeting analysis requires paid API credits. Upgrade to a paid plan to unlock AI-powered meeting summaries and issue extraction.
            </div>
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 border-b pb-6 lg:mx-0 lg:max-w-none">
                <div className="flex items-center gap-x-6">
                    <div className="rounded-full border bg-white p-3">
                        <Presentation className="h-7 w-7" />
                    </div>
                    <h1>
                        <div className="text-sm leading-6 text-gray-500">
                            Meeting on{" "}
                            <span className="text-gray-700">
                                {DEMO_MEETING.createdAt.toLocaleString()}
                            </span>
                        </div>
                        <div className="mt-1 text-base font-semibold leading-6 text-gray-900">
                            {DEMO_MEETING.name}
                        </div>
                    </h1>
                </div>
            </div>
            <div className="h-4"></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {DEMO_MEETING.issues.map((issue) => (
                    <div key={issue.id} className="rounded-lg border bg-white p-4 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">{issue.start} – {issue.end}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm">{issue.headline}</h3>
                        <p className="text-xs text-gray-500 italic">{issue.gist}</p>
                        <p className="text-xs text-gray-600">{issue.summary}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MeetingDetails