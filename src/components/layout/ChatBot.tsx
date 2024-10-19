'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { X, Send, Paperclip, FileText, Film, XCircle, ImageIcon, BadgeHelpIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/Dialog'

type MessageContent = string | string[] | { label: string; value: string }[] | {
    type: 'media'
    url: string
    mimeType: string
    fileName: string
}

interface Message {
    type: 'text' | 'buttons' | 'quickReplies' | 'input' | 'media'
    content: MessageContent
    isUser: boolean
}

interface WebSocketMessage {
    type: 'text' | 'buttons' | 'quickReplies' | 'input' | 'media'
    content: MessageContent
}

export default function ChatSupport() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [showPopup, setShowPopup] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const chatRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const wsRef = useRef<WebSocket | null>(null)

    const handleFileSelect = useCallback((file: File) => {
        if (file.size > 15 * 1024 * 1024) {
            alert('File size must be less than 15MB')
            return
        }
        setSelectedFile(file)
    }, [])

    const sendMessage = useCallback((message: Message) => {
        setMessages((prev) => [...prev, message])
        if (wsRef.current) {
            wsRef.current.send(JSON.stringify(message))
        }
    }, [])

    const handleFileSend = useCallback(async () => {
        if (!selectedFile) return
        try {
            const buffer = await selectedFile.arrayBuffer()
            const message: Message = {
                type: 'media',
                content: {
                    type: 'media',
                    url: URL.createObjectURL(selectedFile),
                    mimeType: selectedFile.type,
                    fileName: selectedFile.name
                },
                isUser: true
            }
            sendMessage(message)
            if (wsRef.current) {
                wsRef.current.send(buffer)
            }
            setSelectedFile(null)
        } catch (error) {
            console.error('Error sending file:', error)
        }
    }, [selectedFile, sendMessage])

    const MediaPreview = useCallback(({ file }: { file: File }) => {
        const isImage = file.type.startsWith('image/')
        const isVideo = file.type.startsWith('video/')
        return (
            <div className="relative bg-sky-50 p-2 rounded-lg flex items-center gap-2">
                {isImage && <ImageIcon size={20} className="text-sky-600" />}
                {isVideo && <Film size={20} className="text-sky-600" />}
                {!isImage && !isVideo && <FileText size={20} className="text-sky-600" />}
                <span className="text-sm truncate">{file.name}</span>
                <button
                    onClick={() => setSelectedFile(null)}
                    className="absolute -top-2 -right-2 text-gray-500 hover:text-gray-700"
                >
                    <XCircle size={16} />
                </button>
            </div>
        )
    }, [])

    const jsonToJsx = useCallback((data: WebSocketMessage): Message => {
        return { ...data, isUser: false }
    }, [])

    const handleIncomingMessage = useCallback((data: WebSocketMessage) => {
        const message = jsonToJsx(data)
        setMessages((prev) => [...prev, message])
    }, [jsonToJsx])

    useEffect(() => {
        wsRef.current = new WebSocket('wss://your-websocket-url.com')
        wsRef.current.onopen = () => setIsOnline(true)
        wsRef.current.onclose = () => setIsOnline(false)
        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data) as WebSocketMessage
            handleIncomingMessage(data)
        }

        return () => {
            if (wsRef.current) wsRef.current.close()
        }
    }, [handleIncomingMessage])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) setShowPopup(true)
        }, 10000)
        return () => clearTimeout(timer)
    }, [isOpen])

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const toggleChat = useCallback(() => {
        setIsOpen((prev) => !prev)
        setShowPopup(false)
    }, [])

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        if (inputMessage.trim()) {
            sendMessage({ type: 'text', content: inputMessage, isUser: true })
            setInputMessage('')
        }
    }, [inputMessage, sendMessage])

    const renderMessage = useCallback((message: Message, index: number) => {
        switch (message.type) {
            case 'media':
                const mediaContent = message.content as { type: 'media', url: string, mimeType: string, fileName: string }
                return (
                    <div
                        key={index}
                        className={`max-w-[75%] p-2 rounded-lg ${message.isUser ? 'self-end' : 'self-start'}`}
                    >
                        <Dialog>
                            <DialogTrigger asChild>
                                {mediaContent.mimeType.startsWith('image/') ? (
                                    <div className="cursor-pointer">
                                        <Image
                                            src={mediaContent.url}
                                            alt={mediaContent.fileName}
                                            width={200}
                                            height={200}
                                            className="max-w-full rounded-lg shadow-sm"
                                        />
                                    </div>
                                ) : mediaContent.mimeType.startsWith('video/') ? (
                                    <div className="cursor-pointer">
                                        <video
                                            src={mediaContent.url}
                                            controls
                                            className="max-w-full rounded-lg shadow-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-sky-50 p-3 rounded-lg flex items-center gap-2 cursor-pointer">
                                        <FileText size={20} className="text-sky-600" />
                                        <span className="text-sm">{mediaContent.fileName}</span>
                                    </div>
                                )}
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                {mediaContent.mimeType.startsWith('image/') ? (
                                    <Image
                                        src={mediaContent.url}
                                        alt={mediaContent.fileName}
                                        width={400}
                                        height={400}
                                        className="w-full h-auto"
                                    />
                                ) : mediaContent.mimeType.startsWith('video/') ? (
                                    <video
                                        src={mediaContent.url}
                                        controls
                                        className="w-full h-auto"
                                    />
                                ) : (
                                    <div className="bg-sky-50 p-3 rounded-lg flex items-center gap-2">
                                        <FileText size={20} className="text-sky-600" />
                                        <span className="text-sm">{mediaContent.fileName}</span>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                )
            case 'text':
                return (
                    <div
                        key={index}
                        className={`max-w-[75%] p-3 rounded-lg ${message.isUser
                            ? 'bg-blue-600 text-white self-end'
                            : 'bg-gray-100 text-gray-800 self-start'
                            } shadow-sm animate-fadeIn`}
                    >
                        {message.content as string}
                    </div>
                )
            case 'buttons':
                return (
                    <div key={index} className="flex flex-wrap gap-2 animate-fadeIn">
                        {(message.content as string[]).map((button, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage({ type: 'text', content: button, isUser: true })}
                                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm hover:bg-blue-200 transition-colors"
                            >
                                {button}
                            </button>
                        ))}
                    </div>
                )
            case 'quickReplies':
                return (
                    <div key={index} className="flex flex-wrap gap-2 animate-fadeIn">
                        {(message.content as { label: string; value: string }[]).map((reply, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage({ type: 'text', content: reply.value, isUser: true })}
                                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm hover:bg-blue-200 transition-colors"
                            >
                                {reply.label}
                            </button>
                        ))}
                    </div>
                )
            case 'input':
                return (
                    <div key={index} className="w-full animate-fadeIn">
                        <input
                            type="text"
                            placeholder={message.content as string}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage({ type: 'text', content: e.currentTarget.value, isUser: true })
                                    e.currentTarget.value = ''
                                }
                            }}
                        />
                    </div>
                )
        }
    }, [sendMessage])

    return (
        <div className="fixed bottom-4 right-4 z-50 font-sans">
            {showPopup && !isOpen && (
                <div className="bg-white rounded-xl p-4 shadow-lg mb-4 animate-bounce">
                    <p className="text-sky-600 font-semibold">Need any help? 👋</p>
                </div>
            )}
            <div
                ref={chatRef}
                className={`bg-white rounded-xl shadow-2xl transition-all duration-300 ease-in-out flex flex-col ${isOpen ? 'h-[480px] w-[350px] sm:w-[400px] opacity-100' : 'h-0 w-0 opacity-0 overflow-hidden'
                    }`}
            >
                <div className="flex justify-between items-center p-4 bg-sky-500 text-white rounded-t-xl">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">Chat Support</h3>
                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    </div>
                    <Button
                        onClick={toggleChat}
                        variant="ghost"
                        className="text-white hover:bg-sky-600"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4 flex flex-col bg-gray-50">
                    {messages.map((msg, index) => renderMessage(msg, index))}
                    <div ref={bottomRef} />
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
                    {selectedFile && <MediaPreview file={selectedFile} />}
                    <div className="flex items-center space-x-2 bg-white rounded-xl p-2 shadow-sm mt-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        />
                        <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            variant="ghost"
                            className="text-gray-500 hover:text-sky-500 hover:bg-sky-50"
                        >
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-grow px-3 py-2 bg-transparent focus:outline-none"
                        />
                        <Button
                            type="submit"
                            onClick={selectedFile ? handleFileSend : undefined}
                            disabled={!inputMessage.trim() && !selectedFile}
                            variant="ghost"
                            className={`${inputMessage.trim() || selectedFile
                                ? 'text-sky-500 hover:bg-sky-50'
                                : 'text-gray-400'
                                }`}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </div>
            {!isOpen && (
                <Button
                    onClick={toggleChat}
                    variant="default"
                    className="bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-600 p-5"
                >
                    <BadgeHelpIcon className="h-6 w-6" />
                </Button>
            )}
        </div>
    )
}