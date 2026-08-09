'use client'
import MDEditor from '@uiw/react-md-editor';
import { MarkdownPreviewRef } from '@uiw/react-markdown-preview'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { generate } from './action'
import CodeReferences from './code-references';
import Image from 'next/image';
import { DownloadIcon, Sparkles, Code2, GitBranch, FileSearch } from 'lucide-react';
import { api } from '@/trpc/react';
import useProject from "@/app/hooks/use-project";
import { toast } from 'sonner';

type Props = {}

const SAMPLE_QUESTIONS = [
    { icon: <FileSearch className="h-4 w-4" />, text: 'Which file should I edit to change the home page?' },
    { icon: <Code2 className="h-4 w-4" />, text: 'How is authentication handled in this project?' },
    { icon: <GitBranch className="h-4 w-4" />, text: 'Where is the database schema defined?' },
    { icon: <Sparkles className="h-4 w-4" />, text: 'How do I add a new API route?' },
]

const AskQuestionCard = (props: Props) => {
    const [open, setOpen] = React.useState(false)
    const [question, setQuestion] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [answer, setAnswer] = React.useState('')
    const saveAnswer = api.question.saveAnswer.useMutation()
    const { projectId } = useProject()

    const answerRef = React.useRef<MarkdownPreviewRef>(null)
    const [filesReferenced, setFilesReferenced] = React.useState<Awaited<ReturnType<typeof generate>>['filesReferenced']>([])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!projectId) return
        setAnswer('')
        e.preventDefault()
        setIsLoading(true)
        const { output, filesReferenced } = await generate(question, projectId)
        setOpen(true)
        setFilesReferenced(filesReferenced)
        setAnswer(output)
        setIsLoading(false)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={(open) => {
                setOpen(open)
                if (!open) setQuestion('')
            }}>
                <DialogContent className='sm:max-w-[80vw]'>
                    <div className="flex items-center gap-2">
                        <DialogTitle>
                            <Image src="/logo-1.png" alt="Logo" width={40} height={40} />
                        </DialogTitle>
                        <Button isLoading={saveAnswer.isPending || isLoading} variant="outline" onClick={() => {
                            saveAnswer.mutate({ projectId, question, answer, filesReferenced }, {
                                onSuccess: () => toast.success('Answer saved'),
                                onError: () => toast.error('Failed to save answer')
                            })
                        }}>
                            <DownloadIcon className="w-4 h-4" />
                            Save Answer
                        </Button>
                    </div>
                    <MDEditor.Markdown source={answer} className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll custom-ref' />
                    <CodeReferences filesReferenced={filesReferenced} />
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogContent>
            </Dialog>

            <Card className="relative col-span-3 h-full">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <CardTitle>Ask a question</CardTitle>
                    </div>
                    <CardDescription>
                        Ask anything about your codebase — Dionysus will find the answer.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        {SAMPLE_QUESTIONS.map((q, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setQuestion(q.text)}
                                className="flex items-center gap-2 rounded-lg border border-dashed p-2 text-left text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                            >
                                {q.icon}
                                <span className="line-clamp-1">{q.text}</span>
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Textarea
                            placeholder="Ask anything about your codebase..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="min-h-[100px] resize-none"
                        />
                        <Button isLoading={isLoading} className="w-full">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Ask Dionysus!
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard