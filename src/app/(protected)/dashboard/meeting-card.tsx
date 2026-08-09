"use client";
import { Presentation, Upload } from "lucide-react";
import React from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useProject from "@/app/hooks/use-project";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useRefetch from "@/app/hooks/use-refetch";
import { Input } from "@/components/ui/input";

const MeetingCard = () => {
    const [audioUrl, setAudioUrl] = React.useState('');
    const [meetingName, setMeetingName] = React.useState('');
    const [isUploading, setIsUploading] = React.useState(false);
    const uploadMeeting = api.project.uploadMeeting.useMutation();
    const refetch = useRefetch();
    const router = useRouter();
    const { project } = useProject();

    const handleSubmit = async () => {
        if (!project || !audioUrl || !meetingName) {
            toast.error('Please fill in all fields');
            return;
        }
        setIsUploading(true);
        try {
            await uploadMeeting.mutateAsync({
                audio_url: audioUrl,
                name: meetingName,
                projectId: project.id,
            });
            refetch();
            toast.success('Meeting uploaded');
            router.push('/meetings');
        } catch (error) {
            toast.error('Failed to upload meeting');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="col-span-2 flex flex-col items-center justify-center rounded-lg border bg-white p-10 gap-4">
            <Presentation className="h-10 w-10" />
            <h3 className="text-sm font-semibold text-gray-900">Add a Meeting</h3>
            <p className="text-center text-sm text-gray-500">
                Paste a public audio URL to analyse your meeting with Dionysus.
            </p>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800 text-center">
                ⚠️ <strong>Demo Mode:</strong> Meeting analysis requires paid API credits.
            </div>
            <Input
                placeholder="Meeting name"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                className="w-full max-w-sm"
            />
            <Input
                placeholder="Audio URL (e.g. https://...)"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="w-full max-w-sm"
            />
            <Button onClick={handleSubmit} isLoading={isUploading}>
                <Upload className="mr-1.5 h-5 w-5" />
                Upload Meeting
            </Button>
        </Card>
    );
};

export default MeetingCard;