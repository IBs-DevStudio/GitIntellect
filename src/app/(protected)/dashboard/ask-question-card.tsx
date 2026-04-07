'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/app/hooks/use-project'
import Image from 'next/image'
import React, { useState } from 'react'

const AskQuestionCard = () => {
  const { project } = useProject()
  const [question, setQuestion] = useState('')
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!question.trim()) return
    setOpen(true)
    // TODO: call tRPC Q&A endpoint
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Image src='/logo-1.png' alt='dionysus' width={40} height={48} />
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{answer}</p>
        </DialogContent>
      </Dialog>

      <Card className='relative col-span-3'>
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder='Which file should I edit to change the home page?'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="h-4"></div>
            <Button type='submit'>
              Ask Intellect!
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default AskQuestionCard